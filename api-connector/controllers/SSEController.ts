/**
 * SSE Controller für xrisk Workflow Events
 * 
 * Verwaltet Server-Sent Events Verbindungen mit automatischem Reconnect
 * und Event-Handler-System
 */

import {
  WorkflowEvent,
  WorkflowEventHandler,
  ConnectionStatusHandler,
  SSEConnectionStatus,
  SSEControllerConfig,
} from '../types/sse.js';

export class SSEController {
  private eventSource: EventSource | null = null;
  private taskId: string | null = null;
  private baseUrl: string;
  private config: Required<SSEControllerConfig>;
  
  // Event Handler
  private eventHandlers: Set<WorkflowEventHandler> = new Set();
  private statusHandlers: Set<ConnectionStatusHandler> = new Set();
  
  // Reconnect Management
  private reconnectAttempts: number = 0;
  private reconnectTimer: number | null = null;
  private isManualClose: boolean = false;
  
  // Status
  private currentStatus: SSEConnectionStatus = 'disconnected';
  private lastEvent: WorkflowEvent | null = null;

  constructor(config: SSEControllerConfig = {}) {
    this.baseUrl = config.baseUrl || '';
    
    // Standard-Konfiguration mit Werten aus workflow.js
    this.config = {
      baseUrl: config.baseUrl || '',
      maxReconnectAttempts: config.maxReconnectAttempts ?? 5,
      reconnectDelay: config.reconnectDelay ?? 2000, // 2 Sekunden
      reconnectDelayMax: config.reconnectDelayMax ?? 30000, // 30 Sekunden max
      reconnectBackoffMultiplier: config.reconnectBackoffMultiplier ?? 1.5,
      heartbeatTimeout: config.heartbeatTimeout ?? 30000, // 30 Sekunden
      autoReconnect: config.autoReconnect ?? true,
    };
  }

  /**
   * Registriert einen Event-Handler
   * 
   * @param handler Handler-Funktion, die bei jedem Event aufgerufen wird
   * @returns Cleanup-Funktion zum Entfernen des Handlers
   */
  onEvent(handler: WorkflowEventHandler): () => void {
    this.eventHandlers.add(handler);
    
    // Wenn bereits ein Event empfangen wurde, Handler sofort mit letztem Event aufrufen
    if (this.lastEvent) {
      try {
        handler(this.lastEvent);
      } catch (error) {
        console.error('Error in event handler:', error);
      }
    }
    
    // Cleanup-Funktion
    return () => {
      this.eventHandlers.delete(handler);
    };
  }

  /**
   * Registriert einen Connection-Status-Handler
   * 
   * @param handler Handler-Funktion, die bei Status-Änderungen aufgerufen wird
   * @returns Cleanup-Funktion zum Entfernen des Handlers
   */
  onStatusChange(handler: ConnectionStatusHandler): () => void {
    this.statusHandlers.add(handler);
    
    // Handler sofort mit aktuellem Status aufrufen
    try {
      handler(this.currentStatus);
    } catch (error) {
      console.error('Error in status handler:', error);
    }
    
    // Cleanup-Funktion
    return () => {
      this.statusHandlers.delete(handler);
    };
  }

  /**
   * Verbindet zum SSE-Stream für einen bestimmten Task
   * 
   * @param taskId Task-ID für den Workflow
   * @returns Promise<void>
   */
  async connect(taskId: string): Promise<void> {
    if (this.taskId === taskId && this.isConnected()) {
      console.log(`Already connected to task ${taskId}`);
      return;
    }

    // Alte Verbindung schließen
    this.disconnect();

    this.taskId = taskId;
    this.isManualClose = false;
    this.reconnectAttempts = 0;

    return this._connect();
  }

  /**
   * Trennt die SSE-Verbindung
   */
  disconnect(): void {
    this.isManualClose = true;
    this._clearReconnectTimer();
    
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    
    this._setStatus('disconnected');
    this.taskId = null;
  }

  /**
   * Prüft ob eine Verbindung aktiv ist
   */
  isConnected(): boolean {
    return (
      this.eventSource !== null &&
      this.eventSource.readyState === EventSource.OPEN &&
      this.currentStatus === 'connected'
    );
  }

  /**
   * Gibt den aktuellen Connection-Status zurück
   */
  getStatus(): SSEConnectionStatus {
    return this.currentStatus;
  }

  /**
   * Gibt die aktuelle Task-ID zurück
   */
  getTaskId(): string | null {
    return this.taskId;
  }

  /**
   * Gibt das letzte empfangene Event zurück
   */
  getLastEvent(): WorkflowEvent | null {
    return this.lastEvent;
  }

  /**
   * Interne Verbindungsmethode
   */
  private async _connect(): Promise<void> {
    if (!this.taskId) {
      throw new Error('No task ID provided');
    }

    if (this.isManualClose) {
      return;
    }

    this._setStatus(this.reconnectAttempts > 0 ? 'reconnecting' : 'connecting');

    const url = `${this.baseUrl}/workflow/stream/${this.taskId}`;
    
    try {
      this.eventSource = new EventSource(url);

      this.eventSource.onopen = () => {
        console.log(`[SSE] Connection established for task ${this.taskId}`);
        this.reconnectAttempts = 0;
        this._setStatus('connected');
      };

      this.eventSource.onmessage = (event: MessageEvent) => {
        this._handleMessage(event);
      };

      this.eventSource.onerror = (error: Event) => {
        console.warn(`[SSE] Connection error for task ${this.taskId}:`, error);
        this._handleError();
      };

    } catch (error) {
      console.error(`[SSE] Failed to create EventSource:`, error);
      this._handleError();
    }
  }

  /**
   * Behandelt eingehende SSE-Nachrichten
   */
  private _handleMessage(event: MessageEvent): void {
    try {
      // Heartbeat ignorieren
      if (event.data.trim() === 'ping' || event.data.trim() === ': ping') {
        return;
      }

      const data: WorkflowEvent = JSON.parse(event.data);

      // Connection-Event behandeln
      if (data.connected) {
        console.log(`[SSE] Stream ready for task ${data.task_id}`);
        return;
      }

      // Stream-Closed-Event behandeln
      if (data.stream_closed) {
        console.log(`[SSE] Stream closed for task ${this.taskId}`);
        this._setStatus('closed');
        
        // Prüfe ob automatischer Reconnect gewünscht ist
        if (this.config.autoReconnect && !this.isManualClose) {
          // Nur reconnecten wenn nicht completed oder failed
          const status = this.lastEvent?.meta?.status || this.lastEvent?.status;
          if (this.lastEvent && 
              status !== 'completed' && 
              status !== 'failed') {
            this._scheduleReconnect();
          }
        }
        return;
      }

      // Event speichern
      this.lastEvent = data;

      // Event-Handler aufrufen
      this._notifyEventHandlers(data);

      // Prüfe ob Stream geschlossen werden sollte
      if (this._shouldCloseStream(data)) {
        const status = data.meta?.status || data.status || data.state;
        console.log(`[SSE] Stream should be closed (status: ${status})`);
        this._setStatus('closed');
        
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }
      }

    } catch (error) {
      console.error('[SSE] Failed to parse event data:', error);
    }
  }

  /**
   * Prüft ob der Stream geschlossen werden sollte
   */
  private _shouldCloseStream(event: WorkflowEvent): boolean {
    // Verwende meta.status als Quelle der Wahrheit (fallback zu status oder state für backwards compatibility)
    const status = event.meta?.status || event.status || event.state;
    
    // Stream wird geschlossen bei:
    return (
      status === 'completed' ||
      status === 'failed' ||
      status === 'inquiry_awaiting_response' ||
      status === 'inquiry_required' ||
      status === 'login_required' ||
      event.stream_closed === true
    );
  }

  /**
   * Behandelt Verbindungsfehler
   */
  private _handleError(): void {
    if (this.isManualClose) {
      return;
    }

    this._setStatus('error');

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    // Reconnect versuchen
    if (this.config.autoReconnect) {
      this._scheduleReconnect();
    }
  }

  /**
   * Plant einen Reconnect-Versuch
   */
  private _scheduleReconnect(): void {
    if (this.isManualClose || !this.taskId) {
      return;
    }

    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      console.error(
        `[SSE] Max reconnect attempts (${this.config.maxReconnectAttempts}) reached for task ${this.taskId}`
      );
      this._setStatus('error');
      return;
    }

    this.reconnectAttempts++;
    
    // Exponential backoff
    const delay = Math.min(
      this.config.reconnectDelay * Math.pow(this.config.reconnectBackoffMultiplier, this.reconnectAttempts - 1),
      this.config.reconnectDelayMax
    );

    console.log(
      `[SSE] Scheduling reconnect attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts} ` +
      `for task ${this.taskId} in ${delay}ms`
    );

    this._clearReconnectTimer();
    
    this.reconnectTimer = window.setTimeout(() => {
      if (!this.isManualClose && this.taskId) {
        console.log(`[SSE] Reconnecting to task ${this.taskId}...`);
        this._connect();
      }
    }, delay);
  }

  /**
   * Löscht den Reconnect-Timer
   */
  private _clearReconnectTimer(): void {
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * Setzt den Connection-Status und benachrichtigt Handler
   */
  private _setStatus(status: SSEConnectionStatus): void {
    if (this.currentStatus === status) {
      return;
    }

    this.currentStatus = status;
    this._notifyStatusHandlers(status);
  }

  /**
   * Benachrichtigt alle Event-Handler
   */
  private _notifyEventHandlers(event: WorkflowEvent): void {
    this.eventHandlers.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error('[SSE] Error in event handler:', error);
      }
    });
  }

  /**
   * Benachrichtigt alle Status-Handler
   */
  private _notifyStatusHandlers(status: SSEConnectionStatus): void {
    this.statusHandlers.forEach(handler => {
      try {
        handler(status);
      } catch (error) {
        console.error('[SSE] Error in status handler:', error);
      }
    });
  }

  /**
   * Cleanup: Entfernt alle Handler und schließt Verbindung
   */
  destroy(): void {
    this.disconnect();
    this.eventHandlers.clear();
    this.statusHandlers.clear();
    this.lastEvent = null;
  }
}


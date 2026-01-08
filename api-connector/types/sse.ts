/**
 * TypeScript Types für xrisk SSE Events
 */

/**
 * Workflow Event Meta-Daten
 */
export interface WorkflowEventMeta {
  step?: string;
  step_number?: number;
  progress?: number;
  risk_uuid?: string;
  user_uuid?: string;
  current_agent?: string;
  message?: string;
  status?: string;
  inquiries?: Array<{
    question: string;
    response: string | null;
  }>;
  login_required?: boolean;
  kleinrisiko?: boolean;
  error?: boolean;
  error_type?: string;
  risk_type?: string;
  user_not_logged_in?: boolean;
  [key: string]: any; // Weitere dynamische Felder
}

/**
 * Workflow Event Struktur
 */
export interface WorkflowEvent {
  task_id: string;
  status?: string;  // Status from meta.status (source of truth)
  meta?: WorkflowEventMeta;
  connected?: boolean;
  stream_closed?: boolean;
  error?: boolean;
  message?: string;
  error_type?: string;
  // Deprecated: state is kept for backwards compatibility but meta.status should be used
  state?: string;
}

/**
 * Workflow Step Typen
 */
export type WorkflowStep =
  | 'pending'
  | 'started'
  | 'classification'
  | 'classified'
  | 'inquiry'
  | 'inquiry_awaiting_response'
  | 'inquired'
  | 'login_required'
  | 'research'
  | 'researched'
  | 'analysis'
  | 'analyzed'
  | 'report'
  | 'combined_analysis_report'
  | 'combined_analyzed'
  | 'completed'
  | 'error'

/**
 * SSE Connection Status
 */
export type SSEConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'error'
  | 'closed';

/**
 * Event Handler Typ
 */
export type WorkflowEventHandler = (event: WorkflowEvent) => void;

/**
 * Connection Status Handler Typ
 */
export type ConnectionStatusHandler = (status: SSEConnectionStatus) => void;

/**
 * SSE Controller Konfiguration
 */
export interface SSEControllerConfig {
  baseUrl?: string;
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
  reconnectDelayMax?: number;
  reconnectBackoffMultiplier?: number;
  heartbeatTimeout?: number;
  autoReconnect?: boolean;
}


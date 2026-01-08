/**
 * Workflow Controller für xrisk Risikoanalyse
 * 
 * Verwaltet das Starten, Überwachen und Fortsetzen von Risikoanalysen
 */

import { ApiClient, ApiError } from '../api/apiClient.js';
import {
  StartWorkflowRequest,
  StartWorkflowResponse,
  WorkflowValidationErrorResponse,
  WorkflowStatusResponse,
  WorkflowStatusByRiskResponse,
  InquiryResponseRequest,
  InquiryResponseResponse,
  ResumeWorkflowRequest,
  ResumeWorkflowResponse,
  WorkflowResultResponse,
} from '../types/workflow.js';

export class WorkflowController extends ApiClient {
  constructor(baseUrl: string = '') {
    super(baseUrl);
  }

  /**
   * Startet eine neue Risikoanalyse
   * 
   * @param request Risikoanalyse-Daten
   * @returns Promise<StartWorkflowResponse>
   * @throws ApiError bei Fehlern (inkl. Validierungsfehler)
   */
  async startWorkflow(request: StartWorkflowRequest): Promise<StartWorkflowResponse> {
    try {
      const response = await this.post<StartWorkflowResponse>(
        '/workflow/start',
        request
      );

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        // Prüfe ob es ein Validierungsfehler ist
        if (error.statusCode === 400) {
          try {
            const errorData = this._parseErrorResponse(error) as WorkflowValidationErrorResponse;
            if (errorData.error === 'risk_validation_failed') {
              throw new WorkflowValidationError(
                errorData.reason || error.message,
                errorData.retryable || false,
                errorData.risk_uuid,
                errorData.status
              );
            }
          } catch (e) {
            // Wenn es bereits ein WorkflowValidationError ist, weiterwerfen
            if (e instanceof WorkflowValidationError) {
              throw e;
            }
            // Sonst normalen ApiError werfen
          }
        }
        throw error;
      }
      throw new ApiError('Workflow konnte nicht gestartet werden', 0);
    }
  }

  /**
   * Ruft den Workflow-Status anhand der Task ID ab
   * 
   * @param taskId Celery Task ID
   * @returns Promise<WorkflowStatusResponse>
   * @throws ApiError bei Fehlern
   */
  async getStatusByTaskId(taskId: string): Promise<WorkflowStatusResponse> {
    try {
      const response = await this.get<WorkflowStatusResponse>(
        `/workflow/state/task/${taskId}`
      );
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Status konnte nicht abgerufen werden', 0);
    }
  }

  /**
   * Ruft den Workflow-Status anhand der Risk UUID ab
   * 
   * @param riskUuid Risk UUID
   * @returns Promise<WorkflowStatusByRiskResponse>
   * @throws ApiError bei Fehlern
   */
  async getStatusByRiskUuid(riskUuid: string): Promise<WorkflowStatusByRiskResponse> {
    try {
      const response = await this.get<WorkflowStatusByRiskResponse>(
        `/workflow/state/risk/${riskUuid}`
      );
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Status konnte nicht abgerufen werden', 0);
    }
  }

  /**
   * Sendet Antworten auf Inquiry-Fragen und setzt den Workflow fort
   * 
   * @param request Inquiry-Antworten
   * @returns Promise<InquiryResponseResponse>
   * @throws ApiError bei Fehlern
   */
  async submitInquiryResponse(
    request: InquiryResponseRequest
  ): Promise<InquiryResponseResponse> {
    try {
      const response = await this.post<InquiryResponseResponse>(
        '/workflow/inquiry-response',
        request
      );
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Inquiry-Antworten konnten nicht übermittelt werden', 0);
    }
  }

  /**
   * Setzt einen Workflow fort oder verbindet sich neu
   * 
   * @param request Resume-Request mit Risk UUID
   * @returns Promise<ResumeWorkflowResponse>
   * @throws ApiError bei Fehlern
   */
  async resumeWorkflow(request: ResumeWorkflowRequest): Promise<ResumeWorkflowResponse> {
    try {
      const response = await this.post<ResumeWorkflowResponse>(
        '/workflow/resume',
        request
      );
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Workflow konnte nicht fortgesetzt werden', 0);
    }
  }

  /**
   * Ruft den aktuellen Workflow-Status aus der Datenbank ab
   * Gibt nur den Status zurück, startet keinen neuen Workflow-Listener
   * 
   * @param riskUuid Risk UUID
   * @returns Promise mit dem aktuellen Status aus der Datenbank
   * @throws ApiError bei Fehlern
   */
  async resume(riskUuid: string): Promise<{ status: string; risk_uuid: string; user_uuid: string; processing_since?: string; elapsed_seconds?: number; task_id?: string; inquiries?: string[]; failed_at?: string; failed_reason?: string | null; retry_count?: number }> {
    try {
      const response = await this.get<{ status: string; risk_uuid: string; user_uuid: string; processing_since?: string; elapsed_seconds?: number; task_id?: string; inquiries?: string[]; failed_at?: string; failed_reason?: string | null; retry_count?: number }>(
        `/workflow/resume/${riskUuid}`
      );
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Status konnte nicht abgerufen werden', 0);
    }
  }

  /**
   * Ruft das finale Ergebnis einer Risikoanalyse ab
   * 
   * @param riskUuid Risk UUID
   * @param userUuid User UUID (optional, wird aus Session verwendet wenn eingeloggt)
   * @returns Promise<WorkflowResultResponse>
   * @throws ApiError bei Fehlern
   */
  async getResult(
    riskUuid: string,
    userUuid?: string
  ): Promise<WorkflowResultResponse> {
    try {
      let url = `/workflow/result/${riskUuid}`;
      if (userUuid) {
        url += `?user_uuid=${encodeURIComponent(userUuid)}`;
      }

      const response = await this.get<WorkflowResultResponse>(url);
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Ergebnis konnte nicht abgerufen werden', 0);
    }
  }

  /**
   * Hilfsmethode zum Parsen von Error-Responses
   */
  private _parseErrorResponse(error: ApiError): any {
    // Versuche die Error-Message als JSON zu parsen
    try {
      return JSON.parse(error.message);
    } catch {
      return { error: error.message };
    }
  }
}

/**
 * Custom Error-Klasse für Workflow-Validierungsfehler
 */
export class WorkflowValidationError extends Error {
  constructor(
    public reason: string,
    public retryable: boolean,
    public riskUuid?: string,
    public status?: string
  ) {
    super(reason);
    this.name = 'WorkflowValidationError';
  }
}


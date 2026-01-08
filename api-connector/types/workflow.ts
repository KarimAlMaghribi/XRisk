/**
 * TypeScript Types für xrisk Workflow API
 */

/**
 * Request zum Starten einer Risikoanalyse
 */
export interface StartWorkflowRequest {
  initial_prompt: string;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  insurance_value: number;
  user_uuid?: string; // Optional, wird automatisch verwendet wenn eingeloggt
}

/**
 * Response nach dem Starten einer Risikoanalyse
 */
export interface StartWorkflowResponse {
  task_id: string;
  risk_uuid: string;
  user_uuid: string;
}

/**
 * Error Response bei Validierungsfehler (API Response Format)
 */
export interface WorkflowValidationErrorResponse {
  error: 'risk_validation_failed';
  reason: string;
  retryable: boolean;
  risk_uuid?: string;
  status?: string;
}

/**
 * Workflow Status Response (nach Task ID)
 */
export interface WorkflowStatusResponse {
  task_id: string;
  status: WorkflowStatus;
  meta?: {
    status: string;
    message?: string;
    progress?: number;
    step?: string;
    inquiries?: string[];
    risk_uuid?: string;
    user_uuid?: string;
    [key: string]: any;
  };
  result?: any;
}

/**
 * Workflow Status Response (nach Risk UUID)
 */
export interface WorkflowStatusByRiskResponse {
  status: string;
  inquiry?: string[];
  risk_uuid: string;
  user_uuid: string;
  failed_reason?: string | null;
}

/**
 * Workflow Status Typen
 */
export type WorkflowStatus =
  | 'pending'
  | 'progress'
  | 'inquiry_awaiting_response'
  | 'login_required'
  | 'validated'
  | 'classified'
  | 'inquired'
  | 'researched'
  | 'analyzed'
  | 'completed'
  | 'failed'
  | 'unknown';

/**
 * Inquiry Response Request
 */
export interface InquiryResponseRequest {
  task_id: string;
  risk_uuid: string;
  user_uuid: string;
  responses: string[]; // Array von Antworten (Index Antwort = Index Frage)
}

/**
 * Inquiry Response Response
 */
export interface InquiryResponseResponse {
  task_id: string;
  risk_uuid: string;
  message?: string;
}

/**
 * Resume Workflow Request
 */
export interface ResumeWorkflowRequest {
  risk_uuid: string;
}

/**
 * Resume Workflow Response
 */
export interface ResumeWorkflowResponse {
  action: 'retry' | 'reconnect' | 'inquiry' | 'completed' | 'rejected';
  task_id?: string;
  inquiries?: string[];
  processing_since?: string;
  elapsed_seconds?: number;
}

/**
 * Final Result Response
 */
export interface WorkflowResultResponse {
  risk_uuid: string;
  user_uuid: string;
  status: string;
  risk_type?: string;
  initial_prompt: string;
  start_date: string;
  end_date: string;
  insurance_value: number;
  inquiry?: any;
  research_current?: any;
  research_historical?: any;
  research_regulatory?: any;
  analysis?: {
    probability?: number;
    damage_amount?: number;
    premium?: number;
    [key: string]: any;
  };
  report?: {
    summary?: string;
    recommendations?: string[];
    [key: string]: any;
  };
  [key: string]: any;
}


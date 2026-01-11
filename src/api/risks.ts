import { apiFetch } from "./http";

export interface WorkflowStartPayload {
  initial_prompt: string;
  start_date: string;
  end_date: string;
  insurance_value: number;
}

export interface WorkflowStartResponse {
  task_id: string;
  risk_uuid: string;
}

export interface InquiryResponsePayload {
  task_id: string;
  risk_uuid: string;
  answers: Record<string, string>;
}

export const startWorkflow = (payload: WorkflowStartPayload) =>
  apiFetch<WorkflowStartResponse>("/workflow/start", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const inquiryResponse = (payload: InquiryResponsePayload) =>
  apiFetch<void>("/workflow/inquiry-response", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const listRisks = () => apiFetch<unknown>("/api/risks");

export const getRisk = (uuid: string) =>
  apiFetch<Record<string, unknown>>(`/api/risks/${encodeURIComponent(uuid)}`, { method: "GET" });

export const createSSE = (taskId: string) =>
  new EventSource(`/workflow/stream/${encodeURIComponent(taskId)}`);

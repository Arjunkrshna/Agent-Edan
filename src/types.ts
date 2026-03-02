export type IssueType = 'Outlook' | 'Exchange mail flow' | 'Teams' | 'OneDrive' | 'Auth' | 'General' | 'Unknown';

export interface ExtractedEntities {
  errorCodes: string[];
  impactedUserUPN: string;
  timestamps: string[];
  domains: string[];
  rawText?: string;
}

export interface Hypothesis {
  description: string;
  probability: number;
}

export interface GuidedStep {
  id: string;
  instruction: string;
  completed: boolean;
}

export interface EvidenceBundle {
  impacted_user_upn: string;
  issue_type: string;
  extracted_error_codes: string[];
  timeline: string[];
  user_provided_artifacts: string[];
  diagnosis_summary: string;
  confidence: number;
  recommended_user_steps: string[];
  recommended_uc_checks: string[];
  attachments_refs: string[];
  audit_trace_id: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  type: 'user_message' | 'artifact_uploaded' | 'tool_proposed' | 'tool_executed' | 'ticket_created' | 'policy_block' | 'system';
  message: string;
  details?: any;
}

export interface CaseState {
  id: string;
  product: string;
  userUPN: string;
  issueType: IssueType;
  extractedEntities: ExtractedEntities | null;
  hypotheses: Hypothesis[];
  confidence: number;
  guidedSteps: GuidedStep[];
  evidenceBundle: EvidenceBundle | null;
  auditTrail: AuditLog[];
  ticketStatus: string | null;
  ticketId: string | null;
}

export interface AdminState {
  approvalGranted: boolean;
  allowReadOnlyDiagnostics: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: string;
  type?: 'text' | 'reasoning' | 'action';
  imageData?: string;
}

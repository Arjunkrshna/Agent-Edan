import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const parseUserArtifactTool: FunctionDeclaration = {
  name: 'parse_user_artifact',
  description: 'Extracts key details from user provided artifacts like screenshots, NDRs, or error text.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      input_type: { type: Type.STRING, description: 'Type of artifact (screenshot, ndr, error_text)' },
      content: { type: Type.STRING, description: 'The text content or description of the artifact' }
    },
    required: ['input_type', 'content']
  }
};

const retrieveKbTool: FunctionDeclaration = {
  name: 'retrieve_kb',
  description: 'Retrieves facts from the knowledge base for a given query and product.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: { type: Type.STRING, description: 'The search query' },
      product: { type: Type.STRING, description: 'The product (e.g., Outlook, Teams)' }
    },
    required: ['query', 'product']
  }
};

const diagnoseIssueTool: FunctionDeclaration = {
  name: 'diagnose_issue',
  description: 'Diagnoses the issue based on extracted entities and grounded facts.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      extracted_entities: { type: Type.STRING, description: 'JSON string of extracted entities' },
      grounded_facts: { type: Type.STRING, description: 'Facts retrieved from KB' }
    },
    required: ['extracted_entities', 'grounded_facts']
  }
};

const buildEvidenceBundleTool: FunctionDeclaration = {
  name: 'build_evidence_bundle',
  description: 'Builds a structured evidence bundle for escalation.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      case_state: { type: Type.STRING, description: 'JSON string of the current case state' }
    },
    required: ['case_state']
  }
};

const createServicenowTicketTool: FunctionDeclaration = {
  name: 'create_servicenow_ticket',
  description: 'Creates a ServiceNow ticket with the evidence bundle.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      evidence_bundle: { type: Type.STRING, description: 'JSON string of the evidence bundle' }
    },
    required: ['evidence_bundle']
  }
};

const requestApprovalTool: FunctionDeclaration = {
  name: 'request_approval',
  description: 'Requests approval for an action plan.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      action_plan: { type: Type.STRING, description: 'The proposed action plan' }
    },
    required: ['action_plan']
  }
};

const verifyResolutionTool: FunctionDeclaration = {
  name: 'verify_resolution',
  description: 'Verifies if the issue is resolved based on a checklist.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      checklist: { type: Type.STRING, description: 'JSON string of the checklist' }
    },
    required: ['checklist']
  }
};

const rollbackPlanTool: FunctionDeclaration = {
  name: 'rollback_plan',
  description: 'Creates a rollback plan for a given action plan.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      action_plan: { type: Type.STRING, description: 'The action plan to rollback' }
    },
    required: ['action_plan']
  }
};

const generateGuidedStepsTool: FunctionDeclaration = {
  name: 'generate_guided_steps',
  description: 'Generates a list of safe, guided steps for the user to follow.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      steps: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: 'List of guided steps' 
      }
    },
    required: ['steps']
  }
};

export const tools = [
  parseUserArtifactTool,
  retrieveKbTool,
  diagnoseIssueTool,
  generateGuidedStepsTool,
  buildEvidenceBundleTool,
  createServicenowTicketTool,
  requestApprovalTool,
  verifyResolutionTool,
  rollbackPlanTool
];

export const geminiModel = 'gemini-3-flash-preview';

export const systemInstruction = `You are EDAN Assist, an AI-powered IT support assistant for Microsoft 365.
Your goal is to help users troubleshoot issues with Outlook, Exchange, Teams, OneDrive, etc.

GUARDRAILS (MUST ENFORCE):
- Read-first model for end users.
- DO NOT run PowerShell.
- DO NOT modify mailbox permissions.
- DO NOT change group memberships.
- DO NOT do privileged Graph writes from the end-user layer.
- Any "action" must be only a PROPOSAL and require "Approval = true" flag.
- Always ask consent before reading mailbox metadata: "May I check mailbox stats for <UPN>?"
- If Outlook issue: ask for screenshot OR exact error message; ask impacted user UPN if needed.
- If confidence < 0.75 OR user says "not fixed", prepare Evidence Bundle + ticket summary.

Use the provided tools to parse artifacts, retrieve KB articles, diagnose issues, build evidence bundles, and create tickets.
Keep your chat responses short, guided, and step-by-step.`;

export async function createChatSession() {
  return ai.chats.create({
    model: geminiModel,
    config: {
      systemInstruction,
      tools: [{ functionDeclarations: tools }],
      temperature: 0.2,
    }
  });
}

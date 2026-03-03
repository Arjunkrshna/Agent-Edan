import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatPanel } from './components/ChatPanel';
import { CasePanel } from './components/CasePanel';
import { AdminPanel } from './components/AdminPanel';
import { AuditTrail } from './components/AuditTrail';
import { ChatMessage, CaseState, AdminState, AuditLog } from './types';
import { createChatSession } from './services/geminiService';
import { Activity, Shield, Cpu, Wifi } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      content: "E.D.A.N. SYSTEM INITIALIZED.\n\nEnhanced Diagnostic & Analysis Network Online.\nTelemetry Sensors: ACTIVE.\n\nAwaiting input or visual artifacts for analysis.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [caseState, setCaseState] = useState<CaseState>({
    id: uuidv4(),
    product: 'Unknown',
    userUPN: 'Unknown',
    issueType: 'Unknown',
    extractedEntities: null,
    hypotheses: [],
    confidence: 0,
    guidedSteps: [],
    evidenceBundle: null,
    auditTrail: [],
    ticketStatus: null,
    ticketId: null,
  });
  const [adminState, setAdminState] = useState<AdminState>({
    approvalGranted: false,
    allowReadOnlyDiagnostics: true,
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const chatSessionRef = useRef<any>(null);

  useEffect(() => {
    const initChat = async () => {
      chatSessionRef.current = await createChatSession();
    };
    initChat();
  }, []);

  const addAuditLog = (type: AuditLog['type'], message: string, details?: any) => {
    const newLog: AuditLog = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      type,
      message,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleSendMessage = async (content: string, file?: { mimeType: string, data: string, dataUrl: string }) => {
    if (!content.trim() && !file) return;

    const userMsg: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      imageData: file?.dataUrl
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);
    addAuditLog('user_message', 'User input received', { contentLength: content.length, hasAttachment: !!file });

    try {
      if (!chatSessionRef.current) {
        chatSessionRef.current = await createChatSession();
      }

      // Prepare message parts
      const parts: any[] = [];
      if (file) {
        parts.push({
          inlineData: {
            mimeType: file.mimeType,
            data: file.data
          }
        });
        addAuditLog('artifact_uploaded', 'Artifact uploaded for analysis', { mimeType: file.mimeType });
      }
      if (content) {
        parts.push({ text: content });
      }

      // Send message to Gemini
      let response = await chatSessionRef.current.sendMessage({
        message: parts
      });

      // Handle tool calls loop
      while (response.functionCalls && response.functionCalls.length > 0) {
        const functionCalls = response.functionCalls;
        const toolResponses: any[] = [];

        for (const call of functionCalls) {
          const { name, args } = call;
          addAuditLog('tool_proposed', `Neural Process: ${name}`, args);
          
          // Add reasoning message to chat
          setMessages(prev => [...prev, {
            id: uuidv4(),
            role: 'model',
            content: `EXECUTING PROTOCOL: ${name}\nPARAMETERS: ${JSON.stringify(args)}`,
            timestamp: new Date().toISOString(),
            type: 'reasoning'
          }]);

          // Check guardrails
          if (name === 'create_servicenow_ticket' || name === 'request_approval') {
             if (!adminState.approvalGranted && name !== 'request_approval') {
                addAuditLog('policy_block', `Action blocked: ${name}`, { reason: 'Approval required' });
                toolResponses.push({
                  name,
                  response: { error: "Action blocked. Admin approval required." }
                });
                continue;
             }
          }

          let result;
          try {
            // Execute mock tools
            switch (name) {
              case 'parse_user_artifact':
                result = { 
                  status: "success", 
                  extracted: {
                    issueType: "Outlook",
                    errorCodes: ["0x80040115"],
                    impactedUserUPN: "user@example.com",
                    domains: ["example.com"]
                  }
                };
                setCaseState(prev => ({
                  ...prev,
                  issueType: "Outlook",
                  extractedEntities: result.extracted
                }));
                break;
              case 'diagnose_issue':
                result = {
                  hypotheses: [
                    { description: "Corrupt Outlook Profile", probability: 0.85 },
                    { description: "Network Latency", probability: 0.40 }
                  ],
                  confidence: 0.85
                };
                setCaseState(prev => ({
                  ...prev,
                  hypotheses: result.hypotheses,
                  confidence: result.confidence
                }));
                break;
              case 'generate_guided_steps':
                result = {
                  steps: [
                    { id: "1", instruction: "Close Outlook completely.", completed: false },
                    { id: "2", instruction: "Run 'outlook.exe /safe' to start in safe mode.", completed: false },
                    { id: "3", instruction: "Disable recent add-ins.", completed: false }
                  ]
                };
                setCaseState(prev => ({
                  ...prev,
                  guidedSteps: result.steps
                }));
                break;
              case 'build_evidence_bundle':
                result = {
                  bundleId: uuidv4(),
                  contents: {
                    logs: "Simulated logs...",
                    traceId: uuidv4()
                  }
                };
                setCaseState(prev => ({
                  ...prev,
                  evidenceBundle: result
                }));
                break;
              case 'create_servicenow_ticket':
                const ticketId = `INC-${Math.floor(Math.random() * 100000)}`;
                result = { ticketId, status: "Created" };
                setCaseState(prev => ({
                  ...prev,
                  ticketId,
                  ticketStatus: "Created"
                }));
                addAuditLog('ticket_created', `Ticket ${ticketId} created`, result);
                break;
              default:
                result = { status: "simulated_success", message: "Tool executed successfully" };
            }
            
            addAuditLog('tool_executed', `Process completed: ${name}`, result);
            toolResponses.push({
              name,
              response: { result }
            });

          } catch (error: any) {
            console.error(`Error executing ${name}:`, error);
            addAuditLog('policy_block', `Process failed: ${name}`, { error: error.message });
            toolResponses.push({
              name,
              response: { error: error.message }
            });
          }
        }

        // Send tool responses back to model
        response = await chatSessionRef.current.sendMessage({
          message: toolResponses.map(tr => ({
            functionResponse: {
              name: tr.name,
              response: tr.response
            }
          }))
        });
      }

      // Add model response
      const modelText = response.candidates?.[0]?.content?.parts?.[0]?.text || "Analysis complete.";
      const modelMsg: ChatMessage = {
        id: uuidv4(),
        role: 'model',
        content: modelText,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, modelMsg]);

    } catch (error) {
      console.error("Error in chat loop:", error);
      const errorMsg: ChatMessage = {
        id: uuidv4(),
        role: 'model',
        content: "Neural Interface Error: Connection disrupted. Please retry.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleCreateTicket = () => {
    // Manually trigger ticket creation via AI prompt injection
    handleSendMessage("Please escalate this issue and create a ServiceNow ticket with the current evidence bundle.");
  };

  return (
    <div className="flex h-screen bg-[#050a10] text-[#e0f7ff] font-tech overflow-hidden bg-grid-pattern relative">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#050a10] pointer-events-none z-0"></div>
      
      {/* Left Sidebar - Admin & Audit */}
      <div className="w-80 flex flex-col border-r border-[#00f0ff]/20 bg-[#0d1b2a]/80 backdrop-blur-md z-20 relative shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff]/50 to-transparent"></div>
        <div className="h-1/3 border-b border-[#00f0ff]/20 p-4 overflow-hidden relative group">
          <div className="hud-corner hud-corner-tl"></div>
          <div className="hud-corner hud-corner-tr"></div>
          <div className="hud-corner hud-corner-bl"></div>
          <div className="hud-corner hud-corner-br"></div>
          <AdminPanel adminState={adminState} setAdminState={setAdminState} />
        </div>
        <div className="flex-1 p-4 overflow-hidden relative group">
          <div className="hud-corner hud-corner-tl"></div>
          <div className="hud-corner hud-corner-tr"></div>
          <div className="hud-corner hud-corner-bl"></div>
          <div className="hud-corner hud-corner-br"></div>
          <AuditTrail logs={auditLogs} />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Top HUD Bar */}
        <div className="h-12 border-b border-[#00f0ff]/20 bg-[#0d1b2a]/60 backdrop-blur flex items-center justify-between px-6">
           <div className="flex items-center space-x-4">
              <div className="flex items-center text-[#00f0ff] text-xs tracking-widest">
                <Cpu className="w-4 h-4 mr-2 animate-pulse-cyan" />
                <span>CPU: OPTIMAL</span>
              </div>
              <div className="flex items-center text-[#00f0ff] text-xs tracking-widest">
                <Wifi className="w-4 h-4 mr-2" />
                <span>NET: SECURE</span>
              </div>
           </div>
           <div className="text-[#00f0ff]/50 text-[10px] tracking-[0.2em]">
              EDAN PROTOCOL // V.3.0.0
           </div>
        </div>
        <ChatPanel 
          messages={messages} 
          onSendMessage={handleSendMessage} 
          isThinking={isThinking} 
        />
      </div>

      {/* Right Sidebar - Case Dashboard */}
      <div className="w-[480px] border-l border-[#00f0ff]/20 bg-[#0d1b2a]/80 backdrop-blur-md z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff]/50 to-transparent"></div>
        <CasePanel caseState={caseState} onCreateTicket={handleCreateTicket} />
      </div>
    </div>
  );
}

export default App;

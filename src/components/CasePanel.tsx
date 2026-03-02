import { useState } from 'react';
import { CaseState } from '../types';
import { FileText, CheckCircle, AlertTriangle, ShieldAlert, ClipboardList, Cpu, Activity, BarChart3, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CasePanelProps {
  caseState: CaseState;
  onCreateTicket?: () => void;
}

export function CasePanel({ caseState, onCreateTicket }: CasePanelProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'diagnosis' | 'steps' | 'evidence' | 'escalation'>('details');

  const tabs = [
    { id: 'details', label: 'TELEMETRY', icon: FileText },
    { id: 'diagnosis', label: 'DIAGNOSTICS', icon: Activity },
    { id: 'steps', label: 'PROTOCOL', icon: CheckCircle },
    { id: 'evidence', label: 'EVIDENCE', icon: ClipboardList },
    { id: 'escalation', label: 'ESCALATION', icon: ShieldAlert },
  ];

  return (
    <div className="flex flex-col h-full bg-[#1b263b]/80 backdrop-blur-md overflow-hidden relative z-10 font-tech">
      
      {/* Tabs */}
      <div className="flex border-b border-[#00f0ff]/20 overflow-x-auto bg-[#0d1b2a]/90 scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)} 
              className={`relative px-6 py-5 text-[10px] font-display font-bold tracking-[0.15em] whitespace-nowrap transition-all flex items-center group ${
                isActive 
                  ? 'text-[#00f0ff] bg-[#00f0ff]/10' 
                  : 'text-[#00f0ff]/40 hover:text-[#00f0ff]/80 hover:bg-[#00f0ff]/5'
              }`}
            >
              <Icon className={`w-3 h-3 mr-2 ${isActive ? 'text-[#00f0ff] drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]' : 'text-[#00f0ff]/40 group-hover:text-[#00f0ff]/70'}`} />
              {tab.label}
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.8)]" 
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex-1 p-6 overflow-y-auto relative bg-grid-pattern scrollbar-thin scrollbar-thumb-[#00f0ff]/20 scrollbar-track-transparent">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4 border-b border-[#00f0ff]/20 pb-2">
                  <h3 className="text-sm font-display text-[#00f0ff] uppercase tracking-[0.2em] flex items-center">
                    <span className="w-2 h-2 bg-[#00f0ff] rounded-full mr-3 animate-pulse shadow-[0_0_8px_#00f0ff]"></span>
                    Extracted Telemetry
                  </h3>
                  <span className="text-[10px] font-display text-[#00f0ff] border border-[#00f0ff]/30 px-2 py-0.5 rounded bg-[#00f0ff]/5 animate-pulse">LIVE DATA STREAM</span>
                </div>
                
                {caseState.extractedEntities ? (
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-[#00f0ff]/5 p-5 rounded border border-[#00f0ff]/20 relative overflow-hidden group hover:border-[#00f0ff]/50 transition-colors">
                      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
                        <Activity className="w-16 h-16 text-[#00f0ff]" />
                      </div>
                      <div className="hud-corner hud-corner-tl border-[#00f0ff]/50"></div>
                      <div className="hud-corner hud-corner-br border-[#00f0ff]/50"></div>
                      
                      <p className="text-[10px] font-display text-[#00f0ff]/70 uppercase tracking-widest mb-2">Issue Classification</p>
                      <p className="text-xl text-[#e0f7ff] font-bold tracking-wide holographic-text">{caseState.issueType}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#00f0ff]/5 p-4 rounded border border-[#00f0ff]/20 hover:border-[#00f0ff]/50 transition-colors relative group">
                        <div className="hud-corner hud-corner-tl border-[#00f0ff]/30 w-2 h-2"></div>
                        <p className="text-[10px] font-display text-[#00f0ff]/70 uppercase tracking-widest mb-2">Impacted UPN</p>
                        <p className="text-sm text-[#e0f7ff] font-mono truncate" title={caseState.extractedEntities.impactedUserUPN || ''}>
                          {caseState.extractedEntities.impactedUserUPN || <span className="text-[#00f0ff]/40 italic">Unknown</span>}
                        </p>
                      </div>
                      <div className="bg-[#00f0ff]/5 p-4 rounded border border-[#00f0ff]/20 hover:border-[#00f0ff]/50 transition-colors relative group">
                        <div className="hud-corner hud-corner-tr border-[#00f0ff]/30 w-2 h-2"></div>
                        <p className="text-[10px] font-display text-[#00f0ff]/70 uppercase tracking-widest mb-2">Domains</p>
                        <p className="text-sm text-[#e0f7ff] font-mono truncate">
                          {caseState.extractedEntities.domains.length > 0 ? caseState.extractedEntities.domains.join(', ') : <span className="text-[#00f0ff]/40 italic">None</span>}
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#00f0ff]/5 p-4 rounded border border-[#00f0ff]/20 hover:border-[#00f0ff]/50 transition-colors relative">
                      <p className="text-[10px] font-display text-[#00f0ff]/70 uppercase tracking-widest mb-3">Detected Error Codes</p>
                      <div className="flex flex-wrap gap-2">
                        {caseState.extractedEntities.errorCodes.length > 0 ? (
                          caseState.extractedEntities.errorCodes.map((code, i) => (
                            <span key={i} className="px-3 py-1 bg-red-500/10 text-red-400 text-xs font-mono rounded border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.1)] tracking-wider">
                              {code}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-[#00f0ff]/40 font-mono">No error codes detected</span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-[#00f0ff]/40 border border-dashed border-[#00f0ff]/20 rounded bg-[#00f0ff]/5">
                    <Cpu className="w-12 h-12 mb-4 opacity-50 text-[#00f0ff] animate-pulse" />
                    <p className="text-xs font-display tracking-[0.2em] animate-pulse">AWAITING TELEMETRY STREAM...</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'diagnosis' && (
              <div className="space-y-6">
                 <div className="flex items-center justify-between mb-4 border-b border-[#00f0ff]/20 pb-2">
                  <h3 className="text-sm font-display text-[#00f0ff] uppercase tracking-[0.2em] flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Diagnostic Analysis
                  </h3>
                  {caseState.confidence > 0 && (
                    <div className="flex items-center space-x-3">
                      <span className="text-[10px] font-display text-[#00f0ff]/60 tracking-widest">CONFIDENCE</span>
                      <div className="h-2 w-24 bg-[#0d1b2a] border border-[#00f0ff]/40 rounded-full overflow-hidden p-0.5">
                        <div className={`h-full rounded-full ${caseState.confidence >= 0.75 ? 'bg-[#00f0ff] shadow-[0_0_10px_#00f0ff]' : 'bg-yellow-500 shadow-[0_0_10px_#eab308]'}`} style={{ width: `${caseState.confidence * 100}%` }}></div>
                      </div>
                      <span className={`text-sm font-mono font-bold ${caseState.confidence >= 0.75 ? 'text-[#00f0ff]' : 'text-yellow-400'}`}>{(caseState.confidence * 100).toFixed(0)}%</span>
                    </div>
                  )}
                </div>
                
                {caseState.hypotheses.length > 0 ? (
                  <ul className="space-y-4">
                    {caseState.hypotheses.map((hyp, idx) => (
                      <motion.li 
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-[#00f0ff]/5 border border-[#00f0ff]/20 p-5 rounded relative overflow-hidden group hover:border-[#00f0ff]/50 transition-all"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00f0ff] to-[#00a8ff] opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_#00f0ff]"></div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-base text-[#e0f7ff] font-medium leading-relaxed tracking-wide">{hyp.description}</span>
                          <span className="text-xs font-mono font-bold text-[#00f0ff] bg-[#00f0ff]/10 px-2 py-1 rounded border border-[#00f0ff]/30 ml-3 shadow-[0_0_5px_rgba(0,240,255,0.2)]">
                            {(hyp.probability * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-[#0d1b2a] border border-[#00f0ff]/30 rounded-full overflow-hidden mt-2">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${hyp.probability * 100}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="h-full bg-gradient-to-r from-[#00a8ff] to-[#00f0ff] shadow-[0_0_10px_#00f0ff]"
                          ></motion.div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-[#00f0ff]/40 border border-dashed border-[#00f0ff]/20 rounded bg-[#00f0ff]/5">
                    <p className="text-xs font-display tracking-[0.2em]">DIAGNOSTIC ENGINE IDLE</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'steps' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4 border-b border-[#00f0ff]/20 pb-2">
                  <h3 className="text-sm font-display text-[#00f0ff] uppercase tracking-[0.2em] flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Resolution Protocol
                  </h3>
                </div>

                {caseState.guidedSteps.length > 0 ? (
                  <div className="relative">
                    <div className="absolute left-[1.15rem] top-4 bottom-4 w-px bg-[#00f0ff]/20"></div>
                    <ul className="space-y-4">
                      {caseState.guidedSteps.map((step, idx) => (
                        <motion.li 
                          key={step.id} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start relative z-10 group"
                        >
                          <div className={`mt-0.5 w-9 h-9 rounded-full border-2 flex items-center justify-center mr-4 bg-[#0d1b2a] transition-all duration-300 ${step.completed ? 'border-green-500 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'border-[#00f0ff]/40 text-[#00f0ff]/60 group-hover:border-[#00f0ff] group-hover:text-[#00f0ff] group-hover:shadow-[0_0_10px_rgba(0,240,255,0.3)]'}`}>
                            {step.completed ? <CheckCircle className="w-5 h-5" /> : <span className="text-xs font-mono font-bold">{idx + 1}</span>}
                          </div>
                          <div className={`flex-1 p-4 rounded border transition-all ${step.completed ? 'bg-green-500/10 border-green-500/30 text-green-100/80' : 'bg-[#00f0ff]/5 border-[#00f0ff]/20 text-[#e0f7ff] group-hover:border-[#00f0ff]/50'}`}>
                            <span className="text-sm tracking-wide">{step.instruction}</span>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-[#00f0ff]/40 border border-dashed border-[#00f0ff]/20 rounded bg-[#00f0ff]/5">
                    <p className="text-xs font-display tracking-[0.2em]">NO PROTOCOL GENERATED</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'evidence' && (
              <div className="space-y-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4 border-b border-[#00f0ff]/20 pb-2">
                  <h3 className="text-sm font-display text-[#00f0ff] uppercase tracking-[0.2em] flex items-center">
                    <ClipboardList className="w-4 h-4 mr-2" />
                    Forensic Bundle
                  </h3>
                  <button className="text-[10px] font-display text-[#00f0ff]/70 hover:text-[#00f0ff] flex items-center transition-colors border border-[#00f0ff]/30 px-2 py-1 rounded bg-[#00f0ff]/5">
                    <Lock className="w-3 h-3 mr-1" />
                    ENCRYPTED
                  </button>
                </div>
                
                {caseState.evidenceBundle ? (
                  <div className="flex-1 bg-[#0d1b2a]/80 rounded p-5 overflow-y-auto border border-[#00f0ff]/40 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)] font-mono text-xs relative group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00f0ff]/50 to-transparent opacity-50"></div>
                    <div className="absolute top-3 right-3 opacity-70 flex space-x-1.5">
                       <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                       <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse delay-75"></div>
                       <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse delay-150"></div>
                    </div>
                    <pre className="text-[#00f0ff]/80 whitespace-pre-wrap leading-relaxed tracking-wide">
                      {JSON.stringify(caseState.evidenceBundle, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-[#00f0ff]/40 border border-dashed border-[#00f0ff]/20 rounded bg-[#00f0ff]/5">
                    <p className="text-xs font-display tracking-[0.2em] text-center">BUNDLE COMPILATION PENDING<br/><span className="text-[10px] opacity-50 normal-case font-tech tracking-normal">Requires unresolved diagnosis</span></p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'escalation' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4 border-b border-red-500/30 pb-2">
                  <h3 className="text-sm font-display text-red-500 uppercase tracking-[0.2em] flex items-center">
                    <ShieldAlert className="w-4 h-4 mr-2" />
                    Escalation Matrix
                  </h3>
                </div>
                
                <div className="bg-red-950/20 border border-red-500/30 p-6 rounded relative overflow-hidden backdrop-blur-sm group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)]"></div>
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all duration-1000"></div>
                  
                  <div className="hud-corner hud-corner-tr border-red-500/50"></div>
                  <div className="hud-corner hud-corner-br border-red-500/50"></div>
                  
                  <h4 className="text-sm font-bold text-red-400 mb-3 font-display uppercase tracking-widest flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-sm mr-3 animate-blink shadow-[0_0_8px_#ef4444]"></span>
                    ServiceNow Integration
                  </h4>
                  <p className="text-xs text-red-200/70 mb-8 leading-relaxed max-w-md font-tech tracking-wide">
                    Initiate Level 2 escalation protocol. This action will generate a ticket with the attached forensic bundle and route to Unified Communications Engineering.
                  </p>
                  
                  <div className="flex items-center justify-between bg-[#0d1b2a]/80 p-5 rounded border border-red-500/30">
                    <div>
                      <p className="text-[10px] font-display text-red-500/70 uppercase tracking-widest mb-1">Current Status</p>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${caseState.ticketStatus === 'Created' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-neutral-700'}`}></div>
                        <p className={`text-base font-bold font-display tracking-wide ${caseState.ticketStatus === 'Created' ? 'text-green-400' : 'text-neutral-500'}`}>
                          {caseState.ticketStatus || 'IDLE'}
                        </p>
                      </div>
                      {caseState.ticketId && <p className="text-xs font-mono text-[#00f0ff] mt-2 tracking-wider">REF: {caseState.ticketId}</p>}
                    </div>
                    
                    <button 
                      onClick={onCreateTicket}
                      disabled={!caseState.evidenceBundle || !!caseState.ticketId}
                      className="px-8 py-3 bg-red-600/90 text-white text-xs font-bold font-display tracking-[0.15em] uppercase rounded hover:bg-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.8)] border border-red-400/50 relative overflow-hidden"
                    >
                      <span className="relative z-10">Initialize Ticket</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-[shimmer_1s_infinite_linear]"></div>
                    </button>
                  </div>
                  {!caseState.evidenceBundle && (
                    <div className="mt-4 flex items-center text-red-400 text-[10px] font-mono border border-red-500/20 bg-red-950/40 p-3 rounded tracking-wide">
                      <AlertTriangle className="w-3 h-3 mr-2" />
                      ERROR: MISSING FORENSIC BUNDLE
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

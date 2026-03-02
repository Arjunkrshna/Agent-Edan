import { AuditLog } from '../types';
import { Activity, ShieldAlert, FileText, CheckCircle, Upload, MessageSquare, Terminal, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuditTrailProps {
  logs: AuditLog[];
}

export function AuditTrail({ logs }: AuditTrailProps) {
  const getIcon = (type: AuditLog['type']) => {
    switch (type) {
      case 'user_message': return <MessageSquare className="w-3 h-3 text-[#00f0ff]" />;
      case 'artifact_uploaded': return <Upload className="w-3 h-3 text-[#00a8ff]" />;
      case 'tool_proposed': return <Terminal className="w-3 h-3 text-yellow-500" />;
      case 'tool_executed': return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'ticket_created': return <FileText className="w-3 h-3 text-purple-500" />;
      case 'policy_block': return <ShieldAlert className="w-3 h-3 text-red-500" />;
      case 'system': return <Activity className="w-3 h-3 text-[#00f0ff]" />;
      default: return <Activity className="w-3 h-3 text-[#00f0ff]/50" />;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden font-tech">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center mr-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-scanline opacity-20 pointer-events-none"></div>
          <Activity className="w-4 h-4 text-[#00f0ff] animate-pulse" />
        </div>
        <div className="flex-1">
          <h3 className="text-xs font-display text-[#00f0ff] uppercase tracking-[0.2em] font-bold">System Audit Log</h3>
          <div className="flex items-center mt-0.5">
             <span className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full animate-pulse mr-2 shadow-[0_0_5px_#00f0ff]"></span>
             <span className="text-[9px] font-mono text-[#00f0ff]/70 tracking-wider">LIVE FEED</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-[#00f0ff]/20 scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 border border-dashed border-[#00f0ff]/20 rounded bg-[#00f0ff]/5">
              <Activity className="w-6 h-6 text-[#00f0ff]/30 mb-2" />
              <p className="text-[10px] font-display text-[#00f0ff]/50 uppercase tracking-widest">No activity detected</p>
            </div>
          ) : (
            logs.map((log) => (
              <motion.div 
                key={log.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="group relative pl-4 border-l border-[#00f0ff]/20 hover:border-[#00f0ff] transition-colors"
              >
                <div className="absolute left-[-4.5px] top-2 w-2 h-2 rounded-full bg-[#050a10] border border-[#00f0ff]/50 group-hover:border-[#00f0ff] group-hover:bg-[#00f0ff] transition-all shadow-[0_0_5px_rgba(0,240,255,0.2)]"></div>
                
                <div className="bg-[#00f0ff]/5 p-3 rounded border border-transparent group-hover:border-[#00f0ff]/30 group-hover:bg-[#00f0ff]/10 transition-all relative overflow-hidden">
                  <div className="absolute inset-0 bg-scanline opacity-0 group-hover:opacity-5 pointer-events-none"></div>
                  
                  <div className="flex items-center justify-between mb-1.5 relative z-10">
                    <div className="flex items-center space-x-2">
                      {getIcon(log.type)}
                      <span className={`text-[10px] font-bold uppercase tracking-wider font-display ${
                        log.type === 'policy_block' ? 'text-red-400' : 
                        log.type === 'tool_executed' ? 'text-green-400' : 
                        'text-[#e0f7ff]'
                      }`}>
                        {log.type.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-[#00f0ff]/60">{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' })}</span>
                  </div>
                  
                  <p className="text-[11px] text-[#00f0ff]/80 font-tech mb-2 leading-tight tracking-wide">{log.message}</p>
                  
                  {log.details && (
                    <div className="bg-[#050a10]/60 rounded border border-[#00f0ff]/10 p-2 overflow-hidden">
                      <pre className="text-[9px] text-[#00a8ff] font-mono whitespace-pre-wrap break-all leading-relaxed">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

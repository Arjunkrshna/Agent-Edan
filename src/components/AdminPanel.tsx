import { AdminState } from '../types';
import { Settings, Shield, Eye, Lock } from 'lucide-react';

interface AdminPanelProps {
  adminState: AdminState;
  setAdminState: React.Dispatch<React.SetStateAction<AdminState>>;
}

export function AdminPanel({ adminState, setAdminState }: AdminPanelProps) {
  return (
    <div className="flex flex-col h-full font-tech">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center mr-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-scanline opacity-20 pointer-events-none"></div>
          <Settings className="w-4 h-4 text-[#00f0ff] animate-spin-slow" />
        </div>
        <div>
          <h3 className="text-xs font-display text-[#00f0ff] uppercase tracking-[0.2em] font-bold">Admin Controls</h3>
          <p className="text-[9px] text-[#00f0ff]/50 font-mono tracking-wider">SYSTEM OVERRIDE</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="group relative overflow-hidden bg-[#00f0ff]/5 p-4 rounded border border-[#00f0ff]/20 transition-all hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/10">
          <div className="absolute inset-0 bg-scanline opacity-0 group-hover:opacity-10 pointer-events-none"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center">
              <Shield className={`w-5 h-5 mr-3 ${adminState.approvalGranted ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]' : 'text-[#00f0ff]/40'}`} />
              <div>
                <p className="text-xs font-bold text-[#e0f7ff] uppercase tracking-wider font-display">Approval Override</p>
                <p className="text-[10px] font-mono text-[#00f0ff]/60">Authorize privileged actions</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={adminState.approvalGranted}
                onChange={(e) => setAdminState(prev => ({ ...prev, approvalGranted: e.target.checked }))}
              />
              <div className="w-10 h-5 bg-[#0d1b2a] peer-focus:outline-none rounded-full peer border border-[#00f0ff]/30 peer-checked:border-[#00f0ff] peer-checked:bg-[#00f0ff]/20 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#00f0ff]/40 after:border-[#00f0ff]/50 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-[#e0f7ff] peer-checked:after:bg-[#00f0ff] peer-checked:after:shadow-[0_0_10px_#00f0ff]"></div>
            </label>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-[#00f0ff]/5 p-4 rounded border border-[#00f0ff]/20 transition-all hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/10">
          <div className="absolute inset-0 bg-scanline opacity-0 group-hover:opacity-10 pointer-events-none"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center">
              <Eye className={`w-5 h-5 mr-3 ${adminState.allowReadOnlyDiagnostics ? 'text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]' : 'text-[#00f0ff]/40'}`} />
              <div>
                <p className="text-xs font-bold text-[#e0f7ff] uppercase tracking-wider font-display">Passive Diagnostics</p>
                <p className="text-[10px] font-mono text-[#00f0ff]/60">Read-only metadata access</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={adminState.allowReadOnlyDiagnostics}
                onChange={(e) => setAdminState(prev => ({ ...prev, allowReadOnlyDiagnostics: e.target.checked }))}
              />
              <div className="w-10 h-5 bg-[#0d1b2a] peer-focus:outline-none rounded-full peer border border-[#00f0ff]/30 peer-checked:border-[#00f0ff] peer-checked:bg-[#00f0ff]/20 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#00f0ff]/40 after:border-[#00f0ff]/50 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-[#e0f7ff] peer-checked:after:bg-[#00f0ff] peer-checked:after:shadow-[0_0_10px_#00f0ff]"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import Markdown from 'react-markdown';
import { Send, Image as ImageIcon, Cpu, Loader2, X, Terminal, ChevronDown, ChevronRight, Activity, ScanLine, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (content: string, file?: { mimeType: string, data: string, dataUrl: string }) => void;
  isThinking: boolean;
}

export function ChatPanel({ messages, onSendMessage, isThinking }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ mimeType: string, data: string, dataUrl: string, name: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = () => {
    if (!input.trim() && !selectedFile) return;
    
    onSendMessage(input, selectedFile ? { mimeType: selectedFile.mimeType, data: selectedFile.data, dataUrl: selectedFile.dataUrl } : undefined);
    
    setInput('');
    setSelectedFile(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const base64Data = dataUrl.split(',')[1];
      setSelectedFile({
        mimeType: file.type,
        data: base64Data,
        dataUrl: dataUrl,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-full bg-[#050a10] relative overflow-hidden font-tech">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth z-10 scrollbar-thin scrollbar-thumb-[#00f0ff]/20 scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div 
              key={msg.id} 
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              
              {msg.type === 'reasoning' ? (
                <div className="w-full max-w-3xl mx-auto my-4">
                  <ReasoningBlock content={msg.content} />
                </div>
              ) : (
                <div className={`max-w-[85%] relative group ${
                  msg.role === 'user' 
                    ? 'ml-auto' 
                    : 'mr-auto'
                }`}>
                  {/* Message Bubble */}
                  <div className={`p-6 relative overflow-hidden backdrop-blur-md border transition-all duration-300 ${
                    msg.role === 'user'
                      ? 'bg-[#00f0ff]/10 border-[#00f0ff]/30 text-[#e0f7ff] rounded-2xl rounded-tr-sm shadow-[0_4px_20px_rgba(0,240,255,0.1)]'
                      : 'bg-[#0d1b2a]/90 border-[#00f0ff]/20 text-[#e0f7ff] rounded-2xl rounded-tl-sm shadow-[0_4px_25px_rgba(0,0,0,0.3)]'
                  }`}>
                    {/* Decorative corner accents for model messages */}
                    {msg.role === 'model' && (
                      <>
                        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#00f0ff]/40"></div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#00f0ff]/40"></div>
                      </>
                    )}

                    {msg.imageData && (
                      <div className="mb-4 rounded border border-[#00f0ff]/20 relative group-hover:border-[#00f0ff]/40 transition-colors overflow-hidden">
                        <div className="absolute inset-0 bg-scanline opacity-10 pointer-events-none"></div>
                        <img src={msg.imageData} alt="Uploaded artifact" className="max-w-full h-auto max-h-80 object-contain bg-[#050a10]" />
                      </div>
                    )}
                    <div className="text-sm md:text-base leading-relaxed font-tech tracking-wide prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-[#050a10] prose-pre:border prose-pre:border-[#00f0ff]/20 prose-code:text-[#00f0ff] prose-a:text-[#00a8ff] prose-strong:text-[#00f0ff]">
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  </div>
                  
                  {/* Timestamp */}
                  <div className={`text-[10px] font-display text-[#00f0ff]/60 mt-2 flex items-center tracking-widest ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'model' && <Cpu className="w-3 h-3 mr-2 text-[#00f0ff]" />}
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour12: false })}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isThinking && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start w-full max-w-2xl mx-auto"
          >
            <div className="bg-[#0d1b2a]/80 border border-[#00f0ff]/30 rounded-lg p-4 flex items-center space-x-4 shadow-[0_4px_20px_rgba(0,240,255,0.1)] relative overflow-hidden">
              <div className="absolute inset-0 bg-scanline opacity-10 pointer-events-none"></div>
              <div className="relative">
                <div className="absolute inset-0 bg-[#00f0ff] blur-md opacity-20 animate-pulse rounded-full"></div>
                <div className="relative z-10 border-2 border-[#00f0ff] rounded-full p-1 animate-spin-slow">
                   <Loader2 className="w-5 h-5 text-[#00f0ff]" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-display text-[#00f0ff] animate-pulse tracking-[0.2em]">PROCESSING TELEMETRY</span>
                <div className="h-0.5 w-32 bg-[#00f0ff]/10 mt-2 overflow-hidden">
                  <div className="h-full bg-[#00f0ff] w-1/3 animate-[shimmer_1s_infinite_linear]"></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-gradient-to-t from-[#050a10] to-transparent z-20">
        {selectedFile && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-[#00f0ff]/5 border border-[#00f0ff]/20 rounded flex items-center justify-between group max-w-md relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-scanline opacity-20 pointer-events-none"></div>
            <div className="flex items-center text-xs text-[#00f0ff] truncate font-display tracking-wider relative z-10">
              <ScanLine className="w-4 h-4 mr-3 flex-shrink-0 animate-pulse" />
              <span className="truncate">{selectedFile.name}</span>
              <span className="ml-3 text-[10px] bg-[#00f0ff]/10 border border-[#00f0ff]/30 px-2 py-0.5 rounded">ANALYZING</span>
            </div>
            <button 
              onClick={() => setSelectedFile(null)} 
              className="text-[#00f0ff] hover:text-red-500 p-1 rounded transition-colors relative z-10"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
        
        <div className="flex items-end space-x-4 relative">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          
          <button 
            onClick={triggerFileInput} 
            className="p-4 text-[#00f0ff] hover:text-[#00a8ff] hover:bg-[#00f0ff]/10 rounded-xl transition-all border border-[#00f0ff]/20 hover:border-[#00f0ff]/40 group relative overflow-hidden bg-[#0d1b2a] shadow-sm" 
            title="Upload Visual Artifact"
          >
            <div className="absolute inset-0 bg-[#00f0ff]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <ImageIcon className="w-6 h-6 group-hover:scale-110 transition-transform relative z-10" />
          </button>
          
          <div className="flex-1 relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00f0ff]/20 to-[#00a8ff]/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="ENTER COMMAND OR QUERY..."
              className="relative w-full bg-[#0d1b2a]/80 border border-[#00f0ff]/30 text-[#e0f7ff] rounded-xl pl-5 pr-14 py-4 focus:outline-none focus:border-[#00f0ff] resize-none font-tech text-base placeholder:text-[#00f0ff]/30 shadow-sm transition-all"
              rows={1}
              style={{ minHeight: '60px', maxHeight: '150px' }}
            />
            <button 
              onClick={handleSend}
              disabled={(!input.trim() && !selectedFile) || isThinking}
              className="absolute right-3 bottom-3 p-2.5 text-white bg-[#00f0ff] rounded-lg hover:bg-[#00a8ff] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_4px_15px_rgba(0,240,255,0.3)] hover:shadow-[0_4px_25px_rgba(0,240,255,0.5)]"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReasoningBlock({ content }: { content: string }) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <div className="bg-[#0d1b2a]/80 border border-[#00f0ff]/30 font-mono text-xs text-[#e0f7ff] relative overflow-hidden group rounded transition-all shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff]/50 to-transparent"></div>
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-[#00f0ff]/10 transition-colors bg-[#00f0ff]/5"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center text-[#00f0ff]">
          <Terminal className="w-4 h-4 mr-3" />
          <span className="uppercase tracking-[0.2em] text-[10px] font-display font-bold">Neural Process</span>
        </div>
        <div className="text-[#00f0ff]">
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-[#00f0ff]/10 bg-[#050a10]/50">
              <div className="whitespace-pre-wrap opacity-90 leading-relaxed font-tech tracking-wide text-[#00a8ff]">
                {content}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

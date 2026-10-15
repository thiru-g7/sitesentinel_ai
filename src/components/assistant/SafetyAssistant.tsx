import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  RefreshCw, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  provider?: string;
}

export const SafetyAssistant: React.FC = () => {
  const { activeSite, incidents, kpis, currentUser } = useSafety();

  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: `Hello ${currentUser.name}. I am SiteSentinel's Safety Assistant, grounded in real-time site data for **${activeSite.name}** and OSHA construction safety standards.\n\nAsk me about current compliance metrics, pending supervisor reviews, zone risk concentrations, or safety guidelines.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      provider: 'SiteSentinel Grounded Intelligence',
    },
  ]);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    'Which site zone has the most verified incidents?',
    'How many incidents are awaiting review right now?',
    'Explain how the risk prioritization score is computed.',
    'Summarize this week’s safety trends and compliance rate.',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const q = (textToSend || input).trim();
    if (!q || loading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/safety-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: q,
          siteContext: {
            siteName: activeSite.name,
            totalIncidents: kpis.totalIncidents,
            pendingReview: kpis.pendingReview,
            criticalAlerts: kpis.highAndCritical,
            complianceRate: kpis.complianceRate,
          },
        }),
      });

      const data = await res.json();
      const replyMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: data.reply || 'I processed your request, but received an empty response.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: data.provider,
      };

      setMessages(prev => [...prev, replyMsg]);
    } catch (err) {
      console.error('Safety assistant query error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          text: 'Notice: Network query interrupted. Please verify server connectivity or check system logs.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl glass-panel-glow border-l-4 border-l-[#00FF9D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">
              Grounded AI Safety Assistant
            </h1>
            <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#10B981]/25 text-[#00FF9D] border border-[#00FF9D]/40 font-bold">
              GEMINI 3.8 FLASH GROUNDED
            </span>
          </div>
          <p className="text-xs text-[#E2E8F0] mt-1">
            Real-time querying of safety violations, OSHA standards, and zone risk intelligence with strict site-data grounding.
          </p>
        </div>

        <div className="text-xs text-[#00FF9D] font-mono-code flex items-center gap-1.5 font-bold">
          <ShieldCheck className="w-4 h-4 text-[#00FF9D]" />
          <span>Zero Hallucination Policy</span>
        </div>
      </div>

      {/* Suggested Quick Inquiries */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-mono-code text-[#A7F3D0] uppercase tracking-wider flex items-center gap-1.5 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#00FF9D]" />
          <span>Suggested Inquiries (Click to Ask)</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              disabled={loading}
              className="px-3.5 py-1.5 rounded-xl bg-[#071f16] border border-[#10B981]/35 text-xs text-white hover:border-[#00FF9D] hover:bg-[#0a291e] transition-all text-left font-medium"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Conversation Console */}
      <div className="glass-panel rounded-2xl border border-[#10B981]/25 flex flex-col h-[520px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 text-left ${
                  isUser ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                  isUser 
                    ? 'bg-[#00FF9D] text-[#04120c] font-black' 
                    : 'bg-gradient-to-br from-[#10B981] to-[#00FF9D] text-[#04120c]'
                }`}>
                  {isUser ? <User className="w-4 h-4 text-[#04120c]" /> : <Bot className="w-4 h-4 text-[#04120c]" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed space-y-1 shadow-lg ${
                  isUser
                    ? 'bg-[#00FF9D] text-[#04120c] font-bold'
                    : 'bg-[#071f16]/95 border border-[#10B981]/35 text-white font-medium'
                }`}>
                  <div className="flex items-center justify-between gap-4 text-[10px] opacity-80 font-mono-code mb-1">
                    <span className="font-bold">{isUser ? currentUser.name : 'SiteSentinel Assistant'}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div className="whitespace-pre-line font-sans">
                    {msg.text}
                  </div>

                  {!isUser && msg.provider && (
                    <div className="pt-2 mt-2 border-t border-[#10B981]/20 flex items-center justify-between text-[9px] font-mono-code text-[#A7F3D0]">
                      <span>Source: {msg.provider}</span>
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="hover:text-white flex items-center gap-1 font-bold"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-[#00FF9D]" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#10B981] to-[#00FF9D] text-[#04120c] flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin text-[#04120c]" />
              </div>
              <div className="rounded-2xl p-3 bg-[#071f16] border border-[#10B981]/30 text-xs text-white flex items-center space-x-2">
                <RefreshCw className="w-3.5 h-3.5 text-[#00FF9D] animate-spin" />
                <span className="font-mono-code font-semibold">Grounding query against site telemetry & OSHA records...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#04120c]/95 border-t border-[#10B981]/25">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Ask safety assistant anything about incidents, rules, or site compliance..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#071f16] border border-[#10B981]/35 text-xs text-white focus:outline-none focus:border-[#00FF9D] font-medium"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#10B981] via-[#00FF9D] to-[#34D399] text-[#04120c] font-black text-xs shadow-lg shadow-[#10B981]/30 hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Ask</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

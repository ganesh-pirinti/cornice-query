import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, ArrowUpRight } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const CampusOSChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Hello! I am the CAMPUSOS Intelligence Assistant. Ask me anything about your connected schedule, attendance, class relocations, bus departures, or campus maintenance issues.',
      time: '10:00 AM',
    },
  ]);
  const [input, setInput] = useState('');

  const quickPrompts = [
    'Am I going to miss my bus if I stay for the AI workshop?',
    'What is my attendance risk in CSE204?',
    'Where is my 10:00 AM class today?',
    'Report AC cooling failure in Block B Room B204',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Generate Contextual AI Response
    setTimeout(() => {
      let aiText = '';
      const q = query.toLowerCase();

      if (q.includes('bus') || q.includes('ai workshop') || q.includes('miss')) {
        aiText = '🚌 **CAMPUSOS Mobility Sync**: The Qiskit & AI Workshop ends at 06:00 PM in APJ Block. Bus 3 departs at 05:30 PM (before workshop ends). However, Bus 7 (Guntur Route) departs at 06:15 PM from Bay 4 (5 mins after workshop). If you take Bus 7, you can attend the full workshop without missing your ride!';
      } else if (q.includes('attendance') || q.includes('cse204') || q.includes('risk')) {
        aiText = '🔴 **Attendance Alert**: Your attendance in CSE204 Operating Systems is currently **74%** (< 75% requirement). You cannot afford any more unexcused absences. Today\'s 10:00 AM lecture in Block C (Room C102) is mandatory.';
      } else if (q.includes('where') || q.includes('class') || q.includes('10:00') || q.includes('room')) {
        aiText = '⚠️ **Class Relocation Alert**: Your 10:00 AM CSE204 class was relocated from Block B (B204) to **Block C (Room C102)** due to AC maintenance. It takes ~12 minutes to walk to Block C from your current location.';
      } else if (q.includes('ac') || q.includes('b204') || q.includes('report') || q.includes('maintenance')) {
        aiText = '🚨 **Cluster Engine Notice**: Thank you for your report. CAMPUSOS has already detected **17 identical student complaints** for Room B204 (Block B). This issue is currently categorized as a **HIGH PRIORITY EMERGENCY** ticket, and an HVAC technician has been dispatched.';
      } else {
        aiText = `🧠 **CAMPUSOS Connected Intelligence**: I checked your cross-system records. You have 2 classes scheduled today, 1 pending assignment due at 11:59 PM, 1 recommended AI workshop at 5:00 PM, and 2 active bus routes available.`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 500);
  };

  return (
    <div className="p-6 rounded-3xl bg-zinc-900/80 border border-white/10 backdrop-blur-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-orange-500/20 border border-orange-500/40 text-orange-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              CAMPUSOS Natural Language Assistant
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <span className="text-xs text-zinc-400 font-mono">Cross-System Context Agent</span>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
          ONLINE & CONNECTED
        </span>
      </div>

      {/* Messages Stream */}
      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 text-xs ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`p-2 rounded-xl shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-orange-500 text-slate-950 font-bold'
                  : 'bg-white/10 text-orange-400 border border-white/10'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-3.5 rounded-2xl max-w-xl font-mono leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-orange-500/20 border border-orange-500/40 text-white'
                  : 'bg-black/50 border border-white/10 text-zinc-200'
              }`}
            >
              <div className="text-[10px] text-zinc-400 mb-1 flex items-center justify-between gap-4">
                <span>{msg.sender === 'user' ? 'YOU' : 'CAMPUSOS AI'}</span>
                <span>{msg.time}</span>
              </div>
              <p className="whitespace-pre-line">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Prompts */}
      <div className="pt-2 flex items-center gap-2 overflow-x-auto pb-1">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-zinc-300 hover:text-white shrink-0 flex items-center gap-1 transition-all cursor-pointer"
          >
            <span>{prompt}</span>
            <ArrowUpRight className="w-3 h-3 text-orange-400" />
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="pt-2 border-t border-white/10 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask CAMPUSOS about schedule, attendance, transport, or report issues..."
          className="flex-1 bg-black/50 border border-white/15 rounded-2xl px-4 py-2.5 text-xs text-white font-mono focus:border-orange-500 focus:outline-none"
        />
        <button
          onClick={() => handleSend()}
          className="p-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold hover:scale-105 transition-all shadow-md shadow-orange-500/20 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

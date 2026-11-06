import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Download,
  FileText,
  ShieldCheck,
  ChevronRight,
  GraduationCap,
  DollarSign,
  Calendar,
  FileCheck2,
  Building2,
  Award
} from 'lucide-react';
import { ChatMessage, SourceCitation, UniversityProfile } from '../types.ts';
import { UniversityCrest } from './UniversityCrest.tsx';
import { MarkdownView } from './MarkdownView.tsx';

interface ChatAreaProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (query: string) => void;
  onClearChat: () => void;
  onExportChat: () => void;
  onFeedback: (messageId: string, feedback: 'like' | 'dislike') => void;
  onViewSources: (sources: SourceCitation[]) => void;
  profile: UniversityProfile | null;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onClearChat,
  onExportChat,
  onFeedback,
  onViewSources,
  profile
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!inputText.trim() || isLoading) return;
    const query = inputText.trim();
    setInputText('');
    onSendMessage(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`[\]]/g, '').replace(/https?:\/\/\S+/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const suggestedCards = [
    {
      icon: GraduationCap,
      category: 'BZU Admissions',
      title: 'Fall 2026 Deadlines & Merit Lists',
      query: 'What are the application deadlines for Fall 2026, and when will merit lists be displayed?'
    },
    {
      icon: DollarSign,
      category: 'Fee Structure',
      title: 'Morning vs Evening Semester Fees',
      query: 'What is the semester fee for BS Computer Science, Engineering, and Pharmacy in PKR?'
    },
    {
      icon: Award,
      category: 'Financial Aid',
      title: 'HEC Need-Based & PEEF Grants',
      query: 'What scholarships are offered at BZU Multan, and how do I apply for HEC Need-Based aid?'
    },
    {
      icon: Calendar,
      category: 'Academic Calendar',
      title: 'Semester Classes & Exam Dates',
      query: 'When do Fall semester classes commence, and what are the final term exam dates at BZU?'
    },
    {
      icon: FileCheck2,
      category: 'Academic Rules',
      title: '75% Attendance & CGPA Policy',
      query: 'What is the 75% attendance rule and grading scale at Bahauddin Zakariya University?'
    },
    {
      icon: Building2,
      category: 'Campus Facilities',
      title: 'Central Library, Buses & Hostels',
      query: 'What are the Central Library timings, Green Bus transport routes, and hostel boarding fees?'
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {/* Top Action Bar for Chat */}
      {messages.length > 0 && (
        <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium text-slate-700">Official RAG Knowledge Verified</span>
            <span className="text-slate-300">•</span>
            <span>{messages.filter(m => m.role === 'user').length} Inquiries</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExportChat}
              className="flex items-center gap-1 px-2.5 py-1 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
              title="Download conversation transcript"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={onClearChat}
              className="flex items-center gap-1 px-2.5 py-1 rounded hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors"
              title="Reset conversation"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Conversation Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.length === 0 ? (
          // Welcome Screen
          <div className="max-w-3xl mx-auto py-4 sm:py-8 space-y-6 animate-in fade-in duration-300">
            {/* Prestigious Hero Banner */}
            <div className="relative rounded-2xl bg-gradient-to-br from-[#0f2744] via-[#16355d] to-[#0a192f] text-white p-6 sm:p-8 shadow-xl border border-[#1e3a5f] overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 flex items-center justify-center pointer-events-none">
                <UniversityCrest size="xl" />
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                <UniversityCrest size="lg" className="shrink-0" />
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Official University Portal</span>
                  </div>
                  <h1 className="font-crest text-2xl sm:text-3xl font-bold tracking-wide text-white">
                    {profile?.name || 'Bahauddin Zakariya University Multan'}
                  </h1>
                  <p className="text-xs sm:text-sm text-amber-300 italic">
                    "{profile?.motto || 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ (Seek Knowledge from Cradle to Grave)'}"
                  </p>
                  <p className="text-xs sm:text-sm text-slate-200 pt-2 leading-relaxed max-w-xl">
                    Welcome to the official BZU Multan AI Assistant. Ask questions regarding Fall 2026 / Spring 2027 admissions, merit formulas, morning/evening fee structures in PKR, HEC scholarships, examination rules, and student green bus transport routes.
                  </p>
                </div>
              </div>

              {/* Anti-Hallucination Quality Seal */}
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Grounded exclusively in official board records & catalogs</span>
                </div>
                <div className="text-[11px] text-amber-300/90 font-medium">
                  Never invents deadlines or fees • Verifies via RAG
                </div>
              </div>
            </div>

            {/* Quick Inquiries Header */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 font-crest">
                  Popular Student Inquiries
                </h2>
                <span className="text-xs text-blue-700 font-medium">Click any topic to ask</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {suggestedCards.map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => onSendMessage(card.query)}
                      className="group p-4 rounded-xl border border-slate-200/90 bg-white hover:bg-blue-50/50 hover:border-blue-400/70 text-left transition-all duration-200 shadow-2xs hover:shadow-sm space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 group-hover:text-blue-700 flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5 text-amber-600" />
                          {card.category}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <h3 className="font-semibold text-xs sm:text-sm text-slate-900 group-hover:text-[#0f2744]">
                        {card.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {card.query}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          // Messages Feed
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 sm:gap-4 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="shrink-0 mt-1">
                      <UniversityCrest size="sm" />
                    </div>
                  )}

                  <div className={`max-w-[88%] sm:max-w-[82%] space-y-2`}>
                    {/* Message Bubble */}
                    <div
                      className={`p-4 sm:p-5 rounded-2xl shadow-2xs ${
                        isAssistant
                          ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                          : 'bg-[#0f2744] text-white rounded-tr-sm shadow-sm'
                      }`}
                    >
                      {/* Assistant Header info */}
                      {isAssistant && (
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="font-crest font-bold text-[#0f2744]">
                              {profile?.shortName || 'BZU Multan'} Assistant
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                              Verified
                            </span>
                          </div>

                          <span className="text-[11px] text-slate-400">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      )}

                      {/* Content */}
                      {isAssistant ? (
                        <MarkdownView content={msg.content} />
                      ) : (
                        <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-normal">
                          {msg.content}
                        </p>
                      )}

                      {/* Cited Sources Pill for Assistant */}
                      {isAssistant && msg.sources && msg.sources.length > 0 && (
                        <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                          <button
                            onClick={() => onViewSources(msg.sources!)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 hover:bg-blue-100 text-blue-900 transition-colors border border-slate-200"
                            title="Inspect cited university documents"
                          >
                            <FileText className="w-3.5 h-3.5 text-blue-700" />
                            <span>Sources: {msg.sources.length} Official Records Cited</span>
                          </button>

                          <span className="text-[10px] text-slate-400">
                            {msg.modelUsed || 'Gemini 3.8 Flash • RAG'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions bar for Assistant */}
                    {isAssistant && (
                      <div className="flex items-center gap-1 px-1 text-slate-400 text-xs">
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="p-1.5 rounded-md hover:bg-slate-200 hover:text-slate-700 transition-colors"
                          title="Copy message"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => handleSpeak(msg.id, msg.content)}
                          className="p-1.5 rounded-md hover:bg-slate-200 hover:text-slate-700 transition-colors"
                          title="Listen to response"
                        >
                          {speakingId === msg.id ? (
                            <VolumeX className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <div className="h-3 w-px bg-slate-200 mx-1"></div>

                        <button
                          onClick={() => onFeedback(msg.id, 'like')}
                          className={`p-1.5 rounded-md transition-colors ${
                            msg.feedback === 'like'
                              ? 'text-blue-700 bg-blue-100'
                              : 'hover:bg-slate-200 hover:text-slate-700'
                          }`}
                          title="Helpful response"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onFeedback(msg.id, 'dislike')}
                          className={`p-1.5 rounded-md transition-colors ${
                            msg.feedback === 'dislike'
                              ? 'text-rose-700 bg-rose-100'
                              : 'hover:bg-slate-200 hover:text-slate-700'
                          }`}
                          title="Not helpful"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Suggested Follow-ups Chips */}
                    {isAssistant && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                      <div className="pt-1.5 space-y-1.5">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          <span>Related Questions</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.suggestedFollowUps.map((question, qIdx) => (
                            <button
                              key={qIdx}
                              onClick={() => onSendMessage(question)}
                              className="text-xs px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-900 hover:bg-blue-50/50 transition-all text-left shadow-2xs"
                            >
                              {question}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {!isAssistant && (
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Thinking / Loading indicator */}
            {isLoading && (
              <div className="flex gap-3.5 sm:gap-4 items-start">
                <div className="shrink-0 mt-1">
                  <UniversityCrest size="sm" />
                </div>
                <div className="p-4 rounded-2xl rounded-tl-sm bg-white border border-slate-200 shadow-2xs space-y-2 max-w-sm">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#0f2744]">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                    <span>Reviewing University Records...</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2 bg-slate-100 rounded-full w-48 animate-pulse"></div>
                    <div className="h-2 bg-slate-100 rounded-full w-36 animate-pulse"></div>
                  </div>
                  <p className="text-[11px] text-slate-400 italic">
                    Retrieving knowledge chunks and validating with Gemini...
                  </p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-4 sm:p-5 bg-white border-t border-slate-200 shadow-lg">
        <div className="max-w-3xl mx-auto space-y-2">
          <div className="relative flex items-end gap-2 bg-slate-50 border border-slate-300 rounded-2xl p-2 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 focus-within:bg-white transition-all shadow-inner">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about admissions, tuition, scholarships, degree programs, exams, or facilities..."
              rows={2}
              className="w-full resize-none bg-transparent px-3 py-1.5 text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none"
              disabled={isLoading}
            />

            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isLoading}
              className={`p-3 rounded-xl transition-all shrink-0 ${
                inputText.trim() && !isLoading
                  ? 'bg-[#0f2744] hover:bg-blue-700 text-white shadow-md active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
              title="Send inquiry (Enter)"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span className="hidden sm:inline">
              Backed by institutional documents • Unverified facts rejected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

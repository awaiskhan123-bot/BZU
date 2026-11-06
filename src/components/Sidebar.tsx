import React from 'react';
import {
  PlusCircle,
  MessageSquare,
  Trash2,
  GraduationCap,
  DollarSign,
  Award,
  BookOpen,
  Calendar,
  FileCheck2,
  Building2,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { ChatSession, UniversityProfile } from '../types.ts';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  onClearAllSessions: () => void;
  onSelectTopic: (topicQuery: string) => void;
  profile: UniversityProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onClearAllSessions,
  onSelectTopic,
  profile,
  isOpen,
  onClose
}) => {
  const quickTopics = [
    {
      label: 'Admissions & Merit Lists',
      icon: GraduationCap,
      query: 'What are the BZU Fall 2026 undergraduate admission deadlines and merit formulas?'
    },
    {
      label: 'Morning vs Evening Fees',
      icon: DollarSign,
      query: 'What is the fee structure in PKR for Morning and Evening programs at BZU Multan?'
    },
    {
      label: 'HEC & PEEF Scholarships',
      icon: Award,
      query: 'What scholarships are available at BZU and how do I apply via SFAO?'
    },
    {
      label: 'Faculties & Departments',
      icon: BookOpen,
      query: 'What degree programs are offered in UCET Engineering, CS & IT, and Pharmacy?'
    },
    {
      label: 'Academic Calendar',
      icon: Calendar,
      query: 'When do Fall semester classes commence, and what are the examination dates at BZU?'
    },
    {
      label: 'Attendance & CGPA Rules',
      icon: FileCheck2,
      query: 'What is the 75% attendance rule and grading system at Bahauddin Zakariya University?'
    },
    {
      label: 'Library, Buses & Hostels',
      icon: Building2,
      query: 'What are the Central Library hours, Green Bus routes, and hostel boarding dues at BZU?'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 w-72 lg:w-80 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: New Chat Button */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/70">
          <button
            onClick={() => {
              onNewSession();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-[#0f2744] hover:bg-[#1a385c] text-white shadow-sm transition-all hover:shadow active:scale-[0.99]"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>New Inquiry</span>
          </button>
        </div>

        {/* Scrollable Middle: Quick Categories & History */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
          {/* Quick Academic Topics */}
          <div>
            <div className="px-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
              <span>Academic Topics</span>
              <Sparkles className="w-3 h-3 text-amber-600" />
            </div>
            <div className="space-y-1">
              {quickTopics.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      onSelectTopic(item.query);
                      onClose();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:text-[#0f2744] hover:bg-slate-100/80 transition-colors text-left group"
                  >
                    <Icon className="w-4 h-4 text-slate-600 group-hover:text-blue-700 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat Sessions History */}
          <div>
            <div className="px-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
              <span>Recent Conversations</span>
              {sessions.length > 0 && (
                <button
                  onClick={onClearAllSessions}
                  className="text-[10px] text-slate-600 hover:text-rose-600 font-semibold"
                  title="Clear chat history"
                >
                  Clear all
                </button>
              )}
            </div>

            {sessions.length === 0 ? (
              <div className="px-3 py-4 text-center rounded-lg border border-dashed border-slate-200 text-xs text-slate-600">
                No recent inquiries yet
              </div>
            ) : (
              <div className="space-y-1">
                {sessions.map(s => (
                  <div
                    key={s.id}
                    className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                      s.id === activeSessionId
                        ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200/80'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                    onClick={() => {
                      onSelectSession(s.id);
                      onClose();
                    }}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${s.id === activeSessionId ? 'text-blue-700' : 'text-slate-600'}`} />
                      <span className="truncate">{s.title || 'Inquiry Session'}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(s.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-600 hover:text-rose-600 rounded transition-all"
                      title="Delete conversation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom: University Status Widget */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/90 text-xs text-slate-600 space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-[11px]">
            <Clock className="w-3.5 h-3.5 text-blue-700" />
            <span>Campus Operational Status</span>
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 space-y-1.5 shadow-2xs">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-600">Central Library:</span>
              <span className="text-emerald-700 font-medium">Open 8:00am–9:00pm</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-600">Fall 2026 Last Date:</span>
              <span className="text-amber-800 font-medium">Aug 25, 2026</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-600">Admission Cell:</span>
              <span className="text-blue-800 font-medium">{profile?.contactDirectory.admissionsPhone || '+92 61 9210074'}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-600 pt-1">
            <Info className="w-3 h-3 text-slate-600 shrink-0" />
            <span>Strict anti-hallucination guardrail active.</span>
          </div>
        </div>
      </aside>
    </>
  );
};

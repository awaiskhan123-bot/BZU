import React from 'react';
import { UniversityCrest } from './UniversityCrest.tsx';
import {
  ShieldCheck,
  FileText,
  PhoneCall,
  Settings,
  MessageSquare,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { UniversityProfile } from '../types.ts';

interface NavbarProps {
  currentTab: 'chat' | 'admin';
  setCurrentTab: (tab: 'chat' | 'admin') => void;
  profile: UniversityProfile | null;
  activeDocCount: number;
  onOpenDirectory: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  profile,
  activeDocCount,
  onOpenDirectory,
  sidebarOpen,
  setSidebarOpen
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0f2744] text-white border-b border-[#1e3a5f] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Crest & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('chat')}>
              <UniversityCrest size="md" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-crest font-bold text-base sm:text-lg tracking-wider text-white">
                    {profile?.shortName || 'BZU Multan'}
                  </span>
                  <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-widest text-amber-400 border border-amber-400/40 px-2 py-0.5 rounded-full bg-amber-950/40">
                    Official AI Assistant
                  </span>
                </div>
                <p className="hidden md:block text-[11px] text-slate-300 font-medium">
                  {profile?.name || 'Bahauddin Zakariya University Multan'} • {profile?.currentTerm || 'Academic Session 2026-2027'}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Knowledge Pills & Portal Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Active Docs Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-slate-200">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>{activeDocCount} Guides Active (RAG)</span>
            </div>

            {/* Official Directory Button */}
            <button
              onClick={onOpenDirectory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1e3a5f] hover:bg-[#254774] text-slate-100 border border-blue-400/30 transition-all hover:border-blue-400/60 shadow-sm"
              title="Official University Contact Directory & Emergency Desk"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Directory</span>
            </button>

            {/* Portal Tab Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-slate-900/60 border border-slate-700/60">
              <button
                onClick={() => setCurrentTab('chat')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentTab === 'chat'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>

              <button
                onClick={() => setCurrentTab('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentTab === 'admin'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin & RAG</span>
                <span className="sm:hidden">Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

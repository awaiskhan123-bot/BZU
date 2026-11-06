import React from 'react';
import { X, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { SourceCitation } from '../types.ts';

interface SourceModalProps {
  sources: SourceCitation[];
  isOpen: boolean;
  onClose: () => void;
}

export const SourceModal: React.FC<SourceModalProps> = ({ sources, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0f2744] text-white flex items-center justify-between border-b border-[#1e3a5f]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-amber-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-crest font-bold text-base text-white">Official Institutional Sources</h3>
              <p className="text-xs text-slate-300">Verified Knowledge Base Records & Grounding</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1">
          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/70 text-xs text-blue-900 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <span>
              All information provided by the AI Assistant is grounded directly in the university records listed below. Non-verified policies are never invented.
            </span>
          </div>

          <div className="space-y-3">
            {sources.map((src, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {src.category.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    RAG Match Score: {src.relevanceScore}
                  </span>
                </div>

                <h4 className="font-semibold text-sm text-[#0f2744] mb-1">
                  {src.sectionTitle}
                </h4>

                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{src.documentTitle}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Need official certified copies of these records? Contact the Office of the University Registrar.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#0f2744] text-white hover:bg-[#1a385c] transition-colors"
          >
            Close Sources
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  PlusCircle,
  Trash2,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Search,
  Settings,
  ShieldCheck,
  RefreshCw,
  Eye,
  ToggleLeft,
  ToggleRight,
  Database,
  Layers,
  Sparkles,
  BookOpen,
  PhoneCall,
  Save
} from 'lucide-react';
import { UniversityDocument, UniversityFAQ, UniversityProfile, KnowledgeStats } from '../types.ts';

interface AdminDashboardProps {
  stats: KnowledgeStats | null;
  documents: UniversityDocument[];
  faqs: UniversityFAQ[];
  profile: UniversityProfile | null;
  onRefreshData: () => void;
  onToggleDocument: (docId: string) => Promise<void>;
  onDeleteDocument: (docId: string) => Promise<void>;
  onDeleteFAQ: (faqId: string) => Promise<void>;
  onAddFAQ: (faq: Omit<UniversityFAQ, 'id'>) => Promise<void>;
  onAddManualDoc: (payload: { title: string; category: UniversityDocument['category']; content: string; description?: string }) => Promise<void>;
  onUpdateProfile: (updated: Partial<UniversityProfile>) => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  documents,
  faqs,
  profile,
  onRefreshData,
  onToggleDocument,
  onDeleteDocument,
  onDeleteFAQ,
  onAddFAQ,
  onAddManualDoc,
  onUpdateProfile
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'documents' | 'manual' | 'faqs' | 'rag-test' | 'profile'>('upload');

  // Upload Form State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<UniversityDocument['category']>('admissions');
  const [docDesc, setDocDesc] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  const [uploadErrorMsg, setUploadErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual Document Form State
  const [manualTitle, setManualTitle] = useState('');
  const [manualCategory, setManualCategory] = useState<UniversityDocument['category']>('policies');
  const [manualContent, setManualContent] = useState('');
  const [manualDesc, setManualDesc] = useState('');
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);

  // New FAQ Form State
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqCategory, setFaqCategory] = useState('Admissions');
  const [faqPinned, setFaqPinned] = useState(false);
  const [isSubmittingFAQ, setIsSubmittingFAQ] = useState(false);

  // RAG Test State
  const [testQuery, setTestQuery] = useState('What are the Fall 2026 application deadlines?');
  const [isTestingRag, setIsTestingRag] = useState(false);
  const [ragTestResults, setRagTestResults] = useState<any[] | null>(null);

  // University Profile Form State
  const [profileForm, setProfileForm] = useState<UniversityProfile | null>(profile);

  // Update profile form when prop updates
  React.useEffect(() => {
    if (profile) setProfileForm(profile);
  }, [profile]);

  // Handle File Upload
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadErrorMsg('Please select a PDF or text file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadErrorMsg(null);
    setUploadSuccessMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', docTitle.trim() || selectedFile.name.replace(/\.[^/.]+$/, ''));
      formData.append('category', docCategory);
      if (docDesc) formData.append('description', docDesc);

      const res = await fetch('/api/knowledge/upload-document', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to process document');
      }

      setUploadSuccessMsg(`Document "${data.document.title}" processed successfully into ${data.chunksAdded} searchable RAG chunks!`);
      setSelectedFile(null);
      setDocTitle('');
      setDocDesc('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      onRefreshData();
    } catch (err: any) {
      setUploadErrorMsg(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Manual Document Submission
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim() || !manualContent.trim()) return;

    setIsSubmittingManual(true);
    try {
      await onAddManualDoc({
        title: manualTitle.trim(),
        category: manualCategory,
        content: manualContent.trim(),
        description: manualDesc.trim() || undefined
      });
      setManualTitle('');
      setManualContent('');
      setManualDesc('');
      setActiveTab('documents');
    } catch (err: any) {
      alert(`Error adding entry: ${err.message}`);
    } finally {
      setIsSubmittingManual(false);
    }
  };

  // Handle FAQ Submit
  const handleFAQSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) return;

    setIsSubmittingFAQ(true);
    try {
      await onAddFAQ({
        question: faqQuestion.trim(),
        answer: faqAnswer.trim(),
        category: faqCategory,
        pinned: faqPinned
      });
      setFaqQuestion('');
      setFaqAnswer('');
      setFaqPinned(false);
    } catch (err: any) {
      alert(`Error adding FAQ: ${err.message}`);
    } finally {
      setIsSubmittingFAQ(false);
    }
  };

  // Handle RAG Retrieval Test
  const handleRunRAGTest = async () => {
    if (!testQuery.trim()) return;
    setIsTestingRag(true);
    try {
      const res = await fetch('/api/knowledge/test-rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: testQuery, topK: 5 })
      });
      const data = await res.json();
      setRagTestResults(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTestingRag(false);
    }
  };

  // Handle Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm) return;
    try {
      await onUpdateProfile(profileForm);
      alert('University profile and administrative contact directory updated successfully!');
    } catch (err: any) {
      alert(`Failed to update profile: ${err.message}`);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Title & Stats */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#0f2744] text-amber-400">
                <Database className="w-5 h-5" />
              </span>
              <div>
                <h1 className="font-crest font-bold text-xl sm:text-2xl text-[#0f2744]">
                  University Knowledge & RAG Administration
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Manage official documents, ingest prospectuses & policy PDFs, and audit grounded knowledge chunks.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onRefreshData}
            className="self-start md:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Index</span>
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Total Documents</span>
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-[#0f2744]">
              {stats?.totalDocuments ?? documents.length}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium">
              {stats?.activeDocuments ?? documents.filter(d => d.isActive).length} currently active in RAG
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Indexed Chunks</span>
              <Layers className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-[#0f2744]">
              {stats?.totalChunks ?? 0}
            </div>
            <p className="text-[11px] text-slate-500">
              Semantic paragraph vectors
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Standard FAQs</span>
              <HelpCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-[#0f2744]">
              {stats?.totalFAQs ?? faqs.length}
            </div>
            <p className="text-[11px] text-slate-500">
              Instant match answers
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>AI Engine</span>
              <ShieldCheck className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-base font-bold text-[#0f2744] truncate">
              Gemini 3.8 Flash
            </div>
            <p className="text-[11px] text-emerald-600 font-medium">
              Strict Anti-Hallucination
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-1">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'upload'
                ? 'bg-[#0f2744] text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload PDF / Document</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'documents'
                ? 'bg-[#0f2744] text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Document Repository ({documents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('manual')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'manual'
                ? 'bg-[#0f2744] text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Policy Entry</span>
          </button>

          <button
            onClick={() => setActiveTab('faqs')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'faqs'
                ? 'bg-[#0f2744] text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>FAQs ({faqs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rag-test')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'rag-test'
                ? 'bg-[#0f2744] text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>RAG Query Tester</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'profile'
                ? 'bg-[#0f2744] text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>University Profile</span>
          </button>
        </div>

        {/* Tab 1: Upload PDF / Document */}
        {activeTab === 'upload' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0f2744] font-crest">
                Upload Official University Guidelines (PDF, Markdown, or Text)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Uploaded documents are immediately parsed, chunked, and embedded into the university's retrieval index so Gemini can quote them verbatim.
              </p>
            </div>

            {uploadSuccessMsg && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{uploadSuccessMsg}</p>
                  <p className="text-xs text-emerald-700 mt-0.5">Students can now ask questions about this document in the chat.</p>
                </div>
              </div>
            )}

            {uploadErrorMsg && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <p>{uploadErrorMsg}</p>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* File Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 sm:p-8 text-center bg-slate-50/60 hover:bg-blue-50/30 cursor-pointer transition-colors"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setSelectedFile(file);
                    if (file && !docTitle) {
                      setDocTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
                    }
                  }}
                  accept=".pdf,.txt,.md"
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 mx-auto flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>

                {selectedFile ? (
                  <div className="space-y-1">
                    <p className="font-semibold text-sm text-[#0f2744]">{selectedFile.name}</p>
                    <p className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB • Click to change</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="font-semibold text-sm text-slate-700">Choose a PDF or text document to upload</p>
                    <p className="text-xs text-slate-400">PDF, TXT, or Markdown (up to 20MB)</p>
                  </div>
                )}
              </div>

              {/* Document Metadata Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    placeholder="e.g. 2026-2027 International Student Visa & Tuition Policy"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Academic Category *
                  </label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600 bg-white"
                  >
                    <option value="admissions">Admissions & Deadlines</option>
                    <option value="tuition_aid">Tuition & Financial Aid</option>
                    <option value="programs">Colleges & Degree Programs</option>
                    <option value="calendar">Academic Calendar</option>
                    <option value="exams_grading">Exams & Grading Policies</option>
                    <option value="campus_life">Campus Life & Facilities</option>
                    <option value="policies">General Policies</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description / Department Notes (Optional)
                </label>
                <input
                  type="text"
                  value={docDesc}
                  onChange={(e) => setDocDesc(e.target.value)}
                  placeholder="e.g. Issued by the Office of the Provost on August 2026"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    const sampleText = `Bahauddin Zakariya University Multan (BZU) Computer Science & Software Engineering Industry Internship Guidelines 2026-2027:
All undergraduate BS Computer Science and BS Software Engineering students must complete an 8-week supervised industry internship following the completion of their 6th semester.
- Eligible Technology Sectors: Software development houses, telecom companies, banking IT divisions, and registered technology startups in Multan, Lahore, and Islamabad.
- Evaluation Requirements: Submission of formal internship completion certificate from host organization, technical project report, and viva voce presentation.
- Academic Credit: 3 credit hours awarded upon satisfactory evaluation by the Departmental Internship Committee.
- Contact: Department of Computer Science & IT, BZU Bosan Road Campus, Multan. Email: cs@bzu.edu.pk, Phone: +92 (61) 9210071 Ext 320.`;
                    setDocTitle('BZU CS & IT Industry Internship Guidelines 2026-2027');
                    setDocCategory('programs');
                    setDocDesc('Department of Computer Science & IT internship requirements and evaluation rules');
                    // Create dummy blob
                    const blob = new Blob([sampleText], { type: 'text/plain' });
                    const file = new File([blob], 'BZU_CS_Internship_Guidelines_2026.txt', { type: 'text/plain' });
                    setSelectedFile(file);
                  }}
                  className="text-xs text-blue-700 hover:text-blue-900 font-semibold underline"
                >
                  Load Sample Document Template
                </button>

                <button
                  type="submit"
                  disabled={!selectedFile || isUploading}
                  className={`px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white shadow-sm flex items-center gap-2 ${
                    selectedFile && !isUploading
                      ? 'bg-[#0f2744] hover:bg-blue-700 cursor-pointer'
                      : 'bg-slate-300 cursor-not-allowed'
                  }`}
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Extracting & Chunking Document...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>Upload & Index Document</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Document Repository */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#0f2744] font-crest">
                  Official Document Repository
                </h2>
                <p className="text-xs text-slate-500">
                  Manage active publications. Inactive documents are suppressed from AI search queries.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 self-start sm:self-auto">
                {documents.filter(d => d.isActive).length} of {documents.length} Active in RAG
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-semibold">
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Title & Filename</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Chunks</th>
                    <th className="py-3 px-3">Uploaded</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <button
                          onClick={() => onToggleDocument(doc.id)}
                          className="flex items-center gap-1.5 focus:outline-none"
                          title={doc.isActive ? 'Active in AI search (click to disable)' : 'Inactive (click to enable)'}
                        >
                          {doc.isActive ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600">
                              Disabled
                            </span>
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-3 max-w-xs">
                        <div className="font-semibold text-slate-900 truncate">{doc.title}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>{doc.fileName}</span>
                          <span>•</span>
                          <span>{doc.fileSize || 'N/A'}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                          {doc.category.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-mono text-xs text-blue-900 font-semibold">
                        {doc.chunkCount}
                      </td>

                      <td className="py-3 px-3 text-slate-500 text-xs">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Remove "${doc.title}" and its ${doc.chunkCount} knowledge chunks?`)) {
                              onDeleteDocument(doc.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Delete document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Manual Policy Entry */}
        {activeTab === 'manual' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0f2744] font-crest">
                Add Official Policy or Department Bulletin
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Direct text entry for policies, emergency notices, or admissions updates without needing to create a PDF file.
              </p>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Policy Title *
                  </label>
                  <input
                    type="text"
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    placeholder="e.g. Spring 2027 Housing Deposit and Room Selection Rules"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600 bg-white"
                  >
                    <option value="admissions">Admissions & Deadlines</option>
                    <option value="tuition_aid">Tuition & Financial Aid</option>
                    <option value="programs">Colleges & Degree Programs</option>
                    <option value="calendar">Academic Calendar</option>
                    <option value="exams_grading">Exams & Grading Policies</option>
                    <option value="campus_life">Campus Life & Facilities</option>
                    <option value="policies">General Policies</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Policy Content (Verbatim text) *
                </label>
                <textarea
                  value={manualContent}
                  onChange={(e) => setManualContent(e.target.value)}
                  placeholder="Paste or write the exact institutional policy wording, deadline dates, eligibility rules, and contact information..."
                  rows={8}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600 font-mono text-xs leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department / Authority Notes (Optional)
                </label>
                <input
                  type="text"
                  value={manualDesc}
                  onChange={(e) => setManualDesc(e.target.value)}
                  placeholder="e.g. Approved by University Senate on October 2026"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingManual || !manualTitle.trim() || !manualContent.trim()}
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-[#0f2744] hover:bg-blue-700 text-white shadow-sm flex items-center gap-2 cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  <PlusCircle className="w-4 h-4 text-amber-400" />
                  <span>{isSubmittingManual ? 'Indexing...' : 'Save & Index Policy'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 4: FAQs Manager */}
        {activeTab === 'faqs' && (
          <div className="space-y-6">
            {/* Add FAQ Box */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-[#0f2744] font-crest">
                Add Standard University FAQ
              </h2>

              <form onSubmit={handleFAQSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Question *
                    </label>
                    <input
                      type="text"
                      value={faqQuestion}
                      onChange={(e) => setFaqQuestion(e.target.value)}
                      placeholder="e.g. Can I pay tuition fees in monthly installments?"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={faqCategory}
                      onChange={(e) => setFaqCategory(e.target.value)}
                      placeholder="e.g. Tuition & Fees"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Answer *
                  </label>
                  <textarea
                    value={faqAnswer}
                    onChange={(e) => setFaqAnswer(e.target.value)}
                    placeholder="Enter the official, verified answer..."
                    rows={3}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={faqPinned}
                      onChange={(e) => setFaqPinned(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Pin to top suggestions</span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmittingFAQ}
                    className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#0f2744] hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4 text-amber-400" />
                    <span>Save FAQ</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Existing FAQs */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-crest font-bold text-base text-[#0f2744]">
                Published University FAQs ({faqs.length})
              </h3>

              <div className="space-y-3">
                {faqs.map((f) => (
                  <div
                    key={f.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-colors flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-900">
                          {f.category}
                        </span>
                        {f.pinned && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                            Pinned
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-sm text-[#0f2744]">
                        {f.question}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {f.answer}
                      </p>
                    </div>

                    <button
                      onClick={() => onDeleteFAQ(f.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors shrink-0"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: RAG Query Tester */}
        {activeTab === 'rag-test' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0f2744] font-crest">
                RAG Retrieval & Guardrail Tester
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Inspect which exact knowledge base chunks match any student query, analyze their similarity scores, and verify that missing data triggers administrative contact guidance.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="Enter sample student query..."
                className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
              />
              <button
                onClick={handleRunRAGTest}
                disabled={isTestingRag || !testQuery.trim()}
                className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-[#0f2744] hover:bg-blue-700 text-white shadow-sm flex items-center gap-2 cursor-pointer"
              >
                {isTestingRag ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4 text-amber-400" />}
                <span>Run Retrieval Test</span>
              </button>
            </div>

            {/* Quick Test Queries */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Quick Test:</span>
              <button
                onClick={() => setTestQuery('What is the semester fee for BS Computer Science and Engineering in Morning vs Evening?')}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                BZU Fee Structure Test
              </button>
              <button
                onClick={() => setTestQuery('What is the 75% attendance rule and grading system at BZU?')}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Attendance Policy Test
              </button>
              <button
                onClick={() => setTestQuery('What are the Green Bus routes and hostel room boarding fees?')}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Hostel & Transport Test
              </button>
              <button
                onClick={() => setTestQuery('Can students keep domestic pets in chemistry research laboratories?')}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Guardrail Test (Missing Info)
              </button>
            </div>

            {/* Results display */}
            {ragTestResults && (
              <div className="space-y-4 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-[#0f2744]">
                    Retrieved Knowledge Chunks ({ragTestResults.length} matches)
                  </h3>
                  <span className="text-xs text-slate-500">
                    Highest Score: {ragTestResults[0]?.score ?? 0}
                  </span>
                </div>

                {ragTestResults.length === 0 ? (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm space-y-1">
                    <p className="font-semibold">Guardrail Triggered: No Knowledge Chunks Met Threshold</p>
                    <p>The AI assistant will strictly reject guessing and automatically output official administration contact information.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {ragTestResults.map((res, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-blue-900">
                            Rank #{idx + 1}: {res.title}
                          </span>
                          <span className="font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px]">
                            Match Score: {res.score}
                          </span>
                        </div>
                        <div className="text-slate-500 font-medium text-[11px]">
                          Document: {res.documentTitle} • Category: {res.category}
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-700 font-mono text-[11px] leading-relaxed">
                          {res.excerpt}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 6: University Profile */}
        {activeTab === 'profile' && profileForm && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0f2744] font-crest">
                Institutional Profile & Contact Directory
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Customize university identity, active academic year, and the official email/phone directory provided to students when questions require direct administration referral.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    University Full Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Abbreviation / Acronym
                  </label>
                  <input
                    type="text"
                    value={profileForm.shortName}
                    onChange={(e) => setProfileForm({ ...profileForm, shortName: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Motto
                  </label>
                  <input
                    type="text"
                    value={profileForm.motto}
                    onChange={(e) => setProfileForm({ ...profileForm, motto: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Academic Term
                  </label>
                  <input
                    type="text"
                    value={profileForm.currentTerm}
                    onChange={(e) => setProfileForm({ ...profileForm, currentTerm: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-4">
                <h3 className="font-semibold text-sm text-[#0f2744] flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-amber-600" />
                  <span>Administrative Office Directory (Referrals for Missing Data)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Admissions Email
                    </label>
                    <input
                      type="email"
                      value={profileForm.contactDirectory.admissionsEmail}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          contactDirectory: { ...profileForm.contactDirectory, admissionsEmail: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Admissions Phone
                    </label>
                    <input
                      type="text"
                      value={profileForm.contactDirectory.admissionsPhone}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          contactDirectory: { ...profileForm.contactDirectory, admissionsPhone: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Financial Aid & Bursar Email
                    </label>
                    <input
                      type="email"
                      value={profileForm.contactDirectory.financialAidEmail}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          contactDirectory: { ...profileForm.contactDirectory, financialAidEmail: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Financial Aid & Bursar Phone
                    </label>
                    <input
                      type="text"
                      value={profileForm.contactDirectory.financialAidPhone}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          contactDirectory: { ...profileForm.contactDirectory, financialAidPhone: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Registrar Email
                    </label>
                    <input
                      type="email"
                      value={profileForm.contactDirectory.registrarEmail}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          contactDirectory: { ...profileForm.contactDirectory, registrarEmail: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Registrar Phone
                    </label>
                    <input
                      type="text"
                      value={profileForm.contactDirectory.registrarPhone}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          contactDirectory: { ...profileForm.contactDirectory, registrarPhone: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Campus Safety Emergency Number
                    </label>
                    <input
                      type="text"
                      value={profileForm.contactDirectory.campusSafetyEmergency}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          contactDirectory: { ...profileForm.contactDirectory, campusSafetyEmergency: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      General Info Email
                    </label>
                    <input
                      type="email"
                      value={profileForm.contactDirectory.generalInfoEmail}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          contactDirectory: { ...profileForm.contactDirectory, generalInfoEmail: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-[#0f2744] hover:bg-blue-700 text-white shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-amber-400" />
                  <span>Save Profile & Directory Changes</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

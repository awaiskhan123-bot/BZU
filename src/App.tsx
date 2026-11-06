import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { ChatArea } from './components/ChatArea.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { SourceModal } from './components/SourceModal.tsx';
import { DirectoryModal } from './components/DirectoryModal.tsx';
import {
  ChatMessage,
  ChatSession,
  KnowledgeStats,
  SourceCitation,
  UniversityDocument,
  UniversityFAQ,
  UniversityProfile
} from './types.ts';

const STORAGE_KEY = 'bzu_ai_chat_sessions_v1';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'chat' | 'admin'>('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // University and Knowledge state
  const [profile, setProfile] = useState<UniversityProfile | null>(null);
  const [stats, setStats] = useState<KnowledgeStats | null>(null);
  const [documents, setDocuments] = useState<UniversityDocument[]>([]);
  const [faqs, setFaqs] = useState<UniversityFAQ[]>([]);

  // Modals state
  const [activeSources, setActiveSources] = useState<SourceCitation[]>([]);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [isDirectoryModalOpen, setIsDirectoryModalOpen] = useState(false);

  // Chat sessions state
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load chat history from localStorage', e);
    }
    const initialSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: 'New Student Inquiry',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: []
    };
    return [initialSession];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    return sessions[0]?.id || `session-${Date.now()}`;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Persist sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save sessions to localStorage', e);
    }
  }, [sessions]);

  // Load university data
  const loadUniversityData = async () => {
    try {
      const [statsRes, docsRes, faqsRes, profileRes] = await Promise.all([
        fetch('/api/knowledge/stats'),
        fetch('/api/knowledge/documents'),
        fetch('/api/knowledge/faqs'),
        fetch('/api/university/profile')
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
        if (data.profile) setProfile(data.profile);
      }
      if (docsRes.ok) {
        const data = await docsRes.json();
        setDocuments(data.documents || []);
      }
      if (faqsRes.ok) {
        const data = await faqsRes.json();
        setFaqs(data.faqs || []);
      }
      if (profileRes.ok) {
        const data = await profileRes.json();
        setProfile(data);
      }
    } catch (err) {
      console.warn('Backend load warning, running with default client state:', err);
    }
  };

  useEffect(() => {
    loadUniversityData();
  }, []);

  const currentSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const messages = currentSession?.messages || [];

  // Create a new session
  const handleNewSession = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: 'New Student Inquiry',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: []
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setCurrentTab('chat');
  };

  // Delete individual session
  const handleDeleteSession = (id: string) => {
    setSessions(prev => {
      const remaining = prev.filter(s => s.id !== id);
      if (remaining.length === 0) {
        const fresh: ChatSession = {
          id: `session-${Date.now()}`,
          title: 'New Student Inquiry',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: []
        };
        setActiveSessionId(fresh.id);
        return [fresh];
      }
      if (activeSessionId === id) {
        setActiveSessionId(remaining[0].id);
      }
      return remaining;
    });
  };

  // Clear all sessions
  const handleClearAllSessions = () => {
    if (confirm('Clear all conversation history?')) {
      const fresh: ChatSession = {
        id: `session-${Date.now()}`,
        title: 'New Student Inquiry',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: []
      };
      setSessions([fresh]);
      setActiveSessionId(fresh.id);
    }
  };

  // Clear messages in current session
  const handleClearChat = () => {
    setSessions(prev =>
      prev.map(s => (s.id === activeSessionId ? { ...s, messages: [], updatedAt: new Date().toISOString() } : s))
    );
  };

  // Export chat transcript
  const handleExportChat = () => {
    const header = `=====================================================\n${profile?.name || 'Bahauddin Zakariya University Multan'} - Official AI Assistant Transcript\nSession ID: ${activeSessionId}\nExported: ${new Date().toLocaleString()}\n=====================================================\n\n`;
    const body = messages
      .map(
        m =>
          `[${new Date(m.timestamp).toLocaleTimeString()}] ${m.role === 'user' ? 'STUDENT' : 'BZU AI ASSISTANT'}:\n${m.content}\n\n`
      )
      .join('\n');

    const blob = new Blob([header + body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BZU_Inquiry_Transcript_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Send message
  const handleSendMessage = async (query: string) => {
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toISOString()
    };

    // Build history for backend
    const prevTurns = messages.map(m => ({
      role: (m.role === 'user' ? 'user' : 'model') as 'user' | 'model',
      parts: [{ text: m.content }]
    }));

    // Update session with user message immediately
    setSessions(prev =>
      prev.map(s => {
        if (s.id === activeSessionId) {
          const isFirstMessage = s.messages.length === 0;
          return {
            ...s,
            title: isFirstMessage ? query.slice(0, 38) + (query.length > 38 ? '...' : '') : s.title,
            updatedAt: new Date().toISOString(),
            messages: [...s.messages, userMessage]
          };
        }
        return s;
      })
    );

    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim(),
          history: prevTurns
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned error: ${res.status}`);
      }

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-a`,
        role: 'assistant',
        content: data.answer,
        timestamp: new Date().toISOString(),
        sources: data.sources || [],
        suggestedFollowUps: data.suggestedFollowUps || [],
        modelUsed: data.modelUsed,
        isFallback: data.isFallback
      };

      setSessions(prev =>
        prev.map(s => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              updatedAt: new Date().toISOString(),
              messages: [...s.messages, assistantMessage]
            };
          }
          return s;
        })
      );
    } catch (err: any) {
      console.error('Failed to get answer:', err);

      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        role: 'assistant',
        content: `We experienced a temporary connectivity issue connecting to the university knowledge service. Please try again or reach the University Help Desk directly at ${profile?.contactDirectory.admissionsPhone || '(555) 019-2000'}.`,
        timestamp: new Date().toISOString(),
        sources: []
      };

      setSessions(prev =>
        prev.map(s => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              messages: [...s.messages, errorMessage]
            };
          }
          return s;
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Feedback handler
  const handleFeedback = (messageId: string, feedback: 'like' | 'dislike') => {
    setSessions(prev =>
      prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: s.messages.map(m => (m.id === messageId ? { ...m, feedback } : m))
          };
        }
        return s;
      })
    );
  };

  // View sources modal trigger
  const handleViewSources = (sources: SourceCitation[]) => {
    setActiveSources(sources);
    setIsSourceModalOpen(true);
  };

  // Admin action handlers
  const handleToggleDocument = async (docId: string) => {
    try {
      const res = await fetch(`/api/knowledge/documents/${docId}/toggle`, { method: 'POST' });
      if (res.ok) {
        loadUniversityData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    try {
      const res = await fetch(`/api/knowledge/documents/${docId}`, { method: 'DELETE' });
      if (res.ok) {
        loadUniversityData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddManualDoc = async (payload: {
    title: string;
    category: UniversityDocument['category'];
    content: string;
    description?: string;
  }) => {
    const res = await fetch('/api/knowledge/documents/manual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to add manual document');
    }
    loadUniversityData();
  };

  const handleAddFAQ = async (faq: Omit<UniversityFAQ, 'id'>) => {
    const res = await fetch('/api/knowledge/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(faq)
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to add FAQ');
    }
    loadUniversityData();
  };

  const handleDeleteFAQ = async (faqId: string) => {
    const res = await fetch(`/api/knowledge/faqs/${faqId}`, { method: 'DELETE' });
    if (res.ok) {
      loadUniversityData();
    }
  };

  const handleUpdateProfile = async (updated: Partial<UniversityProfile>) => {
    const res = await fetch('/api/university/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to update profile');
    }
    loadUniversityData();
  };

  const activeDocCount = documents.filter(d => d.isActive).length;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        profile={profile}
        activeDocCount={activeDocCount}
        onOpenDirectory={() => setIsDirectoryModalOpen(true)}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {currentTab === 'chat' ? (
          <>
            <Sidebar
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSelectSession={(id) => setActiveSessionId(id)}
              onNewSession={handleNewSession}
              onDeleteSession={handleDeleteSession}
              onClearAllSessions={handleClearAllSessions}
              onSelectTopic={(query) => handleSendMessage(query)}
              profile={profile}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />

            <ChatArea
              messages={messages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              onClearChat={handleClearChat}
              onExportChat={handleExportChat}
              onFeedback={handleFeedback}
              onViewSources={handleViewSources}
              profile={profile}
            />
          </>
        ) : (
          <AdminDashboard
            stats={stats}
            documents={documents}
            faqs={faqs}
            profile={profile}
            onRefreshData={loadUniversityData}
            onToggleDocument={handleToggleDocument}
            onDeleteDocument={handleDeleteDocument}
            onDeleteFAQ={handleDeleteFAQ}
            onAddFAQ={handleAddFAQ}
            onAddManualDoc={handleAddManualDoc}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
      </div>

      {/* Cited Sources Modal */}
      <SourceModal
        sources={activeSources}
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
      />

      {/* University Directory & Emergency Modal */}
      <DirectoryModal
        profile={profile}
        isOpen={isDirectoryModalOpen}
        onClose={() => setIsDirectoryModalOpen(false)}
      />
    </div>
  );
}

export interface SourceCitation {
  documentTitle: string;
  sectionTitle: string;
  category: string;
  relevanceScore: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: SourceCitation[];
  suggestedFollowUps?: string[];
  feedback?: 'like' | 'dislike' | null;
  modelUsed?: string;
  isFallback?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface UniversityProfile {
  name: string;
  shortName: string;
  motto: string;
  founded: number;
  currentTerm: string;
  location: string;
  contactDirectory: {
    admissionsEmail: string;
    admissionsPhone: string;
    financialAidEmail: string;
    financialAidPhone: string;
    registrarEmail: string;
    registrarPhone: string;
    campusSafetyEmergency: string;
    campusSafetyNonEmergency: string;
    generalInfoEmail: string;
  };
}

export interface UniversityDocument {
  id: string;
  title: string;
  category: 'admissions' | 'tuition_aid' | 'programs' | 'calendar' | 'exams_grading' | 'campus_life' | 'policies';
  fileName: string;
  fileType: 'pdf' | 'text' | 'manual';
  uploadedAt: string;
  fileSize?: string;
  isActive: boolean;
  chunkCount: number;
  description: string;
}

export interface UniversityFAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  pinned: boolean;
}

export interface KnowledgeStats {
  totalDocuments: number;
  activeDocuments: number;
  totalChunks: number;
  totalFAQs: number;
  categories: string[];
}

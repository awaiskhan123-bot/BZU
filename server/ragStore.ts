import fs from 'fs';
import path from 'path';
import {
  KnowledgeChunk,
  UniversityDocument,
  UniversityFAQ,
  UniversityProfile,
  defaultUniversityProfile,
  defaultDocuments,
  defaultKnowledgeChunks,
  defaultFAQs
} from './knowledgeData.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'knowledge-store.json');

interface StoreData {
  profile: UniversityProfile;
  documents: UniversityDocument[];
  chunks: KnowledgeChunk[];
  faqs: UniversityFAQ[];
}

class KnowledgeStore {
  private profile: UniversityProfile = defaultUniversityProfile;
  private documents: UniversityDocument[] = [...defaultDocuments];
  private chunks: KnowledgeChunk[] = [...defaultKnowledgeChunks];
  private faqs: UniversityFAQ[] = [...defaultFAQs];

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed: Partial<StoreData> = JSON.parse(raw);
        if (parsed.profile) this.profile = parsed.profile;
        if (parsed.documents && Array.isArray(parsed.documents)) this.documents = parsed.documents;
        if (parsed.chunks && Array.isArray(parsed.chunks)) this.chunks = parsed.chunks;
        if (parsed.faqs && Array.isArray(parsed.faqs)) this.faqs = parsed.faqs;
      } else {
        this.save();
      }
    } catch (err) {
      console.warn('Failed to load persisted knowledge store, using defaults:', err);
    }
  }

  private save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const data: StoreData = {
        profile: this.profile,
        documents: this.documents,
        chunks: this.chunks,
        faqs: this.faqs
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save knowledge store:', err);
    }
  }

  public getProfile(): UniversityProfile {
    return this.profile;
  }

  public updateProfile(updated: Partial<UniversityProfile>): UniversityProfile {
    this.profile = {
      ...this.profile,
      ...updated,
      contactDirectory: {
        ...this.profile.contactDirectory,
        ...(updated.contactDirectory || {})
      }
    };
    this.save();
    return this.profile;
  }

  public getDocuments(): UniversityDocument[] {
    return this.documents;
  }

  public getChunks(): KnowledgeChunk[] {
    return this.chunks;
  }

  public getFAQs(): UniversityFAQ[] {
    return this.faqs;
  }

  public toggleDocument(docId: string): UniversityDocument | null {
    const doc = this.documents.find(d => d.id === docId);
    if (!doc) return null;
    doc.isActive = !doc.isActive;
    this.save();
    return doc;
  }

  public deleteDocument(docId: string): boolean {
    const initialLen = this.documents.length;
    this.documents = this.documents.filter(d => d.id !== docId);
    this.chunks = this.chunks.filter(c => c.documentId !== docId);
    if (this.documents.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  public addFAQ(faq: Omit<UniversityFAQ, 'id'>): UniversityFAQ {
    const newFaq: UniversityFAQ = {
      id: `faq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...faq
    };
    this.faqs.unshift(newFaq);
    this.save();
    return newFaq;
  }

  public deleteFAQ(faqId: string): boolean {
    const initialLen = this.faqs.length;
    this.faqs = this.faqs.filter(f => f.id !== faqId);
    if (this.faqs.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  public addManualDocument(payload: {
    title: string;
    category: UniversityDocument['category'];
    content: string;
    description?: string;
  }): { document: UniversityDocument; chunksAdded: number } {
    const docId = `doc-manual-${Date.now()}`;
    const cleanContent = payload.content.trim();
    const generatedChunks = this.splitIntoChunks(cleanContent, docId, payload.title, payload.category);

    const doc: UniversityDocument = {
      id: docId,
      title: payload.title,
      category: payload.category,
      fileName: `${payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.txt`,
      fileType: 'manual',
      uploadedAt: new Date().toISOString(),
      fileSize: `${Math.round(cleanContent.length / 1024 * 10) / 10 || 1} KB`,
      isActive: true,
      chunkCount: generatedChunks.length,
      description: payload.description || `Official department entry for ${payload.title}`
    };

    this.documents.unshift(doc);
    this.chunks.push(...generatedChunks);
    this.save();

    return { document: doc, chunksAdded: generatedChunks.length };
  }

  public addUploadedDocument(params: {
    title: string;
    category: UniversityDocument['category'];
    fileName: string;
    fileType: 'pdf' | 'text';
    fileSizeStr: string;
    rawText: string;
    description?: string;
  }): { document: UniversityDocument; chunksAdded: number } {
    const docId = `doc-upload-${Date.now()}`;
    const generatedChunks = this.splitIntoChunks(
      params.rawText,
      docId,
      params.title,
      params.category
    );

    const doc: UniversityDocument = {
      id: docId,
      title: params.title,
      category: params.category,
      fileName: params.fileName,
      fileType: params.fileType,
      uploadedAt: new Date().toISOString(),
      fileSize: params.fileSizeStr,
      isActive: true,
      chunkCount: generatedChunks.length,
      description: params.description || `Uploaded document: ${params.fileName} with ${generatedChunks.length} searchable sections`
    };

    this.documents.unshift(doc);
    this.chunks.push(...generatedChunks);
    this.save();

    return { document: doc, chunksAdded: generatedChunks.length };
  }

  public splitIntoChunks(
    text: string,
    documentId: string,
    documentTitle: string,
    category: UniversityDocument['category']
  ): KnowledgeChunk[] {
    const paragraphs = text
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 30);

    const chunks: KnowledgeChunk[] = [];
    let currentBuffer = '';
    let chunkIndex = 1;

    for (const para of paragraphs) {
      if ((currentBuffer + '\n\n' + para).length > 800 && currentBuffer.length > 200) {
        chunks.push(this.createChunk(currentBuffer, documentId, documentTitle, category, chunkIndex++));
        currentBuffer = para;
      } else {
        currentBuffer = currentBuffer ? `${currentBuffer}\n\n${para}` : para;
      }
    }

    if (currentBuffer.trim().length > 0) {
      chunks.push(this.createChunk(currentBuffer, documentId, documentTitle, category, chunkIndex++));
    }

    if (chunks.length === 0 && text.trim().length > 0) {
      chunks.push(this.createChunk(text.trim(), documentId, documentTitle, category, 1));
    }

    return chunks;
  }

  private createChunk(
    content: string,
    documentId: string,
    documentTitle: string,
    category: UniversityDocument['category'],
    index: number
  ): KnowledgeChunk {
    // Extract first line or clean title
    const firstLine = content.split('\n')[0].replace(/^[#*-]\s*/, '').slice(0, 75);
    const title = firstLine.length > 5 ? firstLine : `${documentTitle} - Section ${index}`;

    // Extract keywords
    const words = content
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3 && !['with', 'from', 'that', 'this', 'have', 'were', 'which', 'their', 'about', 'these', 'could'].includes(w));

    const uniqueKeywords = Array.from(new Set(words)).slice(0, 15);

    return {
      id: `chk-${documentId}-${index}-${Math.random().toString(36).substring(2, 6)}`,
      documentId,
      documentTitle,
      category,
      title,
      content,
      keywords: uniqueKeywords
    };
  }

  /**
   * Search knowledge base with weighted hybrid scoring
   */
  public searchRelevantChunks(query: string, topK: number = 4): { chunk: KnowledgeChunk; score: number }[] {
    const activeDocIds = new Set(this.documents.filter(d => d.isActive).map(d => d.id));
    const cleanQuery = query.toLowerCase().trim();
    const stopWords = new Set([
      'what', 'when', 'where', 'which', 'who', 'whom', 'this', 'that', 'these', 'those',
      'have', 'has', 'had', 'does', 'doing', 'will', 'would', 'should', 'could', 'about',
      'into', 'from', 'with', 'their', 'there', 'they', 'them', 'your', 'ours', 'been',
      'being', 'university', 'college', 'school', 'student', 'students', 'tell', 'know',
      'want', 'please', 'like', 'need', 'give', 'show', 'find', 'make'
    ]);
    const queryTokens = cleanQuery
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 2 && !stopWords.has(t));

    if (queryTokens.length === 0) return [];

    // Category hints
    const categoryBonusMap: Record<string, string[]> = {
      admissions: ['admit', 'admission', 'apply', 'deadline', 'sat', 'act', 'gpa', 'transcript', 'freshman', 'transfer'],
      tuition_aid: ['tuition', 'fee', 'cost', 'pay', 'scholarship', 'financial', 'aid', 'fafsa', 'grant', 'housing', 'dorm', 'meal', 'bursar'],
      programs: ['program', 'degree', 'major', 'minor', 'computer science', 'engineering', 'business', 'nursing', 'course', 'curriculum', 'masters'],
      calendar: ['calendar', 'date', 'semester', 'fall', 'spring', 'break', 'thanksgiving', 'orientation', 'holiday', 'add drop', 'term'],
      exams_grading: ['exam', 'final', 'midterm', 'grade', 'grading', 'probation', 'conflict', 'pass fail', 'dean list', 'reschedule'],
      campus_life: ['library', 'hours', 'gym', 'health', 'clinic', 'dining', 'shuttle', 'bus', 'parking', 'recreation', 'counseling']
    };

    const scored = this.chunks
      .filter(chunk => activeDocIds.has(chunk.documentId))
      .map(chunk => {
        let score = 0;
        const chunkTitle = chunk.title.toLowerCase();
        const chunkContent = chunk.content.toLowerCase();
        const chunkDocTitle = chunk.documentTitle.toLowerCase();

        // Exact phrase match in content or title
        if (chunkContent.includes(cleanQuery)) {
          score += 35;
        }
        if (chunkTitle.includes(cleanQuery)) {
          score += 45;
        }

        // Token scoring
        for (const token of queryTokens) {
          if (chunkTitle.includes(token)) score += 10;
          if (chunkDocTitle.includes(token)) score += 6;
          if (chunk.keywords.some(k => k.includes(token))) score += 7;

          // Frequency in content
          const matches = chunkContent.split(token).length - 1;
          if (matches > 0) {
            score += Math.min(matches * 4, 20);
          }
        }

        // Category matching bonus
        const categoryKeywords = categoryBonusMap[chunk.category] || [];
        for (const token of queryTokens) {
          if (categoryKeywords.some(ck => ck.includes(token) || token.includes(ck))) {
            score += 8;
          }
        }

        return { chunk, score };
      });

    return scored
      .filter(item => item.score >= 20)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  public getStats() {
    return {
      totalDocuments: this.documents.length,
      activeDocuments: this.documents.filter(d => d.isActive).length,
      totalChunks: this.chunks.length,
      totalFAQs: this.faqs.length,
      categories: ['admissions', 'tuition_aid', 'programs', 'calendar', 'exams_grading', 'campus_life']
    };
  }
}

export const knowledgeStore = new KnowledgeStore();

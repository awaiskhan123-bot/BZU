import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import multer from 'multer';
import { knowledgeStore } from './server/ragStore.js';
import { generateUniversityAnswer } from './server/geminiService.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Configure Multer for in-memory file processing
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/pdf',
      'text/plain',
      'text/markdown',
      'application/json'
    ];
    if (allowed.includes(file.mimetype) || file.originalname.endsWith('.pdf') || file.originalname.endsWith('.txt') || file.originalname.endsWith('.md')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, TXT, or MD documents are supported for university ingestion.'));
    }
  }
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  res.json({
    status: 'healthy',
    hasGeminiKey,
    university: knowledgeStore.getProfile().name,
    timestamp: new Date().toISOString()
  });
});

// Chat endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { query, history } = req.body;
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      res.status(400).json({ error: 'Query is required' });
      return;
    }

    const answerResponse = await generateUniversityAnswer(query.trim(), history || []);
    res.json(answerResponse);
  } catch (error: any) {
    console.error('Chat API Error:', error);
    res.status(500).json({
      error: 'An internal error occurred while generating the university answer',
      details: error.message
    });
  }
});

// Knowledge Stats
app.get('/api/knowledge/stats', (_req: Request, res: Response) => {
  res.json({
    stats: knowledgeStore.getStats(),
    profile: knowledgeStore.getProfile()
  });
});

// University Profile endpoints
app.get('/api/university/profile', (_req: Request, res: Response) => {
  res.json(knowledgeStore.getProfile());
});

app.put('/api/university/profile', (req: Request, res: Response) => {
  try {
    const updated = knowledgeStore.updateProfile(req.body);
    res.json({ success: true, profile: updated });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Documents listing
app.get('/api/knowledge/documents', (_req: Request, res: Response) => {
  res.json({
    documents: knowledgeStore.getDocuments(),
    totalChunks: knowledgeStore.getChunks().length
  });
});

// Toggle document active status
app.post('/api/knowledge/documents/:id/toggle', (req: Request, res: Response) => {
  const doc = knowledgeStore.toggleDocument(req.params.id);
  if (!doc) {
    res.status(404).json({ error: 'Document not found' });
    return;
  }
  res.json({ success: true, document: doc });
});

// Delete document
app.delete('/api/knowledge/documents/:id', (req: Request, res: Response) => {
  const deleted = knowledgeStore.deleteDocument(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Document not found' });
    return;
  }
  res.json({ success: true, message: 'Document and associated knowledge chunks removed' });
});

// Manual document entry
app.post('/api/knowledge/documents/manual', (req: Request, res: Response) => {
  try {
    const { title, category, content, description } = req.body;
    if (!title || !category || !content) {
      res.status(400).json({ error: 'Title, category, and content are required' });
      return;
    }

    const result = knowledgeStore.addManualDocument({
      title,
      category,
      content,
      description
    });

    res.json({
      success: true,
      document: result.document,
      chunksAdded: result.chunksAdded
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// File upload (PDF or TXT)
app.post('/api/knowledge/upload-document', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const { originalname, mimetype, buffer, size } = req.file;
    const title = req.body.title || originalname.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    const category = req.body.category || 'policies';
    const description = req.body.description || `Uploaded file ${originalname}`;
    const fileSizeStr = `${(size / 1024).toFixed(1)} KB`;

    let extractedText = '';

    if (mimetype === 'application/pdf' || originalname.endsWith('.pdf')) {
      try {
        // Dynamic import of pdf-parse to be resilient to cjs/esm bundling
        const pdfParseModule = await import('pdf-parse');
        // Handle default or direct export
        const pdfFunc = (pdfParseModule as any).default || pdfParseModule;
        const pdfData = await pdfFunc(buffer);
        extractedText = pdfData.text || '';
      } catch (pdfErr: any) {
        console.error('PDF parsing error:', pdfErr);
        res.status(422).json({
          error: 'Failed to extract text from PDF. Ensure the PDF contains readable text (not scanned images).',
          details: pdfErr.message
        });
        return;
      }
    } else {
      // Plain text or markdown
      extractedText = buffer.toString('utf-8');
    }

    if (!extractedText.trim()) {
      res.status(400).json({ error: 'Extracted document text is empty.' });
      return;
    }

    const result = knowledgeStore.addUploadedDocument({
      title,
      category,
      fileName: originalname,
      fileType: mimetype === 'application/pdf' ? 'pdf' : 'text',
      fileSizeStr,
      rawText: extractedText,
      description
    });

    res.json({
      success: true,
      document: result.document,
      chunksAdded: result.chunksAdded,
      previewExcerpt: extractedText.slice(0, 300)
    });
  } catch (error: any) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// FAQs endpoints
app.get('/api/knowledge/faqs', (_req: Request, res: Response) => {
  res.json({ faqs: knowledgeStore.getFAQs() });
});

app.post('/api/knowledge/faqs', (req: Request, res: Response) => {
  try {
    const { question, answer, category, pinned } = req.body;
    if (!question || !answer) {
      res.status(400).json({ error: 'Question and answer are required' });
      return;
    }
    const created = knowledgeStore.addFAQ({
      question,
      answer,
      category: category || 'General',
      pinned: Boolean(pinned)
    });
    res.json({ success: true, faq: created });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/knowledge/faqs/:id', (req: Request, res: Response) => {
  const deleted = knowledgeStore.deleteFAQ(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'FAQ not found' });
    return;
  }
  res.json({ success: true, message: 'FAQ deleted' });
});

// Test RAG Retrieval Query
app.post('/api/knowledge/test-rag', (req: Request, res: Response) => {
  const { query, topK } = req.body;
  if (!query) {
    res.status(400).json({ error: 'Query is required' });
    return;
  }
  const results = knowledgeStore.searchRelevantChunks(query, Number(topK) || 5);
  res.json({
    query,
    count: results.length,
    results: results.map(r => ({
      chunkId: r.chunk.id,
      title: r.chunk.title,
      documentTitle: r.chunk.documentTitle,
      category: r.chunk.category,
      score: r.score,
      excerpt: r.chunk.content.slice(0, 250) + (r.chunk.content.length > 250 ? '...' : '')
    }))
  });
});

// Mount Vite or serve static
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`University AI Assistant server running on http://0.0.0.0:${PORT} in ${isProduction ? 'production' : 'development'} mode.`);
  });
}

startServer().catch(err => {
  console.error('Server startup failure:', err);
  process.exit(1);
});

import { GoogleGenAI } from '@google/genai';
import { knowledgeStore } from './ragStore.js';
import { KnowledgeChunk } from './knowledgeData.js';

let cachedKey: string | null = null;
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient || cachedKey !== apiKey) {
    cachedKey = apiKey;
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface ChatResponse {
  answer: string;
  sources: {
    documentTitle: string;
    sectionTitle: string;
    category: string;
    relevanceScore: number;
  }[];
  suggestedFollowUps: string[];
  isFallback: boolean;
  modelUsed: string;
}

export async function generateUniversityAnswer(
  userQuery: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[] = []
): Promise<ChatResponse> {
  const profile = knowledgeStore.getProfile();
  // Retrieve relevant knowledge chunks using hybrid RAG
  const searchResults = knowledgeStore.searchRelevantChunks(userQuery, 5);
  const relevantChunks: KnowledgeChunk[] = searchResults.map(r => r.chunk);

  const sources = searchResults.map(r => ({
    documentTitle: r.chunk.documentTitle,
    sectionTitle: r.chunk.title,
    category: r.chunk.category,
    relevanceScore: Math.round(r.score)
  }));

  // Build context block from official chunks
  let contextBlock = '';
  if (relevantChunks.length > 0) {
    contextBlock = relevantChunks
      .map((c, i) => `--- OFFICIAL KNOWLEDGE CHUNK ${i + 1} [Document: ${c.documentTitle}] [Topic: ${c.title}] ---\n${c.content}`)
      .join('\n\n');
  } else {
    contextBlock = 'NO RELEVANT OFFICIAL DOCUMENTS WERE FOUND IN THE CURRENT KNOWLEDGE BASE FOR THIS QUERY.';
  }

  const systemInstruction = `
You are the official University AI Assistant for ${profile.name} (${profile.shortName}), founded in ${profile.founded}.
Motto: "${profile.motto}".
Current Term: ${profile.currentTerm}.
Location: ${profile.location}.

CRITICAL VERIFICATION & ANTI-HALLUCINATION GUARDRAILS:
1. You must ONLY provide factual information derived strictly from the official university knowledge chunks provided below.
2. NEVER invent, guess, extrapolate, or fabricate university policies, tuition fees, application deadlines, GPA thresholds, scholarship amounts, or grading policies.
3. IF THE REQUIRED INFORMATION IS MISSING OR CANNOT BE DEFINITIVELY ANSWERED FROM THE PROVIDED OFFICIAL CHUNKS:
   - State clearly and courteously that the specific information is not contained in the official knowledge base records.
   - Instruct the student/user to contact the appropriate university administrative office directly using the official contact directory below.
4. OFFICIAL CONTACT DIRECTORY:
   - Admissions Office: ${profile.contactDirectory.admissionsEmail} | Phone: ${profile.contactDirectory.admissionsPhone}
   - Financial Aid & Bursar: ${profile.contactDirectory.financialAidEmail} | Phone: ${profile.contactDirectory.financialAidPhone}
   - Office of the Registrar: ${profile.contactDirectory.registrarEmail} | Phone: ${profile.contactDirectory.registrarPhone}
   - General Information: ${profile.contactDirectory.generalInfoEmail}
   - Campus Safety Emergency: ${profile.contactDirectory.campusSafetyEmergency} | Non-Emergency: ${profile.contactDirectory.campusSafetyNonEmergency}
5. FORMATTING:
   - Use clean, professional Markdown formatting with bullet points and bold highlights for critical dates and dollar amounts.
   - Keep answers clear, supportive, and prestigious yet accessible.
   - When citing policies, reference the official document name.
6. AT THE VERY END OF YOUR RESPONSE:
   - You MUST append a JSON-like array block of exactly 3 suggested relevant follow-up questions formatted as:
     <<<FOLLOW_UPS>>>["Question 1?", "Question 2?", "Question 3?"]<<<END_FOLLOW_UPS>>>
`.trim();

  const promptContent = `
OFFICIAL VERIFIED UNIVERSITY KNOWLEDGE:
${contextBlock}

USER QUESTION:
${userQuery}

Provide a verified, authoritative response according to the strict guardrails.
`.trim();

  const ai = getAiClient();

  if (ai) {
    try {
      // Build previous turn history if provided (limiting to last 4 turns)
      const sanitizedHistory = history.slice(-4).map(turn => ({
        role: turn.role,
        parts: turn.parts
      }));

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API call timed out after 6 seconds')), 6000)
      );

      const response = await Promise.race([
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            ...sanitizedHistory,
            { role: 'user', parts: [{ text: promptContent }] }
          ],
          config: {
            systemInstruction,
          }
        }),
        timeoutPromise
      ]);

      const rawText = response.text || '';
      
      // Extract suggested follow-ups
      let answer = rawText;
      let suggestedFollowUps: string[] = [];

      const match = rawText.match(/<<<FOLLOW_UPS>>>([\s\S]*?)<<<END_FOLLOW_UPS>>>/);
      if (match && match[1]) {
        try {
          suggestedFollowUps = JSON.parse(match[1].trim());
          answer = rawText.replace(/<<<FOLLOW_UPS>>>[\s\S]*?<<<END_FOLLOW_UPS>>>/, '').trim();
        } catch {
          suggestedFollowUps = [
            `What are the admission requirements for ${profile.shortName}?`,
            `How do I apply for scholarships and financial aid?`,
            `Where can I view the 2026-2027 academic calendar?`
          ];
        }
      }

      if (suggestedFollowUps.length === 0) {
        suggestedFollowUps = getDefaultFollowUps(userQuery, profile.shortName);
      }

      return {
        answer,
        sources,
        suggestedFollowUps,
        isFallback: false,
        modelUsed: 'gemini-3.8-flash'
      };
    } catch (err) {
      console.error('Error invoking Gemini API:', err);
      // Fallback to grounded local synthesis if API has an error
      return generateLocalSynthesis(userQuery, relevantChunks, sources, profile);
    }
  } else {
    // API key not set or invalid; provide grounded local synthesis
    return generateLocalSynthesis(userQuery, relevantChunks, sources, profile);
  }
}

function generateLocalSynthesis(
  query: string,
  chunks: KnowledgeChunk[],
  sources: ChatResponse['sources'],
  profile: ReturnType<typeof knowledgeStore.getProfile>
): ChatResponse {
  if (chunks.length === 0) {
    return {
      answer: `According to official **${profile.name}** records, we could not locate verified institutional documents answering your question: *"${query}"* in the current knowledge repository.\n\nTo ensure you receive accurate and up-to-date guidance, please contact the university administration directly:\n\n* **Admissions Office:** [${profile.contactDirectory.admissionsEmail}](mailto:${profile.contactDirectory.admissionsEmail}) • ${profile.contactDirectory.admissionsPhone}\n* **Financial Aid & Bursar:** [${profile.contactDirectory.financialAidEmail}](mailto:${profile.contactDirectory.financialAidEmail}) • ${profile.contactDirectory.financialAidPhone}\n* **Office of the Registrar:** [${profile.contactDirectory.registrarEmail}](mailto:${profile.contactDirectory.registrarEmail}) • ${profile.contactDirectory.registrarPhone}\n* **General Inquiries:** [${profile.contactDirectory.generalInfoEmail}](mailto:${profile.contactDirectory.generalInfoEmail})\n\n*(Note: University staff can upload the missing official PDF guidelines via the Admin Knowledge Dashboard).*`,
      sources: [],
      suggestedFollowUps: [
        `What are the undergraduate admission deadlines?`,
        `What is the tuition fee for the current academic year?`,
        `When does the Fall semester begin?`
      ],
      isFallback: true,
      modelUsed: 'Local RAG Knowledge Engine'
    };
  }

  // Synthesize from matching chunks
  const primary = chunks[0];
  const secondary = chunks.slice(1, 3);

  let text = `Based on official records from the **${primary.documentTitle}**:\n\n${primary.content}\n\n`;

  if (secondary.length > 0) {
    text += `### Additional Official Details:\n`;
    for (const sec of secondary) {
      text += `* **${sec.title}** (${sec.documentTitle}):\n${sec.content}\n\n`;
    }
  }

  text += `\n*For further verification, you can contact the ${profile.name} administration at **${profile.contactDirectory.generalInfoEmail}** or call **${profile.contactDirectory.admissionsPhone}**.*`;

  return {
    answer: text,
    sources,
    suggestedFollowUps: getDefaultFollowUps(query, profile.shortName),
    isFallback: true,
    modelUsed: 'RAG Knowledge Synthesis'
  };
}

function getDefaultFollowUps(query: string, shortName: string): string[] {
  const q = query.toLowerCase();
  if (q.includes('deadline') || q.includes('admit') || q.includes('apply') || q.includes('merit')) {
    return [
      `What is the merit formula for BS Computer Science and Engineering at ${shortName}?`,
      `How do I submit the Rs. 1,500 bank challan for BZU admissions?`,
      `When will the 1st, 2nd, and 3rd merit lists be displayed?`
    ];
  }
  if (q.includes('fee') || q.includes('tuition') || q.includes('cost') || q.includes('pkr')) {
    return [
      `What is the fee difference between Morning and Evening programs?`,
      `How much is the student Green Bus transport pass per semester?`,
      `What are the hostel room boarding dues and mess charges at BZU?`
    ];
  }
  if (q.includes('scholarship') || q.includes('aid') || q.includes('hec') || q.includes('peef')) {
    return [
      `How do I apply for the HEC Need-Based Scholarship at SFAO?`,
      `What are the eligibility criteria for the PEEF scholarship?`,
      `What are the semester merit cash awards for top position holders?`
    ];
  }
  if (q.includes('exam') || q.includes('grade') || q.includes('cgpa') || q.includes('attend')) {
    return [
      `What is the mandatory 75% attendance rule for semester exams?`,
      `What CGPA is required to avoid academic probation at BZU?`,
      `When are midterm and final examinations scheduled?`
    ];
  }
  if (q.includes('library') || q.includes('bus') || q.includes('hostel') || q.includes('facil')) {
    return [
      `What are the opening timings for Hazrat Bahauddin Zakariya Central Library?`,
      `Which routes do the BZU Green Buses cover in Multan city?`,
      `How do I apply for hostel accommodation in student halls of residence?`
    ];
  }
  return [
    `What are the undergraduate admission deadlines for Fall 2026?`,
    `What is the fee structure in PKR for Morning vs Evening programs?`,
    `How do I apply for HEC Need-Based scholarships at BZU?`
  ];
}

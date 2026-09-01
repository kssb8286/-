import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { initialChurchData } from './src/data/initialData';
import { ChurchData, DailyQT } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Persistent Data Storage Path
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'church_store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory data store with file persistence
let churchDataCache: ChurchData = initialChurchData;

function loadData(): ChurchData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      churchDataCache = JSON.parse(raw);
    } else {
      churchDataCache = initialChurchData;
      fs.writeFileSync(DATA_FILE, JSON.stringify(churchDataCache, null, 2), 'utf-8');
    }
  } catch (error) {
    console.error('Error loading church data file:', error);
    churchDataCache = initialChurchData;
  }
  return churchDataCache;
}

function saveData(data: ChurchData): boolean {
  try {
    churchDataCache = data;
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving church data file:', error);
    return false;
  }
}

// Load initial data
loadData();

// Lazy Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', church: '광석서부교회', timestamp: new Date().toISOString() });
});

// GET all church data
app.get('/api/church-data', (req, res) => {
  const data = loadData();
  res.json(data);
});

// POST update church data (Admin save)
app.post('/api/church-data', (req, res) => {
  const updatedData: ChurchData = req.body;
  if (!updatedData || !updatedData.info) {
    return res.status(400).json({ error: '유효하지 않은 데이터 형식입니다.' });
  }

  const success = saveData(updatedData);
  if (success) {
    res.json({ success: true, message: '교회 데이터가 성공적으로 저장되었습니다.' });
  } else {
    res.status(500).json({ error: '데이터 저장 중 오류가 발생했습니다.' });
  }
});

// POST reset to initial church data
app.post('/api/church-data/reset', (req, res) => {
  const success = saveData(initialChurchData);
  if (success) {
    res.json({ success: true, data: initialChurchData, message: '초기 데이터로 성공적으로 초기화되었습니다.' });
  } else {
    res.status(500).json({ error: '초기화 중 오류가 발생했습니다.' });
  }
});

// POST generate Daily QT via Gemini AI
app.post('/api/qt/generate', async (req, res) => {
  try {
    const requestedDate = req.body.date || new Date().toISOString().split('T')[0];
    const requestedTopic = req.body.topic || '';

    // Check if QT already exists for this date in stored data and if forceRefresh is not requested
    const currentData = loadData();
    const existingQt = currentData.dailyQts.find((q) => q.date === requestedDate);

    if (existingQt && !req.body.forceRefresh) {
      return res.json({ success: true, qt: existingQt, source: 'cached' });
    }

    const ai = getAi();
    const prompt = `대한예수교장로회(합동) 소속 '광석서부교회'의 성도들을 위한 ${requestedDate} 날짜의 은혜로운 '오늘의 QT(매일 묵상)'를 작성해주세요.

교회 표어: "주님의 말씀에 아멘으로 순종하여 부흥하는 교회"
신학적 정체성: 정통 칼빈주의 개혁주의 신학, 성경의 절대 무오성, 하나님의 주권과 구원 경륜, 오직 예수 그리스도의 십자가 대속 은혜, 말씀에 대한 절대 순종.
${requestedTopic ? `묵상 주제/희망 본문: ${requestedTopic}` : '날마다 새로운 구약/신약 성경 본문 중 성도들의 삶과 순종에 힘이 되는 본문을 택해주세요.'}

반드시 JSON 형태로 정확히 응답해주세요.
응답 스키마:
- title: 묵상 제목 (예: "말씀에 아멘으로 화답하는 믿음")
- scriptureReference: 성경 본문 구절 표기 (예: "시편 23편 1-6절" 또는 "로마서 8장 28-32절")
- scriptureVerses: 성경 구절 배열 [{ verseNumber: number, text: string }] (실제 한국어 개역개정 성경 구절과 일치하는 3~6개 구절)
- keyVerse: 핵심 요절 문구 및 구절 표시
- commentary: 칼빈주의 개혁주의 관점의 깊이 있고 은혜로운 해설과 삶의 적용 (3~4문단, 따뜻하고 명확하며 말씀 순종을 강조)
- meditationQuestions: 성도가 자신을 돌아볼 수 있는 실천적 묵상 질문 2~3개 (문자열 배열)
- prayer: 하나님께 드리는 진솔하고 은혜로운 목회적 기도문 (마무리는 "예수 그리스도의 이름으로 기도드립니다. 아멘.")
- hymnRecommendation: 추천 찬송가 (예: "찬송가 204장 (주의 말씀 듣고서)")
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            scriptureReference: { type: Type.STRING },
            scriptureVerses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  verseNumber: { type: Type.INTEGER },
                  text: { type: Type.STRING },
                },
                required: ['verseNumber', 'text'],
              },
            },
            keyVerse: { type: Type.STRING },
            commentary: { type: Type.STRING },
            meditationQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            prayer: { type: Type.STRING },
            hymnRecommendation: { type: Type.STRING },
          },
          required: [
            'title',
            'scriptureReference',
            'scriptureVerses',
            'keyVerse',
            'commentary',
            'meditationQuestions',
            'prayer',
            'hymnRecommendation',
          ],
        },
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);

    const newQt: DailyQT = {
      id: `qt-${requestedDate}-${Date.now()}`,
      date: requestedDate,
      title: parsed.title || '주님의 말씀과 동행하는 하루',
      scriptureReference: parsed.scriptureReference || '시편 119편 105절',
      scriptureVerses: parsed.scriptureVerses || [
        { verseNumber: 105, text: '주의 말씀은 내 발에 등이요 내 길에 빛이니이다' },
      ],
      keyVerse: parsed.keyVerse || '주의 말씀은 내 발에 등이요 내 길에 빛이니이다 (시 119:105)',
      commentary: parsed.commentary || '오늘도 주님의 말씀에 순종하며 나아갑시다.',
      meditationQuestions: parsed.meditationQuestions || [
        '1. 오늘 하루 주님의 말씀을 내 발의 등으로 삼고 있습니까?',
      ],
      prayer: parsed.prayer || '주님, 주님의 말씀에 아멘으로 순종하게 하옵소서. 예수님의 이름으로 기도합니다. 아멘.',
      hymnRecommendation: parsed.hymnRecommendation || '찬송가 204장',
      isAiGenerated: true,
      author: '광석서부교회 말씀묵상팀 (AI 자동생성)',
    };

    // Auto-save generated QT to church data store so it persists
    const existingIndex = currentData.dailyQts.findIndex((q) => q.date === requestedDate);
    if (existingIndex >= 0) {
      currentData.dailyQts[existingIndex] = newQt;
    } else {
      currentData.dailyQts.unshift(newQt);
    }
    saveData(currentData);

    res.json({ success: true, qt: newQt, source: 'gemini' });
  } catch (error: any) {
    console.error('Error generating daily QT with Gemini:', error);
    res.status(500).json({
      error: '오늘의 QT 생성 중 오류가 발생했습니다.',
      details: error.message,
    });
  }
});

// Admin verify endpoint (Default PIN: 7328286 or 1234)
app.post('/api/admin/verify', (req, res) => {
  const { pin, password } = req.body;
  const val = pin || password;
  // Allows church phone digits 7328286, 8286, or standard admin 1234
  if (val === '7328286' || val === '8286' || val === '1234' || val === 'admin' || val === '7335686' || val === '5686') {
    return res.json({ success: true, authorized: true, authenticated: true });
  }
  res.status(401).json({ success: false, authenticated: false, error: '관리자 비밀번호가 일치하지 않습니다.' });
});

// ----------------------------------------------------
// VITE & SERVER STARTUP
// ----------------------------------------------------
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[광석서부교회] Server started on http://0.0.0.0:${PORT}`);
  });
}

start();

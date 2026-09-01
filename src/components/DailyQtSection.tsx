import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Calendar,
  Volume2,
  VolumeX,
  Share2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Music,
  HelpCircle,
  HeartHandshake,
  Edit3,
  RefreshCw,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { ChurchData, DailyQT } from '../types';

interface DailyQtSectionProps {
  churchData: ChurchData;
  isAdmin: boolean;
  onUpdateQt: (updatedQt: DailyQT) => void;
  onOpenAdminToTab?: (tabName: string) => void;
}

export const DailyQtSection: React.FC<DailyQtSectionProps> = ({
  churchData,
  isAdmin,
  onUpdateQt,
  onOpenAdminToTab,
}) => {
  // Current active date (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(
    churchData.dailyQts[0]?.date || todayStr
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [customTopic, setCustomTopic] = useState('');
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  // Find active QT or use fallback
  const activeQt: DailyQT =
    churchData.dailyQts.find((q) => q.date === selectedDate) ||
    churchData.dailyQts[0] || {
      id: 'default-qt',
      date: selectedDate,
      title: '주님의 말씀에 아멘으로 순종하는 날',
      scriptureReference: '여호수아 1장 8절',
      scriptureVerses: [
        {
          verseNumber: 8,
          text: '이 율법책을 네 입에서 떠나지 말게 하며 주야로 그것을 묵상하여 그 안에 기록된 대로 다 지켜 행하라 그리하면 네 길이 평탄하게 될 것이며 네가 형통하리라',
        },
      ],
      keyVerse: '이 율법책을 네 입에서 떠나지 말게 하며 주야로 그것을 묵상하여... (수 1:8)',
      commentary: '오늘도 하나님의 영감된 진리의 말씀을 묵상하며 순종으로 나아갑시다.',
      meditationQuestions: ['1. 오늘 내가 지켜 행해야 할 말씀은 무엇입니까?'],
      prayer: '주님, 주님의 말씀에 온전히 순종하게 하소서. 예수님의 이름으로 기도합니다. 아멘.',
      hymnRecommendation: '찬송가 204장',
      author: '광석서부교회',
    };

  // Generate new QT using Gemini API via backend
  const handleGenerateQt = async (force: boolean = true) => {
    setIsGenerating(true);
    setGenerateError(null);

    try {
      const response = await fetch('/api/qt/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          topic: customTopic,
          forceRefresh: force,
        }),
      });

      if (!response.ok) {
        throw new Error('오늘의 QT 생성 요청에 실패했습니다.');
      }

      const data = await response.json();
      if (data.success && data.qt) {
        onUpdateQt(data.qt);
        setShowGenerateModal(false);
        setCustomTopic('');
      } else {
        throw new Error(data.error || 'QT 데이터를 받아오지 못했습니다.');
      }
    } catch (err: any) {
      console.error('QT generation failed:', err);
      setGenerateError(err.message || 'AI 말씀 묵상 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Web Speech API for reading aloud
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('사용하시는 브라우저에서 음성 읽기 기능을 지원하지 않습니다.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `광석서부교회 오늘의 큐티. ${activeQt.title}. 성경 본문: ${
        activeQt.scriptureReference
      }. ${activeQt.scriptureVerses
        .map((v) => `${v.verseNumber}절, ${v.text}`)
        .join('. ')}. 묵상 나눔. ${activeQt.commentary}. 기도문. ${activeQt.prayer}`;

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.9; // Calm and dignified pacing
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  // Copy full QT text for sharing via KakaoTalk
  const handleCopyQt = () => {
    const versesText = activeQt.scriptureVerses
      .map((v) => `${v.verseNumber}. ${v.text}`)
      .join('\n');
    const questionsText = activeQt.meditationQuestions.join('\n');

    const shareText = `[광석서부교회 오늘의 QT - ${activeQt.date}]
표어: "주님의 말씀에 아멘으로 순종하여 부흥하는 교회"

📖 제목: ${activeQt.title}
📜 본문: ${activeQt.scriptureReference}

[성경 말씀]
${versesText}

⭐️ [핵심 요절]
${activeQt.keyVerse}

💡 [은혜의 묵상]
${activeQt.commentary}

🤔 [적용 질문]
${questionsText}

🙏 [오늘의 기도]
${activeQt.prayer}

🎵 [추천 찬송]: ${activeQt.hymnRecommendation || '찬송가 204장'}
충남 논산시 광석면 오강2길 18 광석서부교회`;

    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Date step helpers
  const handleShiftDate = (days: number) => {
    const curr = new Date(selectedDate);
    curr.setDate(curr.getDate() + days);
    const newDateStr = curr.toISOString().split('T')[0];
    setSelectedDate(newDateStr);
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  };

  return (
    <section id="qt" className="py-16 sm:py-24 bg-white scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Daily Scripture & Meditation</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif-kr text-slate-900 tracking-tight">
              오늘의 QT (매일 말씀 묵상)
            </h2>
            <p className="mt-1 text-slate-600 text-xs sm:text-sm font-sans-kr">
              날마다 새로운 생명의 양식으로 영혼을 채우고 주님의 말씀에 아멘으로 순종합니다.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowGenerateModal(true)}
              id="ai-generate-qt-btn"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>AI 새 말씀 생성</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => onOpenAdminToTab?.('qt')}
                className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                <span>QT 직접 편집</span>
              </button>
            )}
          </div>
        </div>

        {/* Date Selector & Toolbar */}
        <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          {/* Date Navigator */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleShiftDate(-1)}
              className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              title="이전 날짜"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  if (isPlayingAudio) {
                    window.speechSynthesis.cancel();
                    setIsPlayingAudio(false);
                  }
                }}
                className="text-sm font-semibold text-slate-900 focus:outline-hidden bg-transparent cursor-pointer"
              />
            </div>
            <button
              onClick={() => handleShiftDate(1)}
              className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              title="다음 날짜"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedDate(todayStr)}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors cursor-pointer"
            >
              오늘
            </button>
          </div>

          {/* Tools: Read Aloud & Share */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleSpeech}
              id="qt-read-aloud-btn"
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                isPlayingAudio
                  ? 'bg-indigo-600 text-white border-indigo-600 animate-pulse'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>낭독 중지</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>음성으로 듣기</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyQt}
              id="qt-share-btn"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">카톡 공유 복사됨!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>말씀 공유 복사</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* QT Content Card */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          {/* Card Top Title Banner */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white">
            <div className="flex items-center justify-between text-xs text-indigo-300 font-semibold mb-2">
              <span>{activeQt.date} 묵상</span>
              {activeQt.isAiGenerated && (
                <span className="inline-flex items-center space-x-1 bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                  <Sparkles className="w-3 h-3" />
                  <span>AI 매일 말씀</span>
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-3xl font-bold font-serif-kr text-white leading-tight">
              {activeQt.title}
            </h3>
            <p className="mt-2 text-sm sm:text-base text-indigo-200/90 font-serif-kr flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>본문: {activeQt.scriptureReference}</span>
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* 1. Scripture Reading Verses */}
            <div>
              <h4 className="text-xs font-bold tracking-wider text-indigo-900 uppercase flex items-center space-x-1.5 mb-4">
                <BookOpen className="w-4 h-4 text-indigo-700" />
                <span>성경 말씀 본문 (개역개정)</span>
              </h4>
              <div className="space-y-3 p-5 sm:p-6 rounded-2xl bg-indigo-50/40 border border-indigo-100 font-serif-kr text-slate-800 leading-relaxed text-sm sm:text-base">
                {activeQt.scriptureVerses?.map((verse, i) => (
                  <p key={i} className="flex items-start space-x-3">
                    <span className="font-bold text-indigo-800 text-xs sm:text-sm mt-0.5 shrink-0 bg-indigo-100 px-2 py-0.5 rounded-md">
                      {verse.verseNumber}절
                    </span>
                    <span>{verse.text}</span>
                  </p>
                ))}
              </div>
            </div>

            {/* 2. Key Verse Highlight */}
            {activeQt.keyVerse && (
              <div className="p-4 rounded-xl bg-slate-900 text-indigo-100 border-l-4 border-indigo-500 font-serif-kr text-sm sm:text-base">
                <span className="text-xs font-bold text-indigo-300 block mb-1">
                  ⭐️ 오늘의 핵심 요절
                </span>
                <p className="italic">"{activeQt.keyVerse}"</p>
              </div>
            )}

            {/* 3. Reformed Theological Commentary */}
            <div>
              <h4 className="text-xs font-bold tracking-wider text-indigo-900 uppercase flex items-center space-x-1.5 mb-3">
                <HeartHandshake className="w-4 h-4 text-indigo-700" />
                <span>은혜의 말씀 묵상 및 해설</span>
              </h4>
              <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed font-sans-kr whitespace-pre-line bg-slate-50/80 p-5 rounded-2xl border border-slate-200">
                {activeQt.commentary}
              </div>
            </div>

            {/* 4. Meditation & Application Questions */}
            {activeQt.meditationQuestions && activeQt.meditationQuestions.length > 0 && (
              <div>
                <h4 className="text-xs font-bold tracking-wider text-indigo-900 uppercase flex items-center space-x-1.5 mb-3">
                  <HelpCircle className="w-4 h-4 text-indigo-700" />
                  <span>삶의 실천과 묵상 질문</span>
                </h4>
                <div className="space-y-2">
                  {activeQt.meditationQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 flex items-start space-x-2.5 shadow-2xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="font-medium">{q.replace(/^\d+\.\s*/, '')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Prayer */}
            <div className="p-5 sm:p-6 rounded-2xl bg-indigo-950/5 border border-indigo-100">
              <h4 className="text-xs font-bold tracking-wider text-indigo-950 uppercase flex items-center space-x-1.5 mb-2">
                <span>🙏 오늘의 마침 기도</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-serif-kr italic">
                "{activeQt.prayer}"
              </p>
            </div>

            {/* 6. Recommended Hymn */}
            {activeQt.hymnRecommendation && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <Music className="w-4 h-4 text-indigo-700" />
                  <span>
                    오늘의 추천 찬송:{' '}
                    <strong className="text-slate-900">
                      {activeQt.hymnRecommendation}
                    </strong>
                  </span>
                </div>
                <span className="text-slate-400">
                  {activeQt.author || '광석서부교회'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* AI Generator Modal */}
        {showGenerateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold font-serif-kr text-slate-900">
                    AI 오늘의 QT 생성기
                  </h3>
                </div>
                <button
                  onClick={() => setShowGenerateModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-sans-kr leading-relaxed">
                광석서부교회의 칼빈주의 개혁주의 신학 정체성과 <strong>"주님의 말씀에 아멘으로 순종하여 부흥하는 교회"</strong> 표어에 맞춘 은혜로운 성경 본문과 해설을 AI가 정갈하게 생성합니다.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    묵상 날짜
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    희망 성경 본문 또는 묵상 주제 (선택사항)
                  </label>
                  <input
                    type="text"
                    placeholder="예: 시편 23편 또는 말씀 순종과 부흥, 평안"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    비워두시면 날마다 가장 은혜로운 성경 본문을 자동으로 선별하여 작성합니다.
                  </p>
                </div>
              </div>

              {generateError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{generateError}</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  disabled={isGenerating}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-medium transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerateQt(true)}
                  disabled={isGenerating}
                  id="submit-ai-qt-btn"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>말씀 생성 중...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>새 묵상 생성하기</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

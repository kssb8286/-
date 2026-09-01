import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Play,
  Pause,
  Calendar,
  User,
  BookOpen,
  Search,
  Plus,
  Eye,
  Share2,
  X,
  Volume2,
  VolumeX,
  RotateCcw,
  Copy,
  Check,
  FileText,
  Bookmark,
  Sparkles,
} from 'lucide-react';
import { ChurchData, SermonItem } from '../types';

interface SermonArchiveSectionProps {
  churchData: ChurchData;
  isAdmin: boolean;
  onOpenAdminToTab?: (tabName: string) => void;
}

export const SermonArchiveSection: React.FC<SermonArchiveSectionProps> = ({
  churchData,
  isAdmin,
  onOpenAdminToTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSermon, setActiveSermon] = useState<SermonItem | null>(null);

  // Audio Voice Player state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [sermonFontSize, setSermonFontSize] = useState<'normal' | 'large'>('normal');

  const categories = ['전체', '주일오전', '주일오후', '수요예배', '새벽설교', '특별집회'];

  const filteredSermons = churchData.sermons.filter((sermon) => {
    const matchesCategory =
      selectedCategory === '전체' || sermon.category === selectedCategory;
    const matchesSearch =
      sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.scripture.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.preacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredSermon = churchData.sermons[0];

  // Stop speech when modal closes or unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeSermon]);

  const handleToggleVoicePlay = () => {
    if (!activeSermon) return;

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('음성 재생을 지원하지 않는 브라우저입니다.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();

    const fullSpeechText = `
      ${activeSermon.category}, ${activeSermon.title}.
      설교자: ${activeSermon.preacher}.
      본문 말씀: ${activeSermon.scripture}.
      설교 요약 말씀입니다. ${activeSermon.summary}.
      ${activeSermon.fullNotes ? `설교 상세 해설: ${activeSermon.fullNotes}` : ''}
    `;

    const utterance = new SpeechSynthesisUtterance(fullSpeechText);
    utterance.lang = 'ko-KR';
    utterance.rate = audioSpeed;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };
    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleSpeedChange = (speed: number) => {
    setAudioSpeed(speed);
    if (isPlayingAudio && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setTimeout(() => {
        handleToggleVoicePlay();
      }, 100);
    }
  };

  const handleCopySermonNotes = (sermon: SermonItem) => {
    const text = `[광석서부교회 설교 말씀]\n제목: ${sermon.title}\n설교자: ${sermon.preacher}\n일시: ${sermon.date} (${sermon.category})\n본문: ${sermon.scripture}\n\n■ 설교 요약\n${sermon.summary}\n\n${sermon.fullNotes ? `■ 상세 개요\n${sermon.fullNotes}\n\n` : ''}광석서부교회 | 충남 논산시 광석면 오강2길 18 (전화: ${churchData.info.phone})`;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <section id="sermons" className="py-16 sm:py-24 bg-slate-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold uppercase tracking-wider mb-2">
              <Video className="w-3.5 h-3.5 text-indigo-600" />
              <span>Sermon Archive</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif-kr text-slate-900 tracking-tight">
              설교 아카이브
            </h2>
            <p className="mt-1 text-slate-600 text-xs sm:text-sm font-sans-kr max-w-2xl">
              선포되는 순전한 하나님의 생명의 말씀과 강해 설교를 언제 어디서나 다시 듣고 묵상하실 수 있습니다.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => onOpenAdminToTab?.('sermons')}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs transition-colors self-start md:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>설교 말씀 등록·관리</span>
            </button>
          )}
        </div>

        {/* Featured Sermon Banner */}
        {featuredSermon && (
          <div className="mb-12 rounded-3xl bg-slate-950 text-white overflow-hidden shadow-xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Featured Preview Card */}
            <div className="lg:col-span-7 relative group aspect-video bg-slate-900 flex items-center justify-center overflow-hidden">
              <img
                src={
                  featuredSermon.thumbnailUrl ||
                  `https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80`
                }
                alt={featuredSermon.title}
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <button
                onClick={() => {
                  setActiveSermon(featuredSermon);
                  setIsPlayingAudio(false);
                }}
                className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-indigo-600/90 group-hover:bg-indigo-500 text-white flex items-center justify-center shadow-2xl transition-all group-hover:scale-110 cursor-pointer"
                title="설교 말씀 보기"
              >
                <Play className="w-8 h-8 ml-1 fill-white" />
              </button>
              
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold shadow-md">
                  최신 대표 설교
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-xs text-slate-300 flex items-center justify-between">
                <span className="font-serif-kr text-indigo-200">광석서부교회 강단 선포 말씀</span>
                <span className="bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-700/60">말씀 다시듣기 & 개요</span>
              </div>
            </div>

            {/* Featured Details */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-xs text-indigo-300 font-medium">
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700">
                    {featuredSermon.category}
                  </span>
                  <span>{featuredSermon.date}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-serif-kr text-white leading-snug">
                  {featuredSermon.title}
                </h3>

                <div className="space-y-1.5 text-xs sm:text-sm text-slate-300 font-sans-kr">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>설교자: {featuredSermon.preacher}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>본문 말씀: {featuredSermon.scripture}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans-kr line-clamp-3">
                  {featuredSermon.summary}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    setActiveSermon(featuredSermon);
                    setIsPlayingAudio(false);
                  }}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>설교 말씀 및 개요 보기</span>
                </button>
                <span className="text-xs text-slate-400">
                  조회 {featuredSermon.views || 184}회
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-indigo-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="설교 제목, 본문, 설교자 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Sermon Cards Grid */}
        {filteredSermons.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 text-sm font-medium">
              검색 조건에 맞는 설교 항목이 없습니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSermons.map((sermon) => (
              <div
                key={sermon.id}
                onClick={() => {
                  setActiveSermon(sermon);
                  setIsPlayingAudio(false);
                }}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail Banner */}
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    <img
                      src={
                        sermon.thumbnailUrl ||
                        'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'
                      }
                      alt={sermon.title}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <div className="w-11 h-11 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 ml-0.5 fill-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <span className="px-2 py-0.5 rounded-md bg-black/70 text-indigo-300 text-[11px] font-medium backdrop-blur-xs">
                        {sermon.category}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <div className="flex items-center space-x-2 text-[11px] text-slate-400 mb-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{sermon.date}</span>
                      <span>•</span>
                      <span>{sermon.preacher}</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 font-serif-kr group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {sermon.title}
                    </h4>

                    <div className="mt-2 flex items-center space-x-1.5 text-xs text-indigo-700 font-medium">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate">{sermon.scripture}</span>
                    </div>

                    <p className="mt-2.5 text-xs text-slate-600 leading-relaxed font-sans-kr line-clamp-2">
                      {sermon.summary}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>광석서부교회</span>
                  <span className="text-indigo-600 font-medium group-hover:underline flex items-center space-x-1">
                    <span>말씀보기</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* In-App Sermon Detail & Player Modal */}
        {activeSermon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8 animate-fadeIn">
              {/* Modal Header */}
              <div className="bg-slate-950 text-white p-4 sm:p-5 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-600 text-white text-xs font-bold">
                    {activeSermon.category}
                  </span>
                  <span className="text-xs text-slate-300">{activeSermon.date}</span>
                </div>
                <button
                  onClick={() => {
                    setActiveSermon(null);
                    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                    }
                    setIsPlayingAudio(false);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Built-in Sermon Media Banner & Audio Controller */}
              <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-indigo-400 uppercase tracking-widest font-bold">
                      광석서부교회 강단 설교
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold font-serif-kr text-white mt-0.5">
                      {activeSermon.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      {activeSermon.preacher} • 본문: {activeSermon.scripture}
                    </p>
                  </div>

                  {/* Audio Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleToggleVoicePlay}
                      className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                        isPlayingAudio
                          ? 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {isPlayingAudio ? (
                        <>
                          <Pause className="w-4 h-4 fill-white" />
                          <span>말씀 듣기 일시정지</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4" />
                          <span>말씀 음성 듣기</span>
                        </>
                      )}
                    </button>

                    {/* Speed selection */}
                    <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700 text-xs">
                      {[1.0, 1.25, 1.5].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => handleSpeedChange(speed)}
                          className={`px-2 py-1 rounded-lg font-medium cursor-pointer ${
                            audioSpeed === speed
                              ? 'bg-indigo-600 text-white font-bold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Direct Video Embed if videoUrl exists (Internal / HTML5) */}
                {activeSermon.videoUrl && (
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black mt-3">
                    <video
                      controls
                      src={activeSermon.videoUrl}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Sermon Content & Outline */}
              <div className="p-6 sm:p-8 space-y-6 max-h-[50vh] overflow-y-auto">
                {/* Title & Scripture Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold font-serif-kr text-slate-900">
                      {activeSermon.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600">
                      <span className="font-semibold text-indigo-900">
                        설교자: {activeSermon.preacher}
                      </span>
                      <span>본문 말씀: {activeSermon.scripture}</span>
                      <span>일자: {activeSermon.date}</span>
                    </div>
                  </div>

                  {/* Font Size Toggle */}
                  <div className="flex items-center space-x-1.5 self-start sm:self-auto bg-slate-100 p-1 rounded-xl text-xs">
                    <span className="text-[11px] text-slate-500 px-1">글자 크기:</span>
                    <button
                      onClick={() => setSermonFontSize('normal')}
                      className={`px-2 py-0.5 rounded-lg font-medium cursor-pointer ${
                        sermonFontSize === 'normal'
                          ? 'bg-white text-indigo-900 shadow-2xs font-bold'
                          : 'text-slate-600'
                      }`}
                    >
                      보통
                    </button>
                    <button
                      onClick={() => setSermonFontSize('large')}
                      className={`px-2 py-0.5 rounded-lg font-medium cursor-pointer ${
                        sermonFontSize === 'large'
                          ? 'bg-white text-indigo-900 shadow-2xs font-bold'
                          : 'text-slate-600'
                      }`}
                    >
                      크게
                    </button>
                  </div>
                </div>

                {/* Summary Message */}
                <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                  <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-700" />
                    <span>설교 핵심 요약 및 은혜의 메시지</span>
                  </h4>
                  <p
                    className={`text-slate-800 leading-relaxed font-sans-kr ${
                      sermonFontSize === 'large' ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'
                    }`}
                  >
                    {activeSermon.summary}
                  </p>
                </div>

                {/* Full Outline / Notes if available */}
                {activeSermon.fullNotes && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span>설교 개요 및 본문 해설</span>
                    </h4>
                    <div
                      className={`prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-5 rounded-2xl border border-slate-200 ${
                        sermonFontSize === 'large' ? 'text-base' : 'text-xs sm:text-sm'
                      }`}
                    >
                      {activeSermon.fullNotes}
                    </div>
                  </div>
                )}

                {/* Church motto reminder */}
                <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 text-xs flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>
                      2026 광석서부교회 표어: "주님의 말씀에 아멘으로 순종하여 부흥하는 교회"
                    </span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">
                    문의 {churchData.info.phone}
                  </span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={() => handleCopySermonNotes(activeSermon)}
                  className="inline-flex items-center space-x-1.5 text-xs text-indigo-700 font-semibold hover:text-indigo-900 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer"
                >
                  {copiedText ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-600 font-bold">설교 말씀 복사 완료!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>설교 말씀 복사하기</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setActiveSermon(null);
                    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                    }
                    setIsPlayingAudio(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

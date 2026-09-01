import React from 'react';
import {
  Calendar,
  BookOpen,
  Video,
  MapPin,
  ChevronRight,
  Sparkles,
  Heart,
  ShieldCheck,
  Edit3,
} from 'lucide-react';
import { ChurchData } from '../types';

interface HeroSectionProps {
  churchData: ChurchData;
  isAdmin: boolean;
  onNavigate: (sectionId: string) => void;
  onOpenAdminToTab?: (tabName: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  churchData,
  isAdmin,
  onNavigate,
  onOpenAdminToTab,
}) => {
  const nextSundayWorship = churchData.worshipSchedule.find(
    (w) => w.name.includes('주일오전') || w.name.includes('주일')
  );

  return (
    <section id="hero-section" className="relative overflow-hidden bg-slate-950 text-white">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={churchData.heroImages[0]?.url || 'https://images.unsplash.com/photo-1548625361-1959828d5ecb?auto=format&fit=crop&w=1920&q=80'}
          alt="광석서부교회 전경"
          className="w-full h-full object-cover object-center opacity-30 scale-105 transition-transform duration-10000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/85 to-slate-900/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 sm:pt-16 sm:pb-28">
        {/* Admin Quick Edit Button */}
        {isAdmin && (
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => onOpenAdminToTab?.('basic')}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>표어 & 기본정보 편집</span>
            </button>
          </div>
        )}

        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Denomination badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs sm:text-sm font-medium backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>{churchData.info.denomination}</span>
            <span className="text-indigo-400">•</span>
            <span>논산서부시찰</span>
          </div>

          {/* Main Title & Motto */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif-kr tracking-tight text-white leading-tight">
            {churchData.info.name}
          </h1>

          {/* Motto Display */}
          <div className="py-2 px-4 max-w-3xl mx-auto">
            <div className="relative inline-block py-2 px-6 rounded-2xl bg-indigo-950/50 border border-indigo-500/30 backdrop-blur-md">
              <span className="text-xs uppercase tracking-widest text-indigo-400 font-semibold block mb-1">
                2026 교회 표어
              </span>
              <p className="text-xl sm:text-2xl md:text-3xl font-serif-kr font-bold text-indigo-100 leading-snug">
                "{churchData.info.motto}"
              </p>
            </div>
            <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-sans-kr leading-relaxed">
              {churchData.info.subMotto}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('worship')}
              id="hero-worship-btn"
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm sm:text-base shadow-lg shadow-indigo-900/40 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>예배시간 안내</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('qt')}
              id="hero-qt-btn"
              className="px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-100 font-semibold text-sm sm:text-base border border-slate-700 backdrop-blur-xs transition-all flex items-center space-x-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>오늘의 말씀 QT</span>
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            </button>
            <button
              onClick={() => onNavigate('location')}
              id="hero-location-btn"
              className="px-4 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-medium text-sm sm:text-base border border-slate-700 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span>오시는 길</span>
            </button>
          </div>
        </div>

        {/* 4 Quick Info Cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: 예배안내 */}
          <div
            onClick={() => onNavigate('worship')}
            className="group p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                주일예배
              </span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
              주일 오전 10:30
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              주일오후 12:00 • 수요 17:30/19:00
            </p>
          </div>

          {/* Card 2: 오늘의 QT */}
          <div
            onClick={() => onNavigate('qt')}
            className="group p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                매일 말씀
              </span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
              {churchData.dailyQts[0]?.title || '오늘의 말씀 묵상'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 truncate">
              {churchData.dailyQts[0]?.scriptureReference || '여호수아 1장 7-9절'}
            </p>
          </div>

          {/* Card 3: 최근 설교영상 */}
          <div
            onClick={() => onNavigate('sermons')}
            className="group p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                설교 아카이브
              </span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
              {churchData.sermons[0]?.title || '말씀에 아멘으로 순종하는 성도'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {churchData.pastor.name} 담임목사
            </p>
          </div>

          {/* Card 4: 주소 및 오시는 길 */}
          <div
            onClick={() => onNavigate('location')}
            className="group p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                충남 논산
              </span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
              충남 논산시 광석면 오강2길 18
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              구글지도 길찾기 및 주차 완비
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

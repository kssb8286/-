import React from 'react';
import {
  Church,
  ShieldCheck,
  BookMarked,
  Scroll,
  HeartHandshake,
  Sparkles,
  Edit3,
  Award,
} from 'lucide-react';
import { ChurchData } from '../types';

interface ChurchIdentitySectionProps {
  churchData: ChurchData;
  isAdmin: boolean;
  onOpenAdminToTab?: (tabName: string) => void;
}

export const ChurchIdentitySection: React.FC<ChurchIdentitySectionProps> = ({
  churchData,
  isAdmin,
  onOpenAdminToTab,
}) => {
  const { identity } = churchData;

  return (
    <section id="identity" className="py-16 sm:py-24 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Church Identity & Reformed Faith</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif-kr text-slate-900 tracking-tight">
              교회 신앙 정체성
            </h2>
            <p className="mt-1 text-slate-600 text-xs sm:text-sm font-sans-kr max-w-2xl">
              정통 개혁주의 칼빈주의 신학의 터 위에 세워진 신앙고백과 말씀의 순수성을 지켜나갑니다.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => onOpenAdminToTab?.('identity')}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs transition-colors self-start md:self-auto cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>교회 정체성 수정</span>
            </button>
          )}
        </div>

        {/* Main Confession Card */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-8 sm:p-10 shadow-xl border border-slate-800 mb-12">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-3">
            <Scroll className="w-4 h-4" />
            <span>{identity.denominationTitle}</span>
          </div>

          <h3 className="text-xl sm:text-3xl font-bold font-serif-kr text-indigo-100 leading-snug mb-4">
            "성경은 일점일획도 오류가 없는 하나님의 말씀이며, 창세 전 하나님의 택하심과 오직 예수 그리스도로 말미암는 구원을 굳게 믿습니다."
          </h3>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans-kr bg-white/5 p-5 sm:p-6 rounded-2xl border border-white/10">
            {identity.coreConfession}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-indigo-300">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30">
              신학기초: {identity.theologyBase}
            </span>
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30">
              웨스트민스터 신앙고백서 준수
            </span>
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30">
              대한예수교장로회(합동) 대전노회
            </span>
          </div>
        </div>

        {/* 5 Solas of Reformation */}
        <div className="mb-14">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-bold font-serif-kr text-slate-900">
              종교개혁 5대 솔라 (5 Solas)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              개혁교회가 지켜온 5가지 본질적 신앙 원리입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {identity.fiveSolas.map((sola, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-mono font-bold text-indigo-700 block mb-1">
                    {sola.latin}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 font-serif-kr mb-2">
                    {sola.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans-kr">
                    {sola.description}
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-200/60 text-[10px] font-semibold text-slate-400">
                  SOLA {idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Calvinist Doctrine Points */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-bold font-serif-kr text-slate-900">
              광석서부교회 핵심 신앙 교리
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              하나님의 주권과 구속의 은혜를 고백하는 믿음의 기둥들입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {identity.detailedDoctrine.map((doc, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all flex items-start space-x-4"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 font-serif-kr font-bold text-base">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 font-serif-kr mb-1.5">
                    {doc.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans-kr">
                    {doc.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

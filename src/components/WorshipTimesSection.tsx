import React, { useState } from 'react';
import {
  Clock,
  MapPin,
  Sparkles,
  Sun,
  Moon,
  Calendar,
  CreditCard,
  Copy,
  Check,
  Edit3,
  Heart,
  Flame,
} from 'lucide-react';
import { ChurchData, WorshipScheduleItem } from '../types';

interface WorshipTimesSectionProps {
  churchData: ChurchData;
  isAdmin: boolean;
  onOpenAdminToTab?: (tabName: string) => void;
}

export const WorshipTimesSection: React.FC<WorshipTimesSectionProps> = ({
  churchData,
  isAdmin,
  onOpenAdminToTab,
}) => {
  const [copiedAccount, setCopiedAccount] = useState(false);

  const handleCopyAccount = () => {
    const accountStr = `${churchData.info.offeringAccount.bank} ${churchData.info.offeringAccount.number} (예금주: ${churchData.info.offeringAccount.holder})`;
    navigator.clipboard.writeText(accountStr);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const getIconForService = (name: string) => {
    if (name.includes('새벽')) return Moon;
    if (name.includes('수요')) return Flame;
    if (name.includes('오후')) return Sun;
    return Calendar;
  };

  return (
    <section id="worship" className="py-16 sm:py-24 bg-slate-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold uppercase tracking-wider mb-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Worship & Prayer Times</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif-kr text-slate-900 tracking-tight">
              예배 및 기도회 시간 안내
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base font-sans-kr max-w-2xl">
              영과 진리로 하나님을 예배하며, 기도로 새벽을 깨우고 주님의 임재를 사모하는 광석서부교회의 거룩한 예배 시간입니다.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => onOpenAdminToTab?.('worship')}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs transition-colors self-start md:self-auto cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>예배시간 수정·추가</span>
            </button>
          )}
        </div>

        {/* Worship Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {churchData.worshipSchedule.map((item, idx) => {
            const Icon = getIconForService(item.name);
            const isDawn = item.name.includes('새벽');
            const isMain = item.name.includes('오전');
            const isWed = item.name.includes('수요');

            return (
              <div
                key={item.id || idx}
                className={`relative rounded-2xl p-6 transition-all duration-200 border flex flex-col justify-between ${
                  isMain
                    ? 'bg-gradient-to-br from-indigo-50/70 via-white to-white border-indigo-300 shadow-md ring-1 ring-indigo-200'
                    : 'bg-white border-slate-200 shadow-2xs hover:shadow-md'
                }`}
              >
                <div>
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        isMain
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {item.badge || '정기예배'}
                    </span>
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isMain
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Time */}
                  <h3 className="text-lg font-bold text-slate-900 font-serif-kr">
                    {item.name}
                  </h3>

                  <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="text-base sm:text-lg font-bold font-sans-kr text-indigo-950">
                        {item.time}
                      </span>
                    </div>
                    {item.seasonNote && (
                      <p className="text-xs text-indigo-700 font-medium mt-1 pl-6">
                        • {item.seasonNote}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-sans-kr">
                    {item.description}
                  </p>
                </div>

                {/* Location footer */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.location || '본당 (대예배실)'}</span>
                  </div>
                  {isDawn && (
                    <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                      매일새벽
                    </span>
                  )}
                  {isWed && (
                    <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      말씀강해
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Online Offering / Tithe Guide Card */}
        <div className="mt-10 rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-base sm:text-lg font-bold text-slate-900 font-serif-kr">
                  온라인 헌금 및 후원 계좌 안내
                </h4>
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                  농협은행
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-sans-kr">
                정성껏 준비하신 십일조, 감사헌금, 선교헌금을 온라인으로도 하나님께 봉헌하실 수 있습니다.
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-900">
                <span className="font-mono bg-slate-100 px-3 py-1 rounded-md text-base text-indigo-950 border border-slate-200">
                  {churchData.info.offeringAccount.bank} {churchData.info.offeringAccount.number}
                </span>
                <span className="text-xs text-slate-500">
                  (예금주: {churchData.info.offeringAccount.holder})
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCopyAccount}
            id="copy-account-btn"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all shrink-0 cursor-pointer"
          >
            {copiedAccount ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>계좌번호 복사완료!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-indigo-400" />
                <span>계좌번호 복사하기</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

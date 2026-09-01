import React from 'react';
import {
  User,
  GraduationCap,
  Award,
  Phone,
  Mail,
  Heart,
  Quote,
  Edit3,
  Church,
} from 'lucide-react';
import { ChurchData } from '../types';

interface PastorSectionProps {
  churchData: ChurchData;
  isAdmin: boolean;
  onOpenAdminToTab?: (tabName: string) => void;
}

export const PastorSection: React.FC<PastorSectionProps> = ({
  churchData,
  isAdmin,
  onOpenAdminToTab,
}) => {
  const { pastor } = churchData;

  return (
    <section id="pastor" className="py-16 sm:py-24 bg-slate-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold uppercase tracking-wider mb-2">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>Senior Pastor</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif-kr text-slate-900 tracking-tight">
              담임목사 소개 및 인사말
            </h2>
            <p className="mt-1 text-slate-600 text-xs sm:text-sm font-sans-kr max-w-2xl">
              하나님의 말씀을 바르게 선포하고, 온 성도를 그리스도의 사랑으로 섬기는 박성영 담임목사입니다.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => onOpenAdminToTab?.('pastor')}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs transition-colors self-start md:self-auto cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>목회자 정보 수정</span>
            </button>
          )}
        </div>

        {/* Pastor Card Profile */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column: Photo & Credentials */}
          <div className="lg:col-span-4 bg-slate-950 text-white p-8 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Profile Image */}
              <div className="relative mx-auto w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shadow-xl border-2 border-indigo-400/40">
                <img
                  src={
                    pastor.profileImageUrl ||
                    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={`${pastor.name} 담임목사`}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Name & Title */}
              <div className="text-center">
                <span className="text-xs font-semibold text-indigo-400 tracking-widest uppercase block mb-1">
                  {pastor.title}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-serif-kr text-white">
                  {pastor.name} <span className="text-lg font-normal text-slate-300">목사</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-sans-kr">
                  광석서부교회 담임목사
                </p>
              </div>

              {/* Credentials / Education List */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5 text-xs text-slate-300 font-sans-kr">
                <div className="flex items-start space-x-2">
                  <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span className="font-semibold text-indigo-200">
                    총신대학교 신학대학원 제102회 졸업
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <Church className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>대한예수교장로회(합동) 대전노회 소속</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Award className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>논산서부시찰 소속</span>
                </div>
              </div>
            </div>

            {/* Pastor Contact */}
            <div className="pt-6 mt-6 border-t border-slate-800 space-y-2 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                <span>교회 대표: {churchData.info.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>{churchData.info.email || 'saintpak5686@gmail.com'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Greeting & Pastoral Vision */}
          <div className="lg:col-span-8 p-8 sm:p-12 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Quote Banner */}
              <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-950 flex items-start space-x-3">
                <Quote className="w-7 h-7 text-indigo-600 shrink-0 rotate-180" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 block mb-1">
                    목회 철학 및 비전
                  </span>
                  <p className="text-sm sm:text-base font-serif-kr font-bold text-indigo-950 leading-snug">
                    "{pastor.ministryVision}"
                  </p>
                </div>
              </div>

              {/* Greeting Text */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  목회자 인사말
                </h4>
                <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed font-sans-kr whitespace-pre-line space-y-4">
                  {pastor.greeting}
                </div>
              </div>
            </div>

            {/* Signature Area */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500 font-sans-kr">
                  오직 주의 말씀과 십자가의 은혜만을 자랑하며,
                </p>
                <p className="text-base font-serif-kr font-bold text-slate-900 mt-0.5">
                  광석서부교회 담임목사 <span className="text-indigo-700">{pastor.name}</span>
                </p>
              </div>

              <div className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-serif-kr text-slate-700">
                대한예수교장로회(합동) 대전노회 논산서부시찰
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

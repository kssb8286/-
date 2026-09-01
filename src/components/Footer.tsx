import React from 'react';
import {
  Church,
  MapPin,
  Phone,
  Mail,
  Heart,
  ChevronUp,
  Lock,
  Unlock,
  Sparkles,
} from 'lucide-react';
import { ChurchData } from '../types';

interface FooterProps {
  churchData: ChurchData;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  churchData,
  isAdmin,
  onToggleAdmin,
  onOpenAdmin,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: '교회표어', href: '#motto' },
    { label: '예배시간', href: '#worship' },
    { label: '오늘의 QT', href: '#qt' },
    { label: '설교영상', href: '#sermons' },
    { label: '교회사진', href: '#photos' },
    { label: '게시판·주보', href: '#board' },
    { label: '교회 정체성', href: '#identity' },
    { label: '목회자 소개', href: '#pastor' },
    { label: '오시는 길', href: '#location' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Church Identity & Motto */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-serif-kr font-bold shadow-md">
                <Church className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] tracking-widest text-indigo-400 font-semibold block uppercase">
                  {churchData.info.denomination}
                </span>
                <span className="text-lg font-bold font-serif-kr text-white">
                  {churchData.info.name}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] font-bold text-indigo-400 block mb-1">
                2026년 교회 표어
              </span>
              <p className="text-xs font-serif-kr font-bold text-slate-200">
                "{churchData.info.motto}"
              </p>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans-kr">
              대한예수교장로회(합동) 대전노회 논산서부시찰 소속으로, 칼빈주의 개혁주의 신학 위에 오직 성경, 오직 은혜의 구원을 선포합니다.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4">
              빠른 바로가기
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-xs font-sans-kr">
              {navLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-indigo-300 transition-colors flex items-center space-x-1"
                  >
                    <span>•</span>
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Worship Hours Brief */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4">
              주요 예배 시간
            </h4>
            <div className="space-y-2 text-xs font-sans-kr text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">주일 오전예배</span>
                <strong className="text-white">10:30</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">주일 오후예배</span>
                <strong className="text-white">12:00</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">수요예배</span>
                <strong className="text-white">하절 17:30 / 동절 19:00</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">새벽설교</span>
                <strong className="text-white">새벽 04:20</strong>
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Offering Account */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              교회 연락처 & 헌금안내
            </h4>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span>{churchData.info.addressRoad}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{churchData.info.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{churchData.info.email || 'saintpak5686@gmail.com'}</span>
              </div>
            </div>

            {/* Offering account */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                온라인 헌금 계좌
              </span>
              <p className="font-mono text-indigo-300 font-bold">
                {churchData.info.offeringAccount.bank}{' '}
                {churchData.info.offeringAccount.number}
              </p>
              <p className="text-[11px] text-slate-400">
                예금주: {churchData.info.offeringAccount.holder}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Controls */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-2">
            <span>
              © 2026 {churchData.info.name}. All rights reserved.
            </span>
            <span>•</span>
            <span>담임목사 {churchData.pastor.name}</span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Admin trigger */}
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-indigo-300 border border-slate-800 transition-colors cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>관리자 모드</span>
            </button>

            {/* Back to top */}
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              title="맨 위로 이동"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

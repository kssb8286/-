import React, { useState } from 'react';
import {
  Church,
  Menu,
  X,
  Phone,
  MapPin,
  Lock,
  Unlock,
  BookOpen,
  Calendar,
  Video,
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
  Info,
  Type,
} from 'lucide-react';
import { ChurchData } from '../types';

interface NavbarProps {
  churchData: ChurchData;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  isLargeFont: boolean;
  onToggleFontSize: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  churchData,
  isAdmin,
  onToggleAdmin,
  isLargeFont,
  onToggleFontSize,
  activeSection,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'worship', label: '예배시간', icon: Calendar },
    { id: 'qt', label: '오늘의 QT', icon: BookOpen, badge: 'AI' },
    { id: 'sermons', label: '설교영상', icon: Video },
    { id: 'identity', label: '교회정체성', icon: Church },
    { id: 'pastor', label: '목회자소개', icon: Info },
    { id: 'photos', label: '교회사진', icon: ImageIcon },
    { id: 'board', label: '게시판·주보', icon: MessageSquare },
    { id: 'location', label: '오시는 길', icon: MapPin },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      {/* Top utility banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-slate-200">
            <span className="font-semibold text-indigo-400">교회표어</span>
            <span className="text-slate-300 truncate max-w-xs sm:max-w-md md:max-w-xl">
              "{churchData.info.motto}"
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href={`tel:${churchData.info.phone}`}
              className="flex items-center space-x-1 hover:text-indigo-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-indigo-400" />
              <span>{churchData.info.phone}</span>
            </a>
            <button
              onClick={onToggleFontSize}
              id="font-size-toggle-btn"
              className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer border border-slate-700"
              title="글자 크기 변경"
            >
              <Type className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isLargeFont ? '글자 보통' : '큰글자 모드'}</span>
            </button>
            <button
              onClick={onToggleAdmin}
              id="admin-mode-toggle-btn"
              className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                isAdmin
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              {isAdmin ? (
                <>
                  <Unlock className="w-3 h-3 text-white" />
                  <span>관리자모드 ON</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>관리자</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Church Name */}
          <button
            onClick={() => handleNavClick('hero')}
            className="flex items-center space-x-3 text-left group cursor-pointer focus:outline-hidden"
          >
            <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-700 transition-colors">
              <Church className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-bold font-serif-kr tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {churchData.info.name}
                </span>
                <span className="hidden md:inline-block text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {churchData.info.denomination}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-sans-kr truncate max-w-xs">
                충남 논산시 광석면 오강2길 18
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50 font-bold'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-indigo-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle-btn"
              className="p-2.5 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-hidden cursor-pointer"
              aria-label="메뉴 열기"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white shadow-xl animate-fadeIn">
          <div className="px-4 pt-3 pb-6 space-y-1">
            <div className="p-3 mb-2 bg-indigo-50/80 rounded-xl border border-indigo-200">
              <p className="text-xs font-semibold text-indigo-900 mb-1">
                {churchData.info.denomination}
              </p>
              <p className="text-xs text-indigo-800 italic font-serif-kr">
                "{churchData.info.motto}"
              </p>
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-200'
                      : 'text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-600 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-4 mt-3 border-t border-slate-200 grid grid-cols-2 gap-2">
              <a
                href={`tel:${churchData.info.phone}`}
                className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-medium"
              >
                <Phone className="w-4 h-4 text-indigo-600" />
                <span>교회 전화걸기</span>
              </a>
              <button
                onClick={() => {
                  onToggleAdmin();
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-sm font-medium ${
                  isAdmin
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-900 text-white'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>{isAdmin ? '관리자 OFF' : '관리자 로그인'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

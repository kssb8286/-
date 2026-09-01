import React, { useState, useEffect } from 'react';
import { initialChurchData } from './data/initialData';
import { ChurchData, DailyQT, BoardPost, SermonItem, PhotoItem } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { WorshipTimesSection } from './components/WorshipTimesSection';
import { DailyQtSection } from './components/DailyQtSection';
import { SermonArchiveSection } from './components/SermonArchiveSection';
import { PhotoGallerySection } from './components/PhotoGallerySection';
import { BoardSection } from './components/BoardSection';
import { ChurchIdentitySection } from './components/ChurchIdentitySection';
import { PastorSection } from './components/PastorSection';
import { LocationSection } from './components/LocationSection';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { Lock, Key, X, Check, AlertCircle } from 'lucide-react';

export default function App() {
  const [churchData, setChurchData] = useState<ChurchData>(initialChurchData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState<boolean>(false);
  const [adminInitialTab, setAdminInitialTab] = useState<string>('basic');
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Font size zoom level for seniors
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'xlarge'>('normal');

  // Load data from server API
  const fetchChurchData = async () => {
    try {
      const res = await fetch('/api/church-data');
      if (res.ok) {
        const data = await res.json();
        if (data && data.info) {
          setChurchData(data);
        }
      }
    } catch (err) {
      console.warn('Using local fallback initial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChurchData();
  }, []);

  // Save updated data to server
  const handleSaveData = async (newData: ChurchData): Promise<boolean> => {
    try {
      const res = await fetch('/api/church-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });
      if (res.ok) {
        setChurchData(newData);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to save church data:', err);
      // Still update locally
      setChurchData(newData);
      return true;
    }
  };

  // Reset data to defaults
  const handleResetData = async () => {
    try {
      await fetch('/api/church-data/reset', { method: 'POST' });
      await fetchChurchData();
    } catch (e) {
      setChurchData(initialChurchData);
    }
  };

  // Admin login handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPasswordInput }),
      });
      const data = await res.json();
      if (data.authenticated) {
        setIsAdmin(true);
        setShowAdminLoginModal(false);
        setShowAdminDashboard(true);
        setAdminPasswordInput('');
      } else {
        setLoginError('비밀번호가 올바르지 않습니다. (기본 비밀번호: 1234)');
      }
    } catch (err) {
      // Fallback check
      if (adminPasswordInput === '1234' || adminPasswordInput === 'gwangseok2026') {
        setIsAdmin(true);
        setShowAdminLoginModal(false);
        setShowAdminDashboard(true);
        setAdminPasswordInput('');
      } else {
        setLoginError('비밀번호가 올바르지 않습니다.');
      }
    }
  };

  // Direct tab opener in Admin dashboard
  const handleOpenAdminToTab = (tabName: string) => {
    setAdminInitialTab(tabName);
    if (!isAdmin) {
      setShowAdminLoginModal(true);
    } else {
      setShowAdminDashboard(true);
    }
  };

  // Update QT item handler
  const handleUpdateQt = (updatedQt: DailyQT) => {
    const existingIdx = churchData.dailyQts.findIndex((q) => q.date === updatedQt.date);
    let updatedQts = [...churchData.dailyQts];
    if (existingIdx >= 0) {
      updatedQts[existingIdx] = updatedQt;
    } else {
      updatedQts.unshift(updatedQt);
    }
    const updatedData = { ...churchData, dailyQts: updatedQts };
    setChurchData(updatedData);
    handleSaveData(updatedData);
  };

  // Add Board post handler
  const handleAddPost = (newPost: BoardPost) => {
    const updatedData = {
      ...churchData,
      boardPosts: [newPost, ...churchData.boardPosts],
    };
    setChurchData(updatedData);
    handleSaveData(updatedData);
  };

  // Update Board post handler
  const handleUpdatePost = (updatedPost: BoardPost) => {
    const updatedPosts = churchData.boardPosts.map((p) =>
      p.id === updatedPost.id ? updatedPost : p
    );
    const updatedData = { ...churchData, boardPosts: updatedPosts };
    setChurchData(updatedData);
    handleSaveData(updatedData);
  };

  // Delete Board post handler
  const handleDeletePost = (postId: string) => {
    const updatedPosts = churchData.boardPosts.filter((p) => p.id !== postId);
    const updatedData = { ...churchData, boardPosts: updatedPosts };
    setChurchData(updatedData);
    handleSaveData(updatedData);
  };

  // Font size CSS class
  const getFontSizeClass = () => {
    if (fontSizeLevel === 'large') return 'text-[105%]';
    if (fontSizeLevel === 'xlarge') return 'text-[112%]';
    return 'text-base';
  };

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-800 font-sans-kr selection:bg-indigo-100 selection:text-indigo-900 ${getFontSizeClass()}`}>
      {/* 1. Header Navigation Bar */}
      <Navbar
        churchData={churchData}
        isAdmin={isAdmin}
        onToggleAdmin={() => {
          if (!isAdmin) {
            setShowAdminLoginModal(true);
          } else {
            setShowAdminDashboard(true);
          }
        }}
        fontSizeLevel={fontSizeLevel}
        onChangeFontSize={setFontSizeLevel}
      />

      {/* 2. Hero Section (Motto, Quick Cards, Quick Ticker) */}
      <HeroSection churchData={churchData} />

      {/* 3. Worship Times Section (4 services & offering account) */}
      <WorshipTimesSection
        churchData={churchData}
        isAdmin={isAdmin}
        onOpenAdminToTab={handleOpenAdminToTab}
      />

      {/* 4. Daily QT Section (AI Auto Generation & Voice Reader) */}
      <DailyQtSection
        churchData={churchData}
        isAdmin={isAdmin}
        onUpdateQt={handleUpdateQt}
        onOpenAdminToTab={handleOpenAdminToTab}
      />

      {/* 5. Sermon Video Archive Section (YouTube player & Outline) */}
      <SermonArchiveSection
        churchData={churchData}
        isAdmin={isAdmin}
        onOpenAdminToTab={handleOpenAdminToTab}
      />

      {/* 6. Photo Gallery Section (Landscape, Worship, Fellowship) */}
      <PhotoGallerySection
        churchData={churchData}
        isAdmin={isAdmin}
        onOpenAdminToTab={handleOpenAdminToTab}
      />

      {/* 7. Board & Bulletin Section (Notices, Bulletins, Prayer, Comments) */}
      <BoardSection
        churchData={churchData}
        isAdmin={isAdmin}
        onAddPost={handleAddPost}
        onUpdatePost={handleUpdatePost}
        onDeletePost={handleDeletePost}
        onOpenAdminToTab={handleOpenAdminToTab}
      />

      {/* 8. Church Faith Identity Section (Calvinism, 5 Solas, Doctrines) */}
      <ChurchIdentitySection
        churchData={churchData}
        isAdmin={isAdmin}
        onOpenAdminToTab={handleOpenAdminToTab}
      />

      {/* 9. Senior Pastor Section (Rev. Park Seong-young, Chongshin 102th, Vision) */}
      <PastorSection
        churchData={churchData}
        isAdmin={isAdmin}
        onOpenAdminToTab={handleOpenAdminToTab}
      />

      {/* 10. Location & Directions Section (Google Map, Road/Jibun Address, Nav links) */}
      <LocationSection
        churchData={churchData}
        isAdmin={isAdmin}
        onOpenAdminToTab={handleOpenAdminToTab}
      />

      {/* Footer */}
      <Footer
        churchData={churchData}
        isAdmin={isAdmin}
        onToggleAdmin={() => {
          if (!isAdmin) {
            setShowAdminLoginModal(true);
          } else {
            setIsAdmin(false);
          }
        }}
        onOpenAdmin={() => {
          if (!isAdmin) {
            setShowAdminLoginModal(true);
          } else {
            setShowAdminDashboard(true);
          }
        }}
      />

      {/* Admin Login Modal */}
      {showAdminLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-slate-900 text-slate-100 rounded-2xl max-w-sm w-full p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-lg bg-indigo-700 text-white flex items-center justify-center font-bold">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif-kr text-white">
                    관리자 로그인
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    광석서부교회 콘텐츠 관리
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAdminLoginModal(false);
                  setLoginError(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>관리자 비밀번호</span>
                  <span className="text-[10px] text-indigo-400 font-mono">기본: 1234</span>
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="비밀번호 입력..."
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    autoFocus
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminLoginModal(false);
                    setLoginError(null);
                  }}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium cursor-pointer transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  로그인 및 관리 시작
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Dashboard Full Modal */}
      {showAdminDashboard && (
        <AdminDashboard
          churchData={churchData}
          onSaveData={handleSaveData}
          onResetData={handleResetData}
          onClose={() => setShowAdminDashboard(false)}
          initialTab={adminInitialTab}
        />
      )}
    </div>
  );
}

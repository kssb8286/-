import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Save,
  RotateCcw,
  Download,
  Upload,
  Plus,
  Trash2,
  Edit3,
  Check,
  AlertCircle,
  X,
  Church,
  Clock,
  BookOpen,
  Video,
  Image as ImageIcon,
  MessageSquare,
  User,
  ShieldCheck,
  MapPin,
  Sparkles,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import {
  ChurchData,
  WorshipScheduleItem,
  DailyQT,
  SermonItem,
  PhotoItem,
  BoardPost,
} from '../types';

interface AdminDashboardProps {
  churchData: ChurchData;
  onSaveData: (data: ChurchData) => Promise<boolean>;
  onResetData: () => Promise<void>;
  onClose: () => void;
  initialTab?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  churchData,
  onSaveData,
  onResetData,
  onClose,
  initialTab = 'basic',
}) => {
  const [data, setData] = useState<ChurchData>(JSON.parse(JSON.stringify(churchData)));
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);

  // QT generator state inside admin
  const [aiQtDate, setAiQtDate] = useState(new Date().toISOString().split('T')[0]);
  const [aiQtTopic, setAiQtTopic] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Selected item editors
  const [editingWorshipId, setEditingWorshipId] = useState<string | null>(null);
  const [editingSermonId, setEditingSermonId] = useState<string | null>(null);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [editingQtId, setEditingQtId] = useState<string | null>(null);

  const tabs = [
    { id: 'basic', label: '1. 기본정보 & 표어', icon: Church },
    { id: 'worship', label: '2. 예배시간표', icon: Clock },
    { id: 'qt', label: '3. 오늘의 QT (AI)', icon: BookOpen },
    { id: 'sermons', label: '4. 설교영상 아카이브', icon: Video },
    { id: 'photos', label: '5. 포토 갤러리', icon: ImageIcon },
    { id: 'board', label: '6. 게시판 & 주보', icon: MessageSquare },
    { id: 'pastor', label: '7. 목회자 소개', icon: User },
    { id: 'identity', label: '8. 교회 정체성', icon: ShieldCheck },
    { id: 'location', label: '9. 주소 & 지도', icon: MapPin },
    { id: 'backup', label: '10. 데이터 백업/복원', icon: Download },
  ];

  // Global Save Handler
  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccessMsg(null);
    setSaveErrorMsg(null);

    const success = await onSaveData(data);
    setIsSaving(false);
    if (success) {
      setSaveSuccessMsg('모든 변경사항이 성공적으로 저장되었습니다!');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    } else {
      setSaveErrorMsg('저장 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // AI QT Generator Trigger in Admin
  const handleGenerateAiQt = async () => {
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/qt/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: aiQtDate,
          topic: aiQtTopic,
          forceRefresh: true,
        }),
      });
      const resData = await res.json();
      if (resData.success && resData.qt) {
        const existingIndex = data.dailyQts.findIndex((q) => q.date === aiQtDate);
        let updatedQts = [...data.dailyQts];
        if (existingIndex >= 0) {
          updatedQts[existingIndex] = resData.qt;
        } else {
          updatedQts.unshift(resData.qt);
        }
        const updatedData = { ...data, dailyQts: updatedQts };
        setData(updatedData);
        await onSaveData(updatedData);
        setSaveSuccessMsg(`${aiQtDate} 날짜의 AI QT가 생성 및 저장되었습니다.`);
        setTimeout(() => setSaveSuccessMsg(null), 3000);
      } else {
        alert(resData.error || 'AI QT 생성에 실패했습니다.');
      }
    } catch (e: any) {
      alert('오류 발생: ' + e.message);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Backup download
  const handleExportJson = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gwangseok_church_data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Backup restore
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.info && parsed.worshipSchedule) {
          setData(parsed);
          alert('데이터 파일을 불러왔습니다. [저장하기] 버튼을 누르면 서버에 적용됩니다.');
        } else {
          alert('유효하지 않은 교회 데이터 파일 형식입니다.');
        }
      } catch (err) {
        alert('JSON 파싱 오류가 발생했습니다.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="bg-stone-900 text-stone-100 rounded-3xl w-full max-w-6xl max-h-[95vh] flex flex-col border border-stone-800 shadow-2xl overflow-hidden animate-fadeIn">
        {/* Top Control Header */}
        <div className="p-4 sm:p-6 bg-stone-950 border-b border-stone-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <Unlock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-bold font-serif-kr text-white">
                  광석서부교회 관리자 통합 제어센터
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
                  실시간 수정모드
                </span>
              </div>
              <p className="text-xs text-stone-400 font-sans-kr">
                모든 텍스트, 시간표, 설교, QT, 사진, 공지사항을 자유롭게 편집하고 즉시 반영합니다.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              id="admin-save-all-btn"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>저장 중...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>전체 저장하기</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
              title="관리자 닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Alerts */}
        {saveSuccessMsg && (
          <div className="bg-emerald-950/80 border-b border-emerald-800 text-emerald-200 text-xs py-2 px-6 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{saveSuccessMsg}</span>
            </div>
          </div>
        )}
        {saveErrorMsg && (
          <div className="bg-red-950/80 border-b border-red-800 text-red-200 text-xs py-2 px-6 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span>{saveErrorMsg}</span>
          </div>
        )}

        {/* Admin Navigation & Content Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 bg-stone-950/80 border-r border-stone-800 p-2 sm:p-4 overflow-y-auto space-y-1 shrink-0 flex md:flex-col flex-row overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all text-left whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                      : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-stone-950' : 'text-stone-400'}`} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Area */}
          <div className="flex-1 p-4 sm:p-8 overflow-y-auto bg-stone-900/90">
            {/* 1. Basic Info & Motto Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6 max-w-3xl">
                <div className="border-b border-stone-800 pb-3">
                  <h3 className="text-lg font-bold font-serif-kr text-white">
                    교회 기본 정보 및 표어 관리
                  </h3>
                  <p className="text-xs text-stone-400">
                    홈페이지 상단 및 메인 화면에 노출되는 기본 정보를 수정합니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      교회명
                    </label>
                    <input
                      type="text"
                      value={data.info.name}
                      onChange={(e) =>
                        setData({ ...data, info: { ...data.info, name: e.target.value } })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      교단명
                    </label>
                    <input
                      type="text"
                      value={data.info.denomination}
                      onChange={(e) =>
                        setData({
                          ...data,
                          info: { ...data.info, denomination: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-400 mb-1">
                    2026년 교회 표어 (핵심 문구)
                  </label>
                  <input
                    type="text"
                    value={data.info.motto}
                    onChange={(e) =>
                      setData({ ...data, info: { ...data.info, motto: e.target.value } })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-amber-500/50 text-amber-200 text-base font-serif-kr font-bold focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    교회 부표어 및 설명 문구
                  </label>
                  <textarea
                    rows={2}
                    value={data.info.subMotto}
                    onChange={(e) =>
                      setData({ ...data, info: { ...data.info, subMotto: e.target.value } })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      교회 대표 전화번호
                    </label>
                    <input
                      type="text"
                      value={data.info.phone}
                      onChange={(e) =>
                        setData({ ...data, info: { ...data.info, phone: e.target.value } })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      이메일
                    </label>
                    <input
                      type="email"
                      value={data.info.email || ''}
                      onChange={(e) =>
                        setData({ ...data, info: { ...data.info, email: e.target.value } })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    온라인 헌금 계좌 설정
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">은행명</label>
                      <input
                        type="text"
                        value={data.info.offeringAccount.bank}
                        onChange={(e) =>
                          setData({
                            ...data,
                            info: {
                              ...data.info,
                              offeringAccount: {
                                ...data.info.offeringAccount,
                                bank: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">계좌번호</label>
                      <input
                        type="text"
                        value={data.info.offeringAccount.number}
                        onChange={(e) =>
                          setData({
                            ...data,
                            info: {
                              ...data.info,
                              offeringAccount: {
                                ...data.info.offeringAccount,
                                number: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">예금주</label>
                      <input
                        type="text"
                        value={data.info.offeringAccount.holder}
                        onChange={(e) =>
                          setData({
                            ...data,
                            info: {
                              ...data.info,
                              offeringAccount: {
                                ...data.info.offeringAccount,
                                holder: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Worship Schedule Tab */}
            {activeTab === 'worship' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div>
                    <h3 className="text-lg font-bold font-serif-kr text-white">
                      예배 및 기도회 시간표 관리
                    </h3>
                    <p className="text-xs text-stone-400">
                      주일예배, 수요예배, 새벽설교 등의 시간을 추가, 수정, 삭제합니다.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newItem: WorshipScheduleItem = {
                        id: `ws-${Date.now()}`,
                        name: '새 예배시간',
                        time: '주일 14:00',
                        location: '본당',
                        description: '예배 안내 설명입니다.',
                        badge: '정기예배',
                      };
                      setData({
                        ...data,
                        worshipSchedule: [...data.worshipSchedule, newItem],
                      });
                      setEditingWorshipId(newItem.id);
                    }}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>새 예배 추가</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {data.worshipSchedule.map((ws, idx) => (
                    <div
                      key={ws.id || idx}
                      className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400">
                          #{idx + 1} {ws.name}
                        </span>
                        <button
                          onClick={() => {
                            if (confirm(`'${ws.name}'을(를) 삭제하시겠습니까?`)) {
                              setData({
                                ...data,
                                worshipSchedule: data.worshipSchedule.filter(
                                  (item) => item.id !== ws.id
                                ),
                              });
                            }
                          }}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] text-stone-400 mb-1">
                            예배명
                          </label>
                          <input
                            type="text"
                            value={ws.name}
                            onChange={(e) => {
                              const updated = [...data.worshipSchedule];
                              updated[idx].name = e.target.value;
                              setData({ ...data, worshipSchedule: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-amber-400 mb-1">
                            예배 시간 (예: 주일 오전 10:30)
                          </label>
                          <input
                            type="text"
                            value={ws.time}
                            onChange={(e) => {
                              const updated = [...data.worshipSchedule];
                              updated[idx].time = e.target.value;
                              setData({ ...data, worshipSchedule: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-amber-200 text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-stone-400 mb-1">
                            장소 및 배지
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="장소"
                              value={ws.location}
                              onChange={(e) => {
                                const updated = [...data.worshipSchedule];
                                updated[idx].location = e.target.value;
                                setData({ ...data, worshipSchedule: updated });
                              }}
                              className="w-2/3 px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs"
                            />
                            <input
                              type="text"
                              placeholder="배지"
                              value={ws.badge || ''}
                              onChange={(e) => {
                                const updated = [...data.worshipSchedule];
                                updated[idx].badge = e.target.value;
                                setData({ ...data, worshipSchedule: updated });
                              }}
                              className="w-1/3 px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-amber-300 text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-stone-400 mb-1">
                            하절기/동절기 등 계절별 안내 (선택사항)
                          </label>
                          <input
                            type="text"
                            placeholder="예: 하절기 17:30 / 동절기 19:00"
                            value={ws.seasonNote || ''}
                            onChange={(e) => {
                              const updated = [...data.worshipSchedule];
                              updated[idx].seasonNote = e.target.value;
                              setData({ ...data, worshipSchedule: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-300 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-stone-400 mb-1">
                            예배 설명
                          </label>
                          <input
                            type="text"
                            value={ws.description}
                            onChange={(e) => {
                              const updated = [...data.worshipSchedule];
                              updated[idx].description = e.target.value;
                              setData({ ...data, worshipSchedule: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-300 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Daily QT Tab */}
            {activeTab === 'qt' && (
              <div className="space-y-6 max-w-4xl">
                <div className="border-b border-stone-800 pb-3">
                  <h3 className="text-lg font-bold font-serif-kr text-white">
                    오늘의 QT (매일 묵상) & AI 자동 생성기
                  </h3>
                  <p className="text-xs text-stone-400">
                    원하는 날짜의 새로운 QT를 Gemini AI로 자동 생성하거나 직접 편집합니다.
                  </p>
                </div>

                {/* AI Instant Generator Box */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-stone-900 to-stone-950 border border-amber-500/40 space-y-4">
                  <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>AI 말씀 즉시 자동 생성</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-stone-300 mb-1">
                        생성할 날짜
                      </label>
                      <input
                        type="date"
                        value={aiQtDate}
                        onChange={(e) => setAiQtDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-stone-300 mb-1">
                        희망 본문/주제 (비워두면 자동 선별)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="예: 시편 23편 또는 말씀 순종과 영적 부흥"
                          value={aiQtTopic}
                          onChange={(e) => setAiQtTopic(e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs"
                        />
                        <button
                          onClick={handleGenerateAiQt}
                          disabled={isAiGenerating}
                          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isAiGenerating ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>생성 중...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>AI 생성</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stored QT List */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    등록된 날짜별 QT 목록 ({data.dailyQts.length}개)
                  </h4>

                  {data.dailyQts.map((qt, idx) => (
                    <div
                      key={qt.id || idx}
                      className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-xs font-bold">
                            {qt.date}
                          </span>
                          <span className="text-sm font-bold text-white font-serif-kr">
                            {qt.title}
                          </span>
                          <span className="text-xs text-stone-400">
                            ({qt.scriptureReference})
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(`${qt.date} QT를 삭제하시겠습니까?`)) {
                              setData({
                                ...data,
                                dailyQts: data.dailyQts.filter((q) => q.id !== qt.id),
                              });
                            }
                          }}
                          className="p-1.5 text-red-400 hover:text-red-300 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-stone-400 mb-1">
                            제목
                          </label>
                          <input
                            type="text"
                            value={qt.title}
                            onChange={(e) => {
                              const updated = [...data.dailyQts];
                              updated[idx].title = e.target.value;
                              setData({ ...data, dailyQts: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-stone-400 mb-1">
                            성경 본문 구절 표기
                          </label>
                          <input
                            type="text"
                            value={qt.scriptureReference}
                            onChange={(e) => {
                              const updated = [...data.dailyQts];
                              updated[idx].scriptureReference = e.target.value;
                              setData({ ...data, dailyQts: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-amber-200 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1">
                          핵심 요절
                        </label>
                        <input
                          type="text"
                          value={qt.keyVerse}
                          onChange={(e) => {
                            const updated = [...data.dailyQts];
                            updated[idx].keyVerse = e.target.value;
                            setData({ ...data, dailyQts: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-200 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1">
                          묵상 해설
                        </label>
                        <textarea
                          rows={4}
                          value={qt.commentary}
                          onChange={(e) => {
                            const updated = [...data.dailyQts];
                            updated[idx].commentary = e.target.value;
                            setData({ ...data, dailyQts: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-300 text-xs leading-relaxed"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1">
                          마침 기도문
                        </label>
                        <textarea
                          rows={2}
                          value={qt.prayer}
                          onChange={(e) => {
                            const updated = [...data.dailyQts];
                            updated[idx].prayer = e.target.value;
                            setData({ ...data, dailyQts: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-300 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Sermon Archive Tab */}
            {activeTab === 'sermons' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-lg font-bold font-serif-kr text-white">
                      설교 아카이브 관리
                    </h3>
                    <p className="text-xs text-slate-400">
                      주일예배, 수요예배, 새벽설교의 말씀 본문, 설교자, 요약 및 개요를 등록·관리합니다.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newSermon: SermonItem = {
                        id: `sermon-${Date.now()}`,
                        title: '새 설교 말씀',
                        preacher: data.pastor.name + ' 담임목사',
                        date: new Date().toISOString().split('T')[0],
                        category: '주일오전',
                        scripture: '본문 구절 입력',
                        summary: '설교 요약 메시지를 입력하세요.',
                        fullNotes: '1. 말씀의 배경과 은혜\n2. 성도의 온전한 순종과 삶의 실천',
                        views: 0,
                      };
                      setData({ ...data, sermons: [newSermon, ...data.sermons] });
                    }}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>새 설교 등록</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {data.sermons.map((sermon, idx) => (
                    <div
                      key={sermon.id || idx}
                      className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-xs font-bold">
                            {sermon.category}
                          </span>
                          <span className="text-sm font-bold text-white font-serif-kr">
                            {sermon.title}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(`'${sermon.title}'을(를) 삭제하시겠습니까?`)) {
                              setData({
                                ...data,
                                sermons: data.sermons.filter((s) => s.id !== sermon.id),
                              });
                            }
                          }}
                          className="p-1.5 text-red-400 hover:text-red-300 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] text-slate-400 mb-1">
                            설교 제목
                          </label>
                          <input
                            type="text"
                            value={sermon.title}
                            onChange={(e) => {
                              const updated = [...data.sermons];
                              updated[idx].title = e.target.value;
                              setData({ ...data, sermons: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700 text-white text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">
                            예배 구분
                          </label>
                          <select
                            value={sermon.category}
                            onChange={(e) => {
                              const updated = [...data.sermons];
                              updated[idx].category = e.target.value as any;
                              setData({ ...data, sermons: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700 text-white text-xs"
                          >
                            <option value="주일오전">주일오전</option>
                            <option value="주일오후">주일오후</option>
                            <option value="수요예배">수요예배</option>
                            <option value="새벽설교">새벽설교</option>
                            <option value="특별집회">특별집회</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">
                            설교자
                          </label>
                          <input
                            type="text"
                            value={sermon.preacher}
                            onChange={(e) => {
                              const updated = [...data.sermons];
                              updated[idx].preacher = e.target.value;
                              setData({ ...data, sermons: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700 text-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">
                            본문 구절
                          </label>
                          <input
                            type="text"
                            value={sermon.scripture}
                            onChange={(e) => {
                              const updated = [...data.sermons];
                              updated[idx].scripture = e.target.value;
                              setData({ ...data, sermons: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700 text-indigo-200 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">
                            설교 일자
                          </label>
                          <input
                            type="date"
                            value={sermon.date}
                            onChange={(e) => {
                              const updated = [...data.sermons];
                              updated[idx].date = e.target.value;
                              setData({ ...data, sermons: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700 text-white text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">
                            자체 영상/음성 미디어 URL (선택)
                          </label>
                          <input
                            type="text"
                            placeholder="https://... (mp4/mp3 등 자체 영상/음원 링크)"
                            value={sermon.videoUrl || ''}
                            onChange={(e) => {
                              const updated = [...data.sermons];
                              updated[idx].videoUrl = e.target.value;
                              setData({ ...data, sermons: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700 text-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">
                            대표 썸네일 이미지 URL (선택)
                          </label>
                          <input
                            type="text"
                            placeholder="https://images.unsplash.com/..."
                            value={sermon.thumbnailUrl || ''}
                            onChange={(e) => {
                              const updated = [...data.sermons];
                              updated[idx].thumbnailUrl = e.target.value;
                              setData({ ...data, sermons: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700 text-white text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">
                          설교 핵심 요약 메시지
                        </label>
                        <textarea
                          rows={2}
                          value={sermon.summary}
                          onChange={(e) => {
                            const updated = [...data.sermons];
                            updated[idx].summary = e.target.value;
                            setData({ ...data, sermons: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700 text-slate-300 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">
                          설교 개요 및 본문 해설 (상세)
                        </label>
                        <textarea
                          rows={3}
                          placeholder="대지별 설교 개요 및 해설을 입력하세요..."
                          value={sermon.fullNotes || ''}
                          onChange={(e) => {
                            const updated = [...data.sermons];
                            updated[idx].fullNotes = e.target.value;
                            setData({ ...data, sermons: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700 text-slate-300 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Photo Gallery Tab */}
            {activeTab === 'photos' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div>
                    <h3 className="text-lg font-bold font-serif-kr text-white">
                      교회사진 & 포토 갤러리 관리
                    </h3>
                    <p className="text-xs text-stone-400">
                      교회 전경, 예배, 행사, 교제 사진을 등록하고 삭제합니다.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newPhoto: PhotoItem = {
                        id: `p-${Date.now()}`,
                        title: '새 교회사진',
                        date: new Date().toISOString().split('T')[0],
                        category: '교회풍경',
                        imageUrl:
                          'https://images.unsplash.com/photo-1548625361-1959828d5ecb?auto=format&fit=crop&w=1200&q=80',
                        description: '사진에 대한 설명을 입력하세요.',
                      };
                      setData({ ...data, photos: [newPhoto, ...data.photos] });
                    }}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>새 사진 추가</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.photos.map((photo, idx) => (
                    <div
                      key={photo.id || idx}
                      className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3"
                    >
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => {
                            if (confirm(`'${photo.title}' 사진을 삭제하시겠습니까?`)) {
                              setData({
                                ...data,
                                photos: data.photos.filter((p) => p.id !== photo.id),
                              });
                            }
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors cursor-pointer shadow-md"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-stone-400 mb-1">
                            사진 제목
                          </label>
                          <input
                            type="text"
                            value={photo.title}
                            onChange={(e) => {
                              const updated = [...data.photos];
                              updated[idx].title = e.target.value;
                              setData({ ...data, photos: updated });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-white text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-stone-400 mb-1">
                            분류
                          </label>
                          <select
                            value={photo.category}
                            onChange={(e) => {
                              const updated = [...data.photos];
                              updated[idx].category = e.target.value as any;
                              setData({ ...data, photos: updated });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-white text-xs"
                          >
                            <option value="교회풍경">교회풍경</option>
                            <option value="예배/집회">예배/집회</option>
                            <option value="성도의교제">성도의교제</option>
                            <option value="교회행사">교회행사</option>
                            <option value="주일학교">주일학교</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-stone-400 mb-1">
                          이미지 URL
                        </label>
                        <input
                          type="text"
                          value={photo.imageUrl}
                          onChange={(e) => {
                            const updated = [...data.photos];
                            updated[idx].imageUrl = e.target.value;
                            setData({ ...data, photos: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-stone-300 text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-stone-400 mb-1">
                          사진 설명
                        </label>
                        <input
                          type="text"
                          value={photo.description}
                          onChange={(e) => {
                            const updated = [...data.photos];
                            updated[idx].description = e.target.value;
                            setData({ ...data, photos: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-stone-300 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Board & Bulletin Tab */}
            {activeTab === 'board' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div>
                    <h3 className="text-lg font-bold font-serif-kr text-white">
                      게시판 & 주보 관리
                    </h3>
                    <p className="text-xs text-stone-400">
                      공지사항, 교회주보, 교우소식 글을 등록하거나 수정/삭제합니다.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newPost: BoardPost = {
                        id: `post-${Date.now()}`,
                        title: '새 공지사항',
                        category: '공지사항',
                        content: '공지 내용을 입력하세요.',
                        author: '관리자',
                        date: new Date().toISOString().split('T')[0],
                        isPinned: false,
                        views: 0,
                        likes: 0,
                        comments: [],
                      };
                      setData({ ...data, boardPosts: [newPost, ...data.boardPosts] });
                    }}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>새 공지 등록</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {data.boardPosts.map((post, idx) => (
                    <div
                      key={post.id || idx}
                      className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded-md bg-stone-800 text-amber-300 text-xs font-bold">
                            {post.category}
                          </span>
                          {post.isPinned && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-stone-950 text-xs font-bold">
                              필독 고정
                            </span>
                          )}
                          <span className="text-sm font-bold text-white">
                            {post.title}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(`'${post.title}'을(를) 삭제하시겠습니까?`)) {
                              setData({
                                ...data,
                                boardPosts: data.boardPosts.filter((p) => p.id !== post.id),
                              });
                            }
                          }}
                          className="p-1.5 text-red-400 hover:text-red-300 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] text-stone-400 mb-1">
                            제목
                          </label>
                          <input
                            type="text"
                            value={post.title}
                            onChange={(e) => {
                              const updated = [...data.boardPosts];
                              updated[idx].title = e.target.value;
                              setData({ ...data, boardPosts: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-stone-400 mb-1">
                            분류
                          </label>
                          <select
                            value={post.category}
                            onChange={(e) => {
                              const updated = [...data.boardPosts];
                              updated[idx].category = e.target.value as any;
                              setData({ ...data, boardPosts: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs"
                          >
                            <option value="공지사항">공지사항</option>
                            <option value="교회주보">교회주보</option>
                            <option value="교우소식">교우소식</option>
                            <option value="기도나눔">기도나눔</option>
                            <option value="자유게시판">자유게시판</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1">
                          본문 내용
                        </label>
                        <textarea
                          rows={5}
                          value={post.content}
                          onChange={(e) => {
                            const updated = [...data.boardPosts];
                            updated[idx].content = e.target.value;
                            setData({ ...data, boardPosts: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-300 text-xs leading-relaxed"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <label className="flex items-center space-x-2 text-xs text-amber-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={post.isPinned || false}
                            onChange={(e) => {
                              const updated = [...data.boardPosts];
                              updated[idx].isPinned = e.target.checked;
                              setData({ ...data, boardPosts: updated });
                            }}
                            className="w-4 h-4 text-amber-500 rounded-sm"
                          />
                          <span>상단 필독 공지로 고정</span>
                        </label>

                        <div className="flex items-center space-x-3 text-xs text-stone-400">
                          <span>작성자: {post.author}</span>
                          <span>작성일: {post.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. Pastor Introduction Tab */}
            {activeTab === 'pastor' && (
              <div className="space-y-6 max-w-3xl">
                <div className="border-b border-stone-800 pb-3">
                  <h3 className="text-lg font-bold font-serif-kr text-white">
                    목회자 소개 & 인사말 관리
                  </h3>
                  <p className="text-xs text-stone-400">
                    담임목사 학력(총신 102회 등), 노회 소속, 목회 비전, 인사말을 수정합니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      담임목사 성함
                    </label>
                    <input
                      type="text"
                      value={data.pastor.name}
                      onChange={(e) =>
                        setData({
                          ...data,
                          pastor: { ...data.pastor, name: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      직함
                    </label>
                    <input
                      type="text"
                      value={data.pastor.title}
                      onChange={(e) =>
                        setData({
                          ...data,
                          pastor: { ...data.pastor, title: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-400 mb-1">
                    소속 노회 및 시찰
                  </label>
                  <input
                    type="text"
                    value={data.pastor.presbytery}
                    onChange={(e) =>
                      setData({
                        ...data,
                        pastor: { ...data.pastor, presbytery: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-amber-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    목회 철학 및 비전 문구
                  </label>
                  <input
                    type="text"
                    value={data.pastor.ministryVision}
                    onChange={(e) =>
                      setData({
                        ...data,
                        pastor: { ...data.pastor, ministryVision: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm font-serif-kr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    목회자 인사말 전문
                  </label>
                  <textarea
                    rows={8}
                    value={data.pastor.greeting}
                    onChange={(e) =>
                      setData({
                        ...data,
                        pastor: { ...data.pastor, greeting: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-200 text-xs sm:text-sm leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    프로필 사진 이미지 URL
                  </label>
                  <input
                    type="text"
                    value={data.pastor.profileImageUrl}
                    onChange={(e) =>
                      setData({
                        ...data,
                        pastor: { ...data.pastor, profileImageUrl: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-300 text-xs font-mono"
                  />
                </div>
              </div>
            )}

            {/* 8. Church Identity Tab */}
            {activeTab === 'identity' && (
              <div className="space-y-6 max-w-3xl">
                <div className="border-b border-stone-800 pb-3">
                  <h3 className="text-lg font-bold font-serif-kr text-white">
                    교회 정체성 & 개혁주의 신앙고백 관리
                  </h3>
                  <p className="text-xs text-stone-400">
                    칼빈주의 신학, 성경 무오성, 창세전 선택, 십자가 대속 구원 등의 신앙고백을 관리합니다.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    교단 소속 표기
                  </label>
                  <input
                    type="text"
                    value={data.identity.denominationTitle}
                    onChange={(e) =>
                      setData({
                        ...data,
                        identity: {
                          ...data.identity,
                          denominationTitle: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-400 mb-1">
                    신학 기초
                  </label>
                  <input
                    type="text"
                    value={data.identity.theologyBase}
                    onChange={(e) =>
                      setData({
                        ...data,
                        identity: { ...data.identity, theologyBase: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-amber-200 text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    핵심 신앙고백 전문
                  </label>
                  <textarea
                    rows={6}
                    value={data.identity.coreConfession}
                    onChange={(e) =>
                      setData({
                        ...data,
                        identity: {
                          ...data.identity,
                          coreConfession: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-200 text-xs sm:text-sm leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* 9. Location & Map Tab */}
            {activeTab === 'location' && (
              <div className="space-y-6 max-w-3xl">
                <div className="border-b border-stone-800 pb-3">
                  <h3 className="text-lg font-bold font-serif-kr text-white">
                    주소 및 지도 설정
                  </h3>
                  <p className="text-xs text-stone-400">
                    충남 논산시 광석면 오강2길 18 주소 및 구글/네이버/카카오 지도 연동 링크를 관리합니다.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-400 mb-1">
                    도로명 주소
                  </label>
                  <input
                    type="text"
                    value={data.info.addressRoad}
                    onChange={(e) =>
                      setData({
                        ...data,
                        info: { ...data.info, addressRoad: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    지번 주소 (구 주소)
                  </label>
                  <input
                    type="text"
                    value={data.info.addressJibun}
                    onChange={(e) =>
                      setData({
                        ...data,
                        info: { ...data.info, addressJibun: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    네이버 지도 링크 URL
                  </label>
                  <input
                    type="text"
                    value={data.info.naverMapUrl}
                    onChange={(e) =>
                      setData({
                        ...data,
                        info: { ...data.info, naverMapUrl: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-300 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    카카오맵 링크 URL
                  </label>
                  <input
                    type="text"
                    value={data.info.kakaoMapUrl}
                    onChange={(e) =>
                      setData({
                        ...data,
                        info: { ...data.info, kakaoMapUrl: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-300 text-xs font-mono"
                  />
                </div>
              </div>
            )}

            {/* 10. Backup & Restore Tab */}
            {activeTab === 'backup' && (
              <div className="space-y-6 max-w-3xl">
                <div className="border-b border-stone-800 pb-3">
                  <h3 className="text-lg font-bold font-serif-kr text-white">
                    데이터 백업, 복원 및 초기화
                  </h3>
                  <p className="text-xs text-stone-400">
                    전체 교회 데이터를 안전하게 백업하거나 초기 상태로 복구합니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                    <h4 className="text-sm font-bold text-amber-400 flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>데이터 백업 (JSON 다운로드)</span>
                    </h4>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      현재 홈페이지의 모든 예배시간, 설교, QT, 게시판, 사진 등의 데이터를 컴퓨터에 파일로 저장합니다.
                    </p>
                    <button
                      onClick={handleExportJson}
                      className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>백업 파일 다운로드</span>
                    </button>
                  </div>

                  <div className="p-6 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                    <h4 className="text-sm font-bold text-amber-400 flex items-center space-x-2">
                      <Upload className="w-4 h-4" />
                      <span>데이터 복원 (JSON 파일 업로드)</span>
                    </h4>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      기존에 백업해 둔 JSON 파일을 업로드하여 홈페이지 내용을 복원합니다.
                    </p>
                    <label className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>백업 파일 선택</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportJson}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Reset to Factory Default */}
                <div className="p-6 rounded-2xl bg-red-950/30 border border-red-900/50 space-y-3">
                  <h4 className="text-sm font-bold text-red-400 flex items-center space-x-2">
                    <RotateCcw className="w-4 h-4" />
                    <span>초기 기본값으로 복원</span>
                  </h4>
                  <p className="text-xs text-red-300/80 leading-relaxed">
                    모든 데이터를 광석서부교회 기본 안내 데이터(박성영 담임목사, 주일 10:30/12:00, 수요 17:30/19:00, 새벽 04:20 등)로 복원합니다.
                  </p>
                  <button
                    onClick={async () => {
                      if (
                        confirm(
                          '정말로 초기 기본값으로 되돌리시겠습니까? 현재 작성된 임의의 데이터가 초기화됩니다.'
                        )
                      ) {
                        await onResetData();
                        onClose();
                      }
                    }}
                    className="py-2.5 px-4 rounded-xl bg-red-900/60 hover:bg-red-800 text-red-100 text-xs font-bold border border-red-700/60 transition-colors cursor-pointer"
                  >
                    기본값으로 초기화 실행
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Save Bar */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            광석서부교회 관리자 시스템 • 모든 변경 후 [전체 저장하기]를 눌러주세요.
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-400 hover:text-white text-xs font-medium cursor-pointer"
            >
              닫기
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>전체 저장하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

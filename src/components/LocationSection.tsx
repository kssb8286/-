import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Car,
  Bus,
  Phone,
  Copy,
  Check,
  ExternalLink,
  Edit3,
  Shield,
} from 'lucide-react';
import { ChurchData } from '../types';

interface LocationSectionProps {
  churchData: ChurchData;
  isAdmin: boolean;
  onOpenAdminToTab?: (tabName: string) => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  churchData,
  isAdmin,
  onOpenAdminToTab,
}) => {
  const [copiedRoad, setCopiedRoad] = useState(false);
  const [copiedJibun, setCopiedJibun] = useState(false);

  const handleCopy = (text: string, type: 'road' | 'jibun') => {
    navigator.clipboard.writeText(text);
    if (type === 'road') {
      setCopiedRoad(true);
      setTimeout(() => setCopiedRoad(false), 2000);
    } else {
      setCopiedJibun(true);
      setTimeout(() => setCopiedJibun(false), 2000);
    }
  };

  return (
    <section id="location" className="py-16 sm:py-24 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold uppercase tracking-wider mb-2">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              <span>Location & Directions</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif-kr text-slate-900 tracking-tight">
              오시는 길 & 위치 안내
            </h2>
            <p className="mt-1 text-slate-600 text-xs sm:text-sm font-sans-kr max-w-2xl">
              광석서부교회는 충남 논산시 광석면에 위치하고 있습니다. 주님의 전으로 오시는 발걸음을 진심으로 환영합니다.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => onOpenAdminToTab?.('location')}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs transition-colors self-start md:self-auto cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>주소·지도 정보 수정</span>
            </button>
          )}
        </div>

        {/* Top Info Cards with Copy Action */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Road Address Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                  도로명 주소
                </span>
                <p className="text-base sm:text-lg font-bold text-slate-900 font-sans-kr">
                  {churchData.info.addressRoad}
                </p>
              </div>
              <button
                onClick={() => handleCopy(churchData.info.addressRoad, 'road')}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 transition-colors shrink-0 cursor-pointer shadow-2xs"
              >
                {copiedRoad ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">복사됨!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>주소 복사</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Jibun Address Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                  지번 주소 (구 주소)
                </span>
                <p className="text-base sm:text-lg font-bold text-slate-900 font-sans-kr">
                  {churchData.info.addressJibun}
                </p>
              </div>
              <button
                onClick={() => handleCopy(churchData.info.addressJibun, 'jibun')}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 transition-colors shrink-0 cursor-pointer shadow-2xs"
              >
                {copiedJibun ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">복사됨!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>지번 복사</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Map Stage & Navigation Buttons */}
        <div className="rounded-3xl border border-slate-200 overflow-hidden shadow-md mb-12 bg-white">
          {/* Map Frame Container */}
          <div className="relative w-full h-[380px] sm:h-[450px] bg-slate-100">
            <iframe
              title="광석서부교회 구글 지도"
              src={
                churchData.info.googleMapEmbedUrl ||
                'https://maps.google.com/maps?q=36.2415,127.0678&hl=ko&z=16&output=embed'
              }
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Overlay Church Badge */}
            <div className="absolute top-4 left-4 p-3 rounded-2xl bg-white/95 backdrop-blur-xs border border-slate-200 shadow-lg flex items-center space-x-3 pointer-events-none">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-sm font-bold font-serif-kr text-slate-900 block">
                  {churchData.info.name}
                </strong>
                <span className="text-[11px] text-slate-500">
                  충남 논산시 광석면 오강2길 18
                </span>
              </div>
            </div>
          </div>

          {/* Quick Map App Direct Links Bar */}
          <div className="p-4 sm:p-5 bg-slate-950 text-white flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-xs text-indigo-300">
              <Navigation className="w-4 h-4 text-indigo-400" />
              <span>내비게이션 및 길찾기 앱 바로가기:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={churchData.info.naverMapUrl || 'https://map.naver.com'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#03C75A] hover:bg-[#02b350] text-white text-xs font-bold shadow-xs transition-colors"
              >
                <span>네이버 지도 길찾기</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={churchData.info.kakaoMapUrl || 'https://map.kakao.com'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#FEE500] hover:bg-[#ebd300] text-slate-900 text-xs font-bold shadow-xs transition-colors"
              >
                <span>카카오맵 길찾기</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`tel:${churchData.info.phone}`}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                <span>교회 전화걸기</span>
              </a>
            </div>
          </div>
        </div>

        {/* Transportation & Parking Detailed Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Car */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                <Car className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 font-serif-kr mb-2">
                자가용 이용 시
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 font-sans-kr leading-relaxed">
                <li>
                  • <strong>고속도로:</strong> 천안-논산 고속도로 서논산 IC에서 나와 광석면 방면으로 약 7분
                </li>
                <li>
                  • <strong>국도:</strong> 공주-논산 간 국도 23호선 광석교차로에서 오강리 방면 진입
                </li>
                <li>
                  • 내비게이션 검색: <strong>'광석서부교회'</strong> 또는 주소 검색
                </li>
              </ul>
            </div>
          </div>

          {/* 2. Public Transit */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                <Bus className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 font-serif-kr mb-2">
                대중교통 (버스·기차)
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 font-sans-kr leading-relaxed">
                <li>
                  • <strong>논산역 (KTX/일반열차):</strong> 논산역 광장에서 시내버스 탑승 또는 택시 이용 (약 12분 소요)
                </li>
                <li>
                  • <strong>논산 시외·고속버스터미널:</strong> 광석면 방면 시내버스 탑승 후 오강리 정류장 하차
                </li>
              </ul>
            </div>
          </div>

          {/* 3. Parking */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 font-serif-kr mb-2">
                주차 및 편의 시설
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 font-sans-kr leading-relaxed">
                <li>
                  • <strong>교회 전용 주차장:</strong> 교회 마당 및 부속 주차장에 편안하게 무료 주차 가능합니다.
                </li>
                <li>
                  • <strong>안내:</strong> 주일 예배 시간 주차 안내 위원의 안내를 받으실 수 있습니다.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Edit3,
  Trash2,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { ChurchData, PhotoItem } from '../types';

interface PhotoGallerySectionProps {
  churchData: ChurchData;
  isAdmin: boolean;
  onOpenAdminToTab?: (tabName: string) => void;
}

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({
  churchData,
  isAdmin,
  onOpenAdminToTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const categories = ['전체', '교회풍경', '예배/집회', '성도의교제', '교회행사', '주일학교'];

  const filteredPhotos = churchData.photos.filter((photo) => {
    return selectedCategory === '전체' || photo.category === selectedCategory;
  });

  const activePhoto =
    activePhotoIndex !== null ? filteredPhotos[activePhotoIndex] : null;

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex(
        activePhotoIndex === 0 ? filteredPhotos.length - 1 : activePhotoIndex - 1
      );
    }
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex(
        activePhotoIndex === filteredPhotos.length - 1 ? 0 : activePhotoIndex + 1
      );
    }
  };

  return (
    <section id="photos" className="py-16 sm:py-24 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold uppercase tracking-wider mb-2">
              <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
              <span>Church Photo Gallery</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif-kr text-slate-900 tracking-tight">
              교회사진 & 포토 갤러리
            </h2>
            <p className="mt-1 text-slate-600 text-xs sm:text-sm font-sans-kr max-w-2xl">
              광석서부교회 성도들의 은혜로운 예배 모습과 따뜻한 사랑의 교제, 교회 전경을 담은 갤러리입니다.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => onOpenAdminToTab?.('photos')}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs transition-colors self-start md:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>사진 등록·관리</span>
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl mb-8 w-fit border border-slate-200">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setActivePhotoIndex(null);
              }}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-indigo-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Photos Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200 p-8">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 text-sm font-medium">
              해당 카테고리에 등록된 사진이 없습니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo, idx) => (
              <div
                key={photo.id || idx}
                onClick={() => setActivePhotoIndex(idx)}
                className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 aspect-4/3 shadow-2xs hover:shadow-lg transition-all cursor-pointer"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                {/* Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-900/80 text-indigo-300 text-[11px] font-medium backdrop-blur-xs border border-slate-700">
                    {photo.category}
                  </span>
                </div>

                {/* Hover Eye Icon */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-xs flex items-center justify-center text-white">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                  <div className="flex items-center space-x-1.5 text-[11px] text-slate-300 mb-1">
                    <Calendar className="w-3 h-3" />
                    <span>{photo.date}</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold font-serif-kr text-white leading-snug line-clamp-1 group-hover:text-indigo-300 transition-colors">
                    {photo.title}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-1 mt-1 font-sans-kr opacity-90">
                    {photo.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {activePhoto && activePhotoIndex !== null && (
          <div
            onClick={() => setActivePhotoIndex(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col max-h-[90vh]"
            >
              {/* Modal Top Bar */}
              <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-600 text-white text-xs font-bold">
                    {activePhoto.category}
                  </span>
                  <span className="text-xs text-slate-300">{activePhoto.date}</span>
                </div>
                <button
                  onClick={() => setActivePhotoIndex(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Image Stage */}
              <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] max-h-[65vh]">
                <img
                  src={activePhoto.imageUrl}
                  alt={activePhoto.title}
                  className="max-h-full max-w-full object-contain"
                />

                {/* Left/Right Nav Buttons */}
                {filteredPhotos.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevPhoto}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNextPhoto}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Photo Description Footer */}
              <div className="p-4 sm:p-6 bg-slate-900 text-white border-t border-slate-800">
                <h3 className="text-base sm:text-lg font-bold font-serif-kr text-indigo-200">
                  {activePhoto.title}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-300 font-sans-kr leading-relaxed">
                  {activePhoto.description}
                </p>
                <div className="mt-2 text-[11px] text-slate-500">
                  사진 {activePhotoIndex + 1} / {filteredPhotos.length}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import {
  MessageSquare,
  Pin,
  Calendar,
  User,
  Eye,
  Heart,
  Search,
  Plus,
  Edit3,
  Trash2,
  Share2,
  X,
  Send,
  FileText,
} from 'lucide-react';
import { ChurchData, BoardPost } from '../types';

interface BoardSectionProps {
  churchData: ChurchData;
  isAdmin: boolean;
  onAddPost: (post: BoardPost) => void;
  onUpdatePost: (post: BoardPost) => void;
  onDeletePost: (postId: string) => void;
  onOpenAdminToTab?: (tabName: string) => void;
}

export const BoardSection: React.FC<BoardSectionProps> = ({
  churchData,
  isAdmin,
  onAddPost,
  onUpdatePost,
  onDeletePost,
  onOpenAdminToTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePost, setActivePost] = useState<BoardPost | null>(null);
  const [showWriteModal, setShowWriteModal] = useState(false);

  // New post form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'공지사항' | '교우소식' | '교회주보' | '기도나눔' | '자유게시판'>('교우소식');
  const [newContent, setNewContent] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newIsPinned, setNewIsPinned] = useState(false);

  // Comment input state
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');

  const categories = ['전체', '공지사항', '교회주보', '교우소식', '기도나눔', '자유게시판'];

  const filteredPosts = churchData.boardPosts
    .filter((post) => {
      const matchesCat =
        selectedCategory === '전체' || post.category === selectedCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    const post: BoardPost = {
      id: `post-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      content: newContent.trim(),
      author: newAuthor.trim() || (isAdmin ? '관리자' : '성도'),
      date: new Date().toISOString().split('T')[0],
      isPinned: isAdmin ? newIsPinned : false,
      views: 1,
      likes: 0,
      comments: [],
    };

    onAddPost(post);
    setShowWriteModal(false);
    setNewTitle('');
    setNewContent('');
    setNewAuthor('');
    setNewIsPinned(false);
    setActivePost(post);
  };

  const handleLikePost = (post: BoardPost) => {
    const updated: BoardPost = {
      ...post,
      likes: (post.likes || 0) + 1,
    };
    onUpdatePost(updated);
    setActivePost(updated);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePost || !commentContent.trim()) return;

    const newComment = {
      id: `c-${Date.now()}`,
      author: commentAuthor.trim() || (isAdmin ? '교역자' : '성도'),
      content: commentContent.trim(),
      date: new Date().toLocaleString('ko-KR', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const updated: BoardPost = {
      ...activePost,
      comments: [...(activePost.comments || []), newComment],
    };

    onUpdatePost(updated);
    setActivePost(updated);
    setCommentContent('');
  };

  return (
    <section id="board" className="py-16 sm:py-24 bg-slate-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold uppercase tracking-wider mb-2">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
              <span>Church Bulletin & Community Board</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif-kr text-slate-900 tracking-tight">
              교회소식 & 나눔 게시판
            </h2>
            <p className="mt-1 text-slate-600 text-xs sm:text-sm font-sans-kr max-w-2xl">
              광석서부교회 공지사항, 주보, 성도간의 따뜻한 소식과 기도제목을 나누는 열린 공간입니다.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowWriteModal(true)}
              id="write-board-post-btn"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>글쓰기</span>
            </button>
            {isAdmin && (
              <button
                onClick={() => onOpenAdminToTab?.('board')}
                className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium text-xs transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>게시판 관리</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-indigo-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="제목, 내용, 작성자 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Board Posts Table/List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-16 p-8">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 text-sm font-medium">
                  등록된 게시글이 없습니다.
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => {
                    setActivePost(post);
                    // Increment view count
                    onUpdatePost({ ...post, views: (post.views || 0) + 1 });
                  }}
                  className={`p-4 sm:p-5 hover:bg-indigo-50/40 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    post.isPinned ? 'bg-indigo-50/20' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Category Badge & Pin */}
                    <div className="flex items-center space-x-1.5 shrink-0 mt-0.5 sm:mt-0">
                      {post.isPinned ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[11px] font-bold">
                          <Pin className="w-3 h-3 fill-white" />
                          <span>필독</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                          {post.category}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors font-sans-kr line-clamp-1">
                        {post.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-sans-kr sm:hidden">
                        {post.content}
                      </p>
                    </div>
                  </div>

                  {/* Meta (Author, Date, Views, Comments) */}
                  <div className="flex items-center space-x-4 text-xs text-slate-400 shrink-0 self-end sm:self-center">
                    <span className="text-slate-600 font-medium">{post.author}</span>
                    <span>{post.date}</span>
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{post.views || 0}</span>
                    </span>
                    {(post.likes || 0) > 0 && (
                      <span className="flex items-center space-x-1 text-indigo-600 font-semibold">
                        <Heart className="w-3.5 h-3.5 fill-indigo-600" />
                        <span>{post.likes}</span>
                      </span>
                    )}
                    {(post.comments?.length || 0) > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px]">
                        댓글 {post.comments?.length}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Post Detail Modal */}
        {activePost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8 animate-fadeIn max-h-[90vh] flex flex-col">
              {/* Modal Top */}
              <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-600 text-white text-xs font-bold">
                    {activePost.category}
                  </span>
                  {activePost.isPinned && (
                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-xs border border-indigo-500/30">
                      상단고정
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setActivePost(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif-kr text-slate-900 leading-snug">
                    {activePost.title}
                  </h3>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500 pb-4 border-b border-slate-100">
                    <span className="font-semibold text-slate-800">
                      작성자: {activePost.author}
                    </span>
                    <span>작성일: {activePost.date}</span>
                    <span>조회수: {activePost.views}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-slate-800 font-sans-kr whitespace-pre-line bg-slate-50/60 p-5 rounded-2xl border border-slate-100">
                  {activePost.content}
                </div>

                {/* Amen / Like Button */}
                <div className="flex items-center justify-center pt-2">
                  <button
                    onClick={() => handleLikePost(activePost)}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-semibold text-sm transition-transform active:scale-95 cursor-pointer"
                  >
                    <Heart className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                    <span>은혜의 아멘 ({activePost.likes || 0})</span>
                  </button>
                </div>

                {/* Comments Section */}
                <div className="pt-6 border-t border-slate-200">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
                    댓글 및 나눔 ({activePost.comments?.length || 0})
                  </h4>

                  {/* Comment List */}
                  <div className="space-y-3 mb-6">
                    {activePost.comments && activePost.comments.length > 0 ? (
                      activePost.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm"
                        >
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                            <strong className="text-slate-900">{comment.author}</strong>
                            <span>{comment.date}</span>
                          </div>
                          <p className="text-slate-700">{comment.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-4">
                        첫 번째 따뜻한 격려와 아멘의 댓글을 남겨주세요.
                      </p>
                    )}
                  </div>

                  {/* Write Comment Form */}
                  <form onSubmit={handleAddComment} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="작성자 이름"
                        value={commentAuthor}
                        onChange={(e) => setCommentAuthor(e.target.value)}
                        className="w-32 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="은혜로운 나눔이나 아멘을 남겨주세요..."
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>등록</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                {isAdmin && (
                  <button
                    onClick={() => {
                      if (confirm('이 게시글을 삭제하시겠습니까?')) {
                        onDeletePost(activePost.id);
                        setActivePost(null);
                      }
                    }}
                    className="inline-flex items-center space-x-1 text-xs text-red-600 hover:underline cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>게시글 삭제</span>
                  </button>
                )}
                <button
                  onClick={() => setActivePost(null)}
                  className="ml-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Write Post Modal */}
        {showWriteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 animate-fadeIn">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold font-serif-kr text-slate-900">
                    게시글 작성
                  </h3>
                </div>
                <button
                  onClick={() => setShowWriteModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      분류 선택
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
                    >
                      <option value="공지사항">공지사항</option>
                      <option value="교회주보">교회주보</option>
                      <option value="교우소식">교우소식</option>
                      <option value="기도나눔">기도나눔</option>
                      <option value="자유게시판">자유게시판</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      작성자
                    </label>
                    <input
                      type="text"
                      placeholder="이름 또는 직분 (예: 김집사)"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    제목
                  </label>
                  <input
                    type="text"
                    placeholder="제목을 입력하세요"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    내용
                  </label>
                  <textarea
                    rows={6}
                    placeholder="내용을 입력하세요..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                {isAdmin && (
                  <div className="flex items-center space-x-2 p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                    <input
                      type="checkbox"
                      id="pin-post"
                      checked={newIsPinned}
                      onChange={(e) => setNewIsPinned(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded-sm"
                    />
                    <label htmlFor="pin-post" className="text-xs font-semibold text-indigo-900 cursor-pointer">
                      상단 고정 공지로 등록 (필독 공지)
                    </label>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowWriteModal(false)}
                    className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md transition-colors cursor-pointer"
                  >
                    게시글 등록
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

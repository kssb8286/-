export interface WorshipScheduleItem {
  id: string;
  name: string;
  time: string;
  location: string;
  description: string;
  seasonNote?: string;
  badge?: string;
}

export interface ChurchInfo {
  name: string;
  denomination: string;
  motto: string;
  subMotto: string;
  addressRoad: string;
  addressJibun: string;
  phone: string;
  pastorPhone?: string;
  email?: string;
  offeringAccount: {
    bank: string;
    number: string;
    holder: string;
  };
  googleMapEmbedUrl: string;
  naverMapUrl: string;
  kakaoMapUrl: string;
}

export interface PastorInfo {
  name: string;
  title: string;
  education: string[];
  presbytery: string;
  ministryVision: string;
  greeting: string;
  profileImageUrl: string;
  contact?: string;
}

export interface ChurchIdentity {
  denominationTitle: string;
  theologyBase: string;
  coreConfession: string;
  fiveSolas: {
    title: string;
    latin: string;
    description: string;
  }[];
  detailedDoctrine: {
    title: string;
    content: string;
  }[];
}

export interface DailyQT {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  scriptureReference: string;
  scriptureVerses: {
    verseNumber: number;
    text: string;
  }[];
  keyVerse: string;
  commentary: string;
  meditationQuestions: string[];
  prayer: string;
  hymnRecommendation?: string;
  isAiGenerated?: boolean;
  author?: string;
}

export interface SermonItem {
  id: string;
  title: string;
  preacher: string;
  date: string;
  category: '주일오전' | '주일오후' | '수요예배' | '새벽설교' | '특별집회';
  scripture: string;
  videoUrl?: string;
  audioUrl?: string;
  youtubeUrl?: string;
  youtubeId?: string;
  summary: string;
  fullNotes?: string;
  thumbnailUrl?: string;
  views?: number;
}

export interface PhotoItem {
  id: string;
  title: string;
  date: string;
  category: '예배/집회' | '교회행사' | '성도의교제' | '교회풍경' | '주일학교';
  imageUrl: string;
  description: string;
  photographer?: string;
}

export interface BoardPost {
  id: string;
  title: string;
  category: '공지사항' | '교우소식' | '교회주보' | '기도나눔' | '자유게시판';
  content: string;
  author: string;
  date: string;
  isPinned?: boolean;
  views: number;
  likes?: number;
  comments?: {
    id: string;
    author: string;
    content: string;
    date: string;
  }[];
}

export interface ChurchData {
  info: ChurchInfo;
  worshipSchedule: WorshipScheduleItem[];
  pastor: PastorInfo;
  identity: ChurchIdentity;
  dailyQts: DailyQT[];
  sermons: SermonItem[];
  photos: PhotoItem[];
  boardPosts: BoardPost[];
  heroImages: {
    url: string;
    title: string;
    subtitle: string;
  }[];
}

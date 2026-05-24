// ─── News Article Types ─────────────────────────────────────────────────────
export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  source_name: string;
  source_domain: string;
  source_icon?: string;
  image_url?: string;
  link: string;
  pubDate: string;
  category: string[];
  language: string;
  country: string[];
  ai_summary?: string;
}

export interface NewsFeedResponse {
  articles: NewsArticle[];
  nextPage: string | null;
  totalResults: number;
}

// ─── Debate Types ───────────────────────────────────────────────────────────
export interface DebateResponse {
  liberal: string;
  conservative: string;
  neutral: string;
}

// ─── Explain As Types ───────────────────────────────────────────────────────
export type PersonaType = "professor" | "comedian" | "sports_commentator" | "financial_analyst";

export interface ExplainResponse {
  persona: PersonaType;
  explanation: string;
}

// ─── Fake News Detection Types ──────────────────────────────────────────────
export interface FakenessResponse {
  score: number;            // 0-100, 100 = definitely fake
  signals: string[];
  credibility_rating: "high" | "medium" | "low" | "very_low";
  reasoning: string;
}

// ─── Bias Analysis Types ────────────────────────────────────────────────────
export interface SentimentScores {
  anger: number;
  fear: number;
  optimism: number;
  trust: number;
  surprise: number;
  disgust: number;
}

export interface BiasResponse {
  position: number;         // -100 (far left) to +100 (far right)
  label: string;
  sentiment: SentimentScores;
  reasoning: string;
}

// ─── Briefing Types ─────────────────────────────────────────────────────────
export type InterestCategory = 
  | "technology" | "business" | "sports" | "science" 
  | "entertainment" | "politics" | "world";

export interface BriefingStory {
  title: string;
  summary: string;
  source: string;
  category: InterestCategory;
  image_url?: string;
  link: string;
  pubDate: string;
}

export interface BriefingResponse {
  date: string;
  greeting: string;
  stories: BriefingStory[];
  total_sources: number;
}

// ─── Translation Types ──────────────────────────────────────────────────────
export type LanguageCode = "en" | "hi" | "ta" | "bn";

export interface TranslateResponse {
  translated_text: string;
  source_language: string;
  target_language: LanguageCode;
}

// ─── Anchor / Voice Types ───────────────────────────────────────────────────
export interface AnchorMessage {
  role: "anchor" | "user";
  text: string;
  timestamp: number;
}

export interface AnchorSession {
  isLive: boolean;
  currentHeadline: string;
  captions: string;
  messages: AnchorMessage[];
}

// ─── Audio Player / Mini Player Types ───────────────────────────────────────
export interface AudioQueueItem {
  id: string;
  title: string;
  source: string;
  audioUrl?: string;
  text: string;
  category?: string;
  duration?: number;
}

export interface PlayerState {
  isPlaying: boolean;
  currentItem: AudioQueueItem | null;
  queue: AudioQueueItem[];
  speed: number;
  isMuted: boolean;
  progress: number;
}

// ─── User Preferences ──────────────────────────────────────────────────────
export interface UserPreferences {
  interests: InterestCategory[];
  language: LanguageCode;
  voicePersona: string;
  narrativeSpeed: number;
  autoTranslate: boolean;
  biasMitigationVoice: boolean;
  accentNuance: string;
}

// ─── API Error ──────────────────────────────────────────────────────────────
export interface ApiError {
  error: string;
  details?: string;
}

// ─── Loading State ──────────────────────────────────────────────────────────
export interface LoadingState {
  news: boolean;
  debate: boolean;
  explain: boolean;
  fakeness: boolean;
  bias: boolean;
  briefing: boolean;
  translate: boolean;
  anchor: boolean;
  tts: boolean;
}

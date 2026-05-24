const API_URL = import.meta.env.VITE_API_URL || "";

// ─── Generic fetch wrapper with error handling ──────────────────────────
async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `API error: ${res.status}`);
  }

  return res.json();
}

async function apiFetchRaw(
  path: string,
  options?: RequestInit
): Promise<Response> {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `API error: ${res.status}`);
  }

  return res;
}

// ═══════════════════════════════════════════════════════════════════════════
// NEWS API
// ═══════════════════════════════════════════════════════════════════════════
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

export async function fetchNewsFeed(params?: {
  category?: string;
  query?: string;
  page?: string;
  language?: string;
}): Promise<NewsFeedResponse> {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set("category", params.category);
  if (params?.query) searchParams.set("query", params.query);
  if (params?.page) searchParams.set("page", params.page);
  if (params?.language) searchParams.set("language", params.language);

  const qs = searchParams.toString();
  return apiFetch<NewsFeedResponse>(`/api/news${qs ? `?${qs}` : ""}`);
}

export async function searchNews(
  query: string,
  page?: string
): Promise<NewsFeedResponse> {
  const searchParams = new URLSearchParams({ q: query });
  if (page) searchParams.set("page", page);
  return apiFetch<NewsFeedResponse>(`/api/search?${searchParams.toString()}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// DEBATE API
// ═══════════════════════════════════════════════════════════════════════════
export interface DebateResponse {
  liberal: string;
  conservative: string;
  neutral: string;
}

export async function fetchDebate(headline: string, articleText: string): Promise<DebateResponse> {
  return apiFetch<DebateResponse>("/api/debate", {
    method: "POST",
    body: JSON.stringify({ headline, article_text: articleText }),
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPLAIN API
// ═══════════════════════════════════════════════════════════════════════════
export type PersonaType = "professor" | "comedian" | "sports_commentator" | "financial_analyst";

export interface ExplainResponse {
  persona: PersonaType;
  explanation: string;
}

export async function fetchExplanation(
  articleText: string,
  persona: PersonaType
): Promise<ExplainResponse> {
  return apiFetch<ExplainResponse>("/api/explain", {
    method: "POST",
    body: JSON.stringify({ article_text: articleText, persona }),
  });
}

export async function fetchAllExplanations(articleText: string): Promise<ExplainResponse[]> {
  const personas: PersonaType[] = ["professor", "comedian", "sports_commentator", "financial_analyst"];
  return Promise.all(personas.map(p => fetchExplanation(articleText, p)));
}

// ═══════════════════════════════════════════════════════════════════════════
// FAKENESS API
// ═══════════════════════════════════════════════════════════════════════════
export interface FakenessResponse {
  score: number;
  signals: string[];
  credibility_rating: "high" | "medium" | "low" | "very_low";
  reasoning: string;
}

export async function fetchFakeness(
  headline: string,
  articleText: string,
  sourceDomain: string
): Promise<FakenessResponse> {
  return apiFetch<FakenessResponse>("/api/fakeness", {
    method: "POST",
    body: JSON.stringify({ headline, article_text: articleText, source_domain: sourceDomain }),
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// BIAS API
// ═══════════════════════════════════════════════════════════════════════════
export interface BiasResponse {
  position: number;
  label: string;
  sentiment: {
    anger: number;
    fear: number;
    optimism: number;
    trust: number;
    surprise: number;
    disgust: number;
  };
  reasoning: string;
}

export async function fetchBias(
  articleText: string,
  sources: string[]
): Promise<BiasResponse> {
  return apiFetch<BiasResponse>("/api/bias", {
    method: "POST",
    body: JSON.stringify({ article_text: articleText, sources }),
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// BRIEFING API
// ═══════════════════════════════════════════════════════════════════════════
export interface BriefingStory {
  title: string;
  summary: string;
  source: string;
  category: string;
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

export async function fetchBriefing(
  interests: string[],
  language?: string
): Promise<BriefingResponse> {
  const params = new URLSearchParams({
    interests: interests.join(","),
  });
  if (language) params.set("language", language);
  return apiFetch<BriefingResponse>(`/api/briefing?${params.toString()}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// TRANSLATION API
// ═══════════════════════════════════════════════════════════════════════════
export interface TranslateResponse {
  translated_text: string;
  source_language: string;
  target_language: string;
}

export async function translateText(
  text: string,
  targetLanguage: "hi" | "ta" | "bn" | "en"
): Promise<TranslateResponse> {
  return apiFetch<TranslateResponse>("/api/translate", {
    method: "POST",
    body: JSON.stringify({ text, target_language: targetLanguage }),
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// ANCHOR API
// ═══════════════════════════════════════════════════════════════════════════
export interface AnchorBroadcastResponse {
  broadcast: string;
  headlines: string[];
  timestamp: string;
}

export async function fetchAnchorBroadcast(
  language?: string
): Promise<AnchorBroadcastResponse> {
  return apiFetch<AnchorBroadcastResponse>("/api/anchor/broadcast", {
    method: "POST",
    body: JSON.stringify({ language }),
  });
}

export async function fetchAnchorFollowup(
  question: string,
  context?: string
): Promise<{ response: string; timestamp: string }> {
  return apiFetch("/api/anchor/followup", {
    method: "POST",
    body: JSON.stringify({ question, context }),
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// TTS API
// ═══════════════════════════════════════════════════════════════════════════
export async function fetchTTS(
  text: string,
  voice?: string,
  language?: string
): Promise<Blob> {
  const res = await apiFetchRaw("/api/tts", {
    method: "POST",
    body: JSON.stringify({ text, voice, language }),
  });

  return res.blob();
}

export async function fetchAudioSummary(
  articleText: string
): Promise<{ narration: string }> {
  return apiFetch("/api/audio-summary", {
    method: "POST",
    body: JSON.stringify({ article_text: articleText }),
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SHARE CLIP API
// ═══════════════════════════════════════════════════════════════════════════
export async function fetchShareClip(text: string): Promise<{ clip: string }> {
  return apiFetch("/api/share-clip", {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// DEMO DATA API
// ═══════════════════════════════════════════════════════════════════════════
export async function fetchDemoData(): Promise<any> {
  return apiFetch("/api/demo");
}

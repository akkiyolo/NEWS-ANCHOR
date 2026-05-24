import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.NEWSDATA_IO_API_KEY;
const BASE_URL = "https://newsdata.io/api/1/latest";

interface NewsDataArticle {
  article_id: string;
  title: string;
  description: string | null;
  content: string | null;
  source_name: string;
  source_url: string;
  source_icon: string | null;
  image_url: string | null;
  link: string;
  pubDate: string;
  pubDateTZ: string;
  category: string[];
  language: string;
  country: string[];
}

interface NewsDataResponse {
  status: string;
  totalResults: number;
  results: NewsDataArticle[];
  nextPage: string | null;
}

export interface FetchNewsOptions {
  category?: string;
  query?: string;
  language?: string;
  country?: string;
  page?: string;
  size?: number;
}

export async function fetchNews(options: FetchNewsOptions = {}): Promise<NewsDataResponse> {
  const params = new URLSearchParams();
  params.set("apikey", API_KEY || "");
  
  if (options.category) params.set("category", options.category);
  if (options.query) params.set("q", options.query);
  if (options.language) params.set("language", options.language || "en");
  if (options.country) params.set("country", options.country);
  if (options.page) params.set("page", options.page);
  if (options.size) params.set("size", String(options.size));

  const url = `${BASE_URL}?${params.toString()}`;
  
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`NewsData.io API error: ${res.status} — ${err}`);
  }

  return res.json() as Promise<NewsDataResponse>;
}

export function mapToArticle(raw: NewsDataArticle) {
  return {
    id: raw.article_id,
    title: raw.title || "Untitled",
    description: raw.description || "",
    content: raw.content || raw.description || "",
    source_name: raw.source_name || "Unknown",
    source_domain: raw.source_url ? new URL(raw.source_url).hostname : "unknown",
    source_icon: raw.source_icon || undefined,
    image_url: raw.image_url || undefined,
    link: raw.link || "",
    pubDate: raw.pubDate || new Date().toISOString(),
    category: raw.category || ["general"],
    language: raw.language || "en",
    country: raw.country || [],
  };
}

// Category mapping for briefings
export const CATEGORY_MAP: Record<string, string> = {
  technology: "technology",
  business: "business",
  sports: "sports",
  science: "science",
  entertainment: "entertainment",
  politics: "politics",
  world: "world",
};

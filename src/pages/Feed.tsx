import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Globe, Share2, Headphones, TrendingUp, PieChart,
  Loader2, Search, AlertTriangle, Shield, Volume2,
  GraduationCap, Mic2, Trophy, DollarSign, Play, Pause, MessageSquare
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  fetchNewsFeed, searchNews, fetchTTS, fetchShareClip, type NewsArticle
} from "../lib/api";
import { loadPreferences } from "../lib/store";

export function Feed() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  const [playingTts, setPlayingTts] = useState<string | null>(null);
  const [ttsLoading, setTtsLoading] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial load
  useEffect(() => {
    loadNews();
  }, []);

  // Cleanup audio
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const loadNews = async (category?: string) => {
    setLoading(true);
    try {
      const data = await fetchNewsFeed({ category });
      setArticles(data.articles);
      setNextPage(data.nextPage);
    } catch (err: any) {
      console.error("News error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!nextPage || loadingMore) return;
    setLoadingMore(true);
    try {
      const data = await fetchNewsFeed({ page: nextPage });
      setArticles(prev => [...prev, ...data.articles]);
      setNextPage(data.nextPage);
    } catch (err: any) {
      console.error("Load more error:", err.message);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadNews();
      return;
    }
    setIsSearching(true);
    setLoading(true);
    try {
      const data = await searchNews(searchQuery);
      setArticles(data.articles);
      setNextPage(data.nextPage);
    } catch (err: any) {
      console.error("Search error:", err.message);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting && nextPage) loadMore(); },
      { threshold: 0.1 }
    );
    if (scrollRef.current) observer.observe(scrollRef.current);
    return () => observer.disconnect();
  }, [nextPage]);

  // TTS playback
  const handlePlayTts = async (text: string, id: string) => {
    if (playingTts === id && audioRef.current) {
      audioRef.current.pause();
      setPlayingTts(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    setTtsLoading(id);
    try {
      const prefs = loadPreferences();
      const blob = await fetchTTS(text, prefs.voicePersona, prefs.language);
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.playbackRate = prefs.narrativeSpeed;
      audio.onended = () => setPlayingTts(null);
      await audio.play();
      audioRef.current = audio;
      setPlayingTts(id);
    } catch (err: any) {
      console.error("TTS error:", err.message);
    } finally {
      setTtsLoading(null);
    }
  };

  const handleShareClip = async (text: string) => {
    try {
      const result = await fetchShareClip(text);
      await navigator.clipboard.writeText(result.clip);
      alert("Copied to clipboard! 📋");
    } catch (err: any) {
      console.error("Share clip error:", err.message);
    }
  };

  return (
    <div className="px-6 py-8 max-w-[1440px] mx-auto w-full animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border border-primary/20">
              Analysis Hub
            </span>
          </div>
          <h1 className="font-serif text-[36px] md:text-[48px] leading-[1.1] font-semibold text-on-background tracking-tight mb-2">
            News Intelligence Feed
          </h1>
          <p className="text-on-surface-variant font-sans text-lg max-w-2xl">
            Choose an article below and select a specialized AI workstation — Debate, Bias, Fact Check, or Explainer Studio.
          </p>
        </div>

        {/* Search */}
        <div className="w-full max-w-md flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="Search news..."
              className="w-full pl-10 pr-4 py-3.5 bg-surface-container border border-outline-variant rounded-xl text-on-background placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors text-sm"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-5 py-3.5 bg-primary text-on-primary rounded-xl font-label-caps text-xs tracking-wider uppercase font-bold hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-on-surface-variant">Gathering global briefings...</p>
        </div>
      )}

      {/* Articles Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-surface-container/30 rounded-2xl border border-outline-variant/30 overflow-hidden shadow-lg flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(97,139,255,0.1)] group"
            >
              {article.image_url && (
                <div className="relative overflow-hidden h-48 bg-slate-900">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={article.image_url}
                    alt={article.title}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <div className="absolute top-4 left-4 bg-primary/20 backdrop-blur px-3 py-1.5 rounded text-primary text-[9px] font-bold uppercase tracking-wider border border-primary/30 shadow-sm">
                    {article.source_name}
                  </div>
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-label-caps text-[9px] text-on-surface-variant/70 tracking-widest uppercase">
                      {(article.category || []).join(" • ")}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl text-on-background mb-3 leading-snug font-bold">
                    {article.title}
                  </h3>
                  {article.description && (
                    <p className="text-on-surface-variant text-sm line-clamp-3 mb-6">
                      {article.description}
                    </p>
                  )}
                </div>

                {/* AI Workspace actions */}
                <div className="pt-4 border-t border-outline-variant/30 space-y-3">
                  <span className="font-label-caps text-[9px] text-on-surface-variant/50 tracking-wider uppercase block font-bold">
                    AI WORKSPACES
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => navigate("/debate", { state: { article } })}
                      className="py-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all rounded-lg font-label-caps text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Debate
                    </button>
                    <button
                      onClick={() => navigate("/explain", { state: { article } })}
                      className="py-2.5 bg-[#4F46E5]/10 text-primary border border-[#4F46E5]/20 hover:bg-[#4F46E5]/20 transition-all rounded-lg font-label-caps text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                    >
                      <GraduationCap className="w-3.5 h-3.5" /> Explain
                    </button>
                    <button
                      onClick={() => navigate("/bias", { state: { article } })}
                      className="py-2.5 bg-yellow-600/10 text-yellow-500 border border-yellow-600/20 hover:bg-yellow-600/20 transition-all rounded-lg font-label-caps text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                    >
                      <PieChart className="w-3.5 h-3.5" /> Bias Spectrum
                    </button>
                    <button
                      onClick={() => navigate("/fakeness", { state: { article } })}
                      className="py-2.5 bg-red-600/10 text-red-400 border border-red-600/20 hover:bg-red-600/20 transition-all rounded-lg font-label-caps text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                    >
                      <Shield className="w-3.5 h-3.5" /> Fact Check
                    </button>
                  </div>

                  {/* Standard share & play buttons */}
                  <div className="flex justify-between items-center pt-3 border-t border-outline-variant/20">
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleShareClip(article.description || article.title)}
                        className="text-on-surface-variant hover:text-primary transition-colors"
                        title="Copy share card"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePlayTts(article.title + ". " + (article.description || ""), `article-${article.id}`)}
                        className="text-on-surface-variant hover:text-primary transition-colors"
                        title="Listen to story"
                      >
                        {ttsLoading === `article-${article.id}` ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : playingTts === `article-${article.id}` ? (
                          <Pause className="w-4 h-4 animate-pulse" />
                        ) : (
                          <Headphones className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      <div ref={scrollRef} className="h-10 flex items-center justify-center mt-6">
        {loadingMore && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
      </div>
    </div>
  );
}

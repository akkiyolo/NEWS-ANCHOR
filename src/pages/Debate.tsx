import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare, Volume2, Pause, Loader2, Info } from "lucide-react";
import { cn } from "../lib/utils";
import { fetchDebate, fetchTTS } from "../lib/api";
import { loadPreferences } from "../lib/store";

export function Debate() {
  const location = useLocation();
  const navigate = useNavigate();
  const article = location.state?.article;

  const [debate, setDebate] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [ttsLoading, setTtsLoading] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // If no article passed, go back to feed
  useEffect(() => {
    if (!article) {
      navigate("/feed");
      return;
    }
    loadDebate();
  }, [article]);

  // Cleanup audio
  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [audio]);

  const loadDebate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDebate(article.title, article.content || article.description);
      setDebate(data);
    } catch (err: any) {
      setError(err.message || "Failed to load debate");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayVoice = async (text: string, key: string) => {
    if (playingKey === key && audio) {
      audio.pause();
      setPlayingKey(null);
      return;
    }

    if (audio) {
      audio.pause();
    }

    setTtsLoading(key);
    try {
      const prefs = loadPreferences();
      const blob = await fetchTTS(text, prefs.voicePersona, prefs.language);
      const url = URL.createObjectURL(blob);
      const newAudio = new Audio(url);
      newAudio.playbackRate = prefs.narrativeSpeed;
      newAudio.onended = () => setPlayingKey(null);
      await newAudio.play();
      setAudio(newAudio);
      setPlayingKey(key);
    } catch (err: any) {
      console.error(err);
    } finally {
      setTtsLoading(null);
    }
  };

  if (!article) return null;

  return (
    <div className="px-6 py-8 max-w-[1200px] mx-auto w-full animate-in fade-in duration-500">
      {/* Back to feed */}
      <button
        onClick={() => navigate("/feed")}
        className="flex items-center gap-2 text-on-surface-variant hover:text-primary mb-8 font-label-caps text-xs uppercase tracking-widest transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Feed
      </button>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
            Debate Studio
          </span>
        </div>
        <h1 className="font-serif text-[32px] md:text-[42px] leading-tight font-semibold text-on-background tracking-tight mb-4">
          Balanced Perspectives
        </h1>
        <div className="p-6 bg-surface-container rounded-xl border border-outline-variant max-w-3xl">
          <span className="font-label-caps text-[10px] text-primary tracking-wider uppercase block mb-1">
            Topic Source Article
          </span>
          <h3 className="font-serif text-lg font-bold text-on-background mb-2">{article.title}</h3>
          <p className="text-on-surface-variant text-sm line-clamp-2">{article.description}</p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-on-surface-variant">Generating political and neutral perspectives...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-6 bg-error-container/20 border border-error/30 rounded-xl text-error max-w-xl">
          <p className="font-bold">Generation Failed</p>
          <p className="text-sm opacity-80 mt-1">{error}</p>
          <button onClick={loadDebate} className="mt-4 text-sm underline font-bold">Try Again</button>
        </div>
      )}

      {/* Perspectives Grid */}
      {!loading && debate && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Progressive Card */}
          <div className="bg-[#1D2433] rounded-2xl border border-blue-500/20 p-8 flex flex-col justify-between hover:shadow-lg transition-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
                  Progressive / Left
                </span>
                <MessageSquare className="w-5 h-5 text-blue-400/50" />
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-8">
                {debate.liberal}
              </p>
            </div>
            <button
              onClick={() => handlePlayVoice(debate.liberal, "liberal")}
              disabled={ttsLoading === "liberal"}
              className="flex items-center justify-center gap-2 w-full py-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all rounded-xl font-label-caps text-xs tracking-wider uppercase font-bold"
            >
              {ttsLoading === "liberal" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : playingKey === "liberal" ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
              {playingKey === "liberal" ? "Pause" : "Read Aloud"}
            </button>
          </div>

          {/* Centrist Card */}
          <div className="bg-surface-container rounded-2xl border border-outline-variant p-8 flex flex-col justify-between hover:shadow-lg transition-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                  Centrist / Balanced
                </span>
                <MessageSquare className="w-5 h-5 text-primary/50" />
              </div>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
                {debate.neutral}
              </p>
            </div>
            <button
              onClick={() => handlePlayVoice(debate.neutral, "neutral")}
              disabled={ttsLoading === "neutral"}
              className="flex items-center justify-center gap-2 w-full py-3 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all rounded-xl font-label-caps text-xs tracking-wider uppercase font-bold"
            >
              {ttsLoading === "neutral" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : playingKey === "neutral" ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
              {playingKey === "neutral" ? "Pause" : "Read Aloud"}
            </button>
          </div>

          {/* Conservative Card */}
          <div className="bg-[#2D1D1D] rounded-2xl border border-red-500/20 p-8 flex flex-col justify-between hover:shadow-lg transition-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-red-500/20">
                  Conservative / Right
                </span>
                <MessageSquare className="w-5 h-5 text-red-400/50" />
              </div>
              <p className="text-red-200 text-sm leading-relaxed mb-8">
                {debate.conservative}
              </p>
            </div>
            <button
              onClick={() => handlePlayVoice(debate.conservative, "conservative")}
              disabled={ttsLoading === "conservative"}
              className="flex items-center justify-center gap-2 w-full py-3 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all rounded-xl font-label-caps text-xs tracking-wider uppercase font-bold"
            >
              {ttsLoading === "conservative" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : playingKey === "conservative" ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
              {playingKey === "conservative" ? "Pause" : "Read Aloud"}
            </button>
          </div>
        </div>
      )}

      {/* Info banner */}
      <div className="mt-8 p-4 bg-surface-container rounded-xl border border-outline-variant flex gap-3 max-w-xl">
        <Info className="w-5 h-5 text-primary shrink-0" />
        <p className="text-on-surface-variant text-xs leading-normal">
          Perspectives are formulated by our Groq-powered AI model to encourage balanced thinking, analyzing political stances across global issues.
        </p>
      </div>
    </div>
  );
}

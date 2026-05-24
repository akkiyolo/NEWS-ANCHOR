import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, GraduationCap, Mic2, Trophy, DollarSign, Volume2, Pause, Loader2, Info } from "lucide-react";
import { cn } from "../lib/utils";
import { fetchExplanation, fetchTTS } from "../lib/api";
import { loadPreferences } from "../lib/store";

const PERSONA_INFO = [
  { type: "professor", label: "Professor", icon: GraduationCap, desc: "Academic explanation with analogies" },
  { type: "comedian", label: "Comedian", icon: Mic2, desc: "Standup breakdown with humor" },
  { type: "sports_commentator", label: "Sports Commentator", icon: Trophy, desc: "Play-by-play excitement" },
  { type: "financial_analyst", label: "Financial Analyst", icon: DollarSign, desc: "Wall Street market briefing" },
] as const;

export function Explain() {
  const location = useLocation();
  const navigate = useNavigate();
  const article = location.state?.article;

  const [activePersona, setActivePersona] = useState<typeof PERSONA_INFO[number]["type"]>("professor");
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [ttsLoading, setTtsLoading] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!article) {
      navigate("/feed");
      return;
    }
    loadExplanation(activePersona);
  }, [article, activePersona]);

  useEffect(() => {
    return () => {
      if (audio) audio.pause();
    };
  }, [audio]);

  const loadExplanation = async (persona: typeof activePersona) => {
    if (explanations[persona]) return; // already loaded
    setLoading(true);
    setError(null);
    try {
      const data = await fetchExplanation(article.content || article.description, persona);
      setExplanations(prev => ({ ...prev, [persona]: data.explanation }));
    } catch (err: any) {
      setError(err.message || "Failed to load explanation");
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
    <div className="px-6 py-8 max-w-[1000px] mx-auto w-full animate-in fade-in duration-500">
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
            Explain As... Studio
          </span>
        </div>
        <h1 className="font-serif text-[32px] md:text-[42px] leading-tight font-semibold text-on-background tracking-tight mb-4">
          Interactive Persona Explanations
        </h1>
        <div className="p-6 bg-surface-container rounded-xl border border-outline-variant">
          <span className="font-label-caps text-[10px] text-primary tracking-wider uppercase block mb-1">
            Topic Under Discussion
          </span>
          <h3 className="font-serif text-lg font-bold text-on-background mb-2">{article.title}</h3>
          <p className="text-on-surface-variant text-sm line-clamp-2">{article.description}</p>
        </div>
      </div>

      {/* Persona Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {PERSONA_INFO.map((p) => {
          const Icon = p.icon;
          const isActive = activePersona === p.type;
          return (
            <button
              key={p.type}
              onClick={() => setActivePersona(p.type)}
              className={cn(
                "p-5 rounded-xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer",
                isActive
                  ? "bg-[#F5F5F0] border-primary border-2 shadow-md relative"
                  : "bg-surface-container border-outline-variant hover:bg-surface-container-high"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mb-3",
                isActive ? "bg-primary/10 text-primary" : "bg-surface-container-highest text-on-surface-variant"
              )}>
                <Icon className="w-6 h-6" />
              </div>
              <span className={cn("font-bold text-sm block", isActive ? "text-black" : "text-on-background")}>
                {p.label}
              </span>
              <span className={cn("text-[9px] mt-1 leading-tight", isActive ? "text-slate-500" : "text-on-surface-variant")}>
                {p.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Explanation output */}
      <div className="bg-surface-container rounded-2xl border border-outline-variant p-8 shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-on-surface-variant">AI Persona is drafting the summary...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-error-container/20 border border-error/30 rounded-xl text-error">
            <p className="font-bold">Generation Failed</p>
            <p className="text-sm opacity-80 mt-1">{error}</p>
            <button onClick={() => loadExplanation(activePersona)} className="mt-4 text-sm underline font-bold">Try Again</button>
          </div>
        ) : explanations[activePersona] ? (
          <div className="space-y-6">
            <p className="text-on-background text-lg leading-relaxed md:text-xl font-serif">
              {explanations[activePersona]}
            </p>
            
            <button
              onClick={() => handlePlayVoice(explanations[activePersona], activePersona)}
              disabled={ttsLoading === activePersona}
              className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-label-caps text-xs tracking-wider uppercase font-bold hover:opacity-90 transition-all active:scale-95 shadow-md disabled:opacity-50"
            >
              {ttsLoading === activePersona ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : playingKey === activePersona ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
              {playingKey === activePersona ? "Pause" : "Listen to Explanation"}
            </button>
          </div>
        ) : null}
      </div>

      {/* Persona warning */}
      <div className="mt-8 p-4 bg-surface-container rounded-xl border border-outline-variant flex gap-3 max-w-xl">
        <Info className="w-5 h-5 text-primary shrink-0" />
        <p className="text-on-surface-variant text-xs leading-normal">
          AI explanations translate complex concepts into highly specific, creative, and accessible formats using specialized conversational personas.
        </p>
      </div>
    </div>
  );
}

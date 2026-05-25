import { useState } from "react";
import { 
  History, Calendar, Loader2, Sparkles, Volume2, HelpCircle, 
  Tv, Compass, Globe, ArrowLeft, ArrowRight, ShieldCheck 
} from "lucide-react";
import { cn } from "../lib/utils";
import { fetchHistoricalArchive, type HistoricalArticle } from "../lib/api";

interface EpochOption {
  name: string;
  year: number;
  description: string;
  icon: typeof Globe;
}

const EPOCHS: EpochOption[] = [
  { name: "Apollo 11 Moon Landing", year: 1969, description: "Man's historic first steps on the lunar surface.", icon: Globe },
  { name: "Rise of the Personal Computer", year: 1981, description: "The dawn of microcomputing in households.", icon: Tv },
  { name: "Fall of the Berlin Wall", year: 1989, description: "A historic collapse reshaping global geopolitics.", icon: Compass },
  { name: "Dot-com Bubble Boom", year: 1999, description: "Rapid internet stock expansions and Y2K prep.", icon: Sparkles },
];

export function Archive() {
  const [selectedEpoch, setSelectedEpoch] = useState<EpochOption>(EPOCHS[3]);
  const [customYear, setCustomYear] = useState<number>(1999);
  const [loading, setLoading] = useState(false);
  const [timeJumped, setTimeJumped] = useState(false);
  const [articles, setArticles] = useState<HistoricalArticle[]>([]);
  const [historicalAnalysis, setHistoricalAnalysis] = useState("");
  const [playingTts, setPlayingTts] = useState<string | null>(null);
  const [ttsLoading, setTtsLoading] = useState<string | null>(null);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  const handleTimeJump = async () => {
    setLoading(true);
    setTimeJumped(false);
    try {
      const data = await fetchHistoricalArchive(selectedEpoch.name, customYear);
      setArticles(data.articles);
      setHistoricalAnalysis(data.historical_analysis);
      setTimeJumped(true);
    } catch (err: any) {
      console.error("Time jump failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayHistoricalTts = async (text: string, id: string) => {
    if (playingTts === id && audioRef) {
      audioRef.pause();
      setPlayingTts(null);
      return;
    }

    if (audioRef) {
      audioRef.pause();
    }

    setTtsLoading(id);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: `Delivering a retro historical broadcast from the year ${customYear}: ${text}`,
          voice: "rachel" 
        }),
      });

      if (!res.ok) throw new Error("TTS failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => setPlayingTts(null);
      await audio.play();
      setAudioRef(audio);
      setPlayingTts(id);
    } catch (err: any) {
      console.error("Historical TTS failed:", err.message);
    } finally {
      setTtsLoading(null);
    }
  };

  return (
    <div className="px-6 py-8 max-w-[1440px] mx-auto w-full animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border border-primary/20 flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" /> Historical Time Machine
          </span>
        </div>
        <h1 className="font-serif text-[36px] md:text-[48px] leading-[1.1] font-semibold text-on-background tracking-tight mb-2">
          AI News Archive
        </h1>
        <p className="text-on-surface-variant font-sans text-lg max-w-2xl">
          Travel through history. Select an epoch or set your customized timeline coordinate below to generate simulated breaking news exactly as it was written back then.
        </p>
      </div>

      {/* Epochs & Settings Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Step 1: Choose Epoch */}
        <div className="lg:col-span-2 bg-surface-container/30 border border-outline-variant/30 backdrop-blur-md rounded-2xl p-6">
          <h2 className="font-serif text-xl font-bold text-on-background mb-4 flex items-center gap-2">
            <Compass className="w-5 h-5 text-primary" /> 1. Select Timeline Coordinates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EPOCHS.map((epoch) => {
              const Icon = epoch.icon;
              const isSelected = selectedEpoch.name === epoch.name;
              return (
                <button
                  key={epoch.name}
                  onClick={() => {
                    setSelectedEpoch(epoch);
                    setCustomYear(epoch.year);
                  }}
                  className={cn(
                    "p-5 text-left rounded-xl transition-all border duration-300 flex items-start gap-4",
                    isSelected
                      ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(97,139,255,0.15)]"
                      : "bg-surface-container-high/30 border-outline-variant/30 hover:border-primary/30"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center border",
                    isSelected 
                      ? "bg-primary text-on-primary border-primary/30" 
                      : "bg-surface-container border-outline-variant/30 text-on-surface-variant"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm text-on-background">{epoch.name}</span>
                      <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded font-mono font-bold">{epoch.year}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant line-clamp-2">{epoch.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Custom Coordinate & Jump */}
        <div className="bg-surface-container/30 border border-outline-variant/30 backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-on-background mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" /> 2. Refine Year Coordinate
            </h2>
            <div className="mb-6">
              <div className="flex justify-between text-xs text-on-surface-variant font-mono mb-2">
                <span>1950</span>
                <span className="text-primary font-bold text-base">{customYear}</span>
                <span>2010</span>
              </div>
              <input
                type="range"
                min="1950"
                max="2010"
                value={customYear}
                onChange={(e) => setCustomYear(Number(e.target.value))}
                className="w-full h-1 bg-surface-container border border-outline-variant rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
            <p className="text-xs text-on-surface-variant/80 mb-6">
              Adjust the timeline slider to customize your destination. AI will model news articles matching the chosen year's cultural paradigm.
            </p>
          </div>

          <button
            onClick={handleTimeJump}
            disabled={loading}
            className="w-full py-4 bg-primary text-on-primary rounded-xl font-label-caps text-xs tracking-wider uppercase font-bold hover:shadow-[0_0_20px_rgba(97,139,255,0.3)] hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Temporal Shift in Progress...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Initiate Timeline Jump
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Results Display */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-on-surface-variant font-mono animate-pulse">Calculating temporal coordinates for {customYear}...</p>
        </div>
      )}

      {/* Loaded News & Analysis */}
      {!loading && timeJumped && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
          {/* Historical Hindsight Analysis */}
          <div className="bg-primary/5 border border-primary/20 backdrop-blur rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start">
            <div className="w-12 h-12 bg-primary/10 border border-primary/20 text-primary flex items-center justify-center rounded-xl shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-label-caps text-xs tracking-widest text-primary font-bold uppercase mb-2">Historical Hindsight Analysis</h3>
              <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">
                {historicalAnalysis}
              </p>
            </div>
          </div>

          {/* Historical Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-surface-container/30 border border-outline-variant/30 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between hover:border-primary/20 transition-all group"
              >
                {article.image_url && (
                  <div className="relative overflow-hidden h-48 bg-slate-900">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter sepia brightness-90"
                      src={article.image_url}
                      alt={article.title}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                    <div className="absolute top-4 left-4 bg-primary/20 backdrop-blur border border-primary/30 px-3 py-1.5 rounded text-primary text-[9px] font-bold uppercase tracking-wider shadow-sm">
                      {article.source_name}
                    </div>
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-label-caps text-[9px] text-on-surface-variant/70 tracking-widest uppercase mb-2 block">
                      {(article.category || []).join(" • ")}
                    </span>
                    <h3 className="font-serif text-xl text-on-background mb-3 leading-snug font-bold">
                      {article.title}
                    </h3>
                    <p className="text-on-surface-variant text-sm mb-6 line-clamp-4 leading-relaxed font-sans">
                      {article.content || article.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-outline-variant/20 flex justify-between items-center">
                    <span className="text-[10px] font-mono text-on-surface-variant">{article.pubDate}</span>
                    <button
                      onClick={() => handlePlayHistoricalTts(article.title + ". " + (article.content || article.description), article.id)}
                      className="p-2.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/25 rounded-lg transition-all"
                      title="Listen to historical broadcast"
                    >
                      {ttsLoading === article.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : playingTts === article.id ? (
                        <Volume2 className="w-4 h-4 animate-pulse" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { 
  Activity, Search, Loader2, AlertTriangle, MessageSquare, 
  Flame, TrendingUp, Sparkles, PieChart, ShieldAlert 
} from "lucide-react";
import { cn } from "../lib/utils";
import { fetchTrends, type TrendsResponse } from "../lib/api";

export function Trends() {
  const [query, setQuery] = useState("artificial intelligence");
  const [trends, setTrends] = useState<TrendsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTrends = async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTrends(searchQuery);
      setTrends(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrends(query);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      loadTrends(query);
    }
  };

  return (
    <div className="px-6 py-8 max-w-[1440px] mx-auto w-full animate-in fade-in duration-500">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border border-primary/20 flex items-center gap-1.5 animate-pulse">
              <Activity className="w-3.5 h-3.5 animate-pulse" /> Live Hackathon Trends Tracker
            </span>
          </div>
          <h1 className="font-serif text-[36px] md:text-[48px] leading-[1.1] font-semibold text-on-background tracking-tight mb-2">
            Media Intelligence & Bias Live Analyzer
          </h1>
          <p className="text-on-surface-variant font-sans text-lg max-w-xl">
            Input any keyword to let AI compile the political bias distribution, coverage sensationalism, and global emotional heatmaps.
          </p>
        </div>

        {/* Dynamic Search Controller */}
        <form onSubmit={handleSearch} className="w-full md:w-auto flex gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/70" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter search keyword (e.g. Space, AI...)"
              className="w-full pl-11 pr-4 py-3 bg-surface-container/30 border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:border-primary/50 text-on-background transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold font-label-caps text-xs tracking-wider uppercase hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Analyze"}
          </button>
        </form>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-on-surface-variant font-mono animate-pulse">Scanning collective global media indices for "{query}"...</p>
        </div>
      )}

      {error && (
        <div className="p-6 bg-error/10 border border-error/20 text-error rounded-2xl flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <div>
            <h3 className="font-bold mb-1">Analysis Failed</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Main Analytics Dashboard */}
      {!loading && trends && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
          
          {/* Row 1: Bias Distribution & Hype Meter */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Political Bias Distribution Card */}
            <div className="lg:col-span-2 bg-surface-container/30 border border-outline-variant/30 backdrop-blur-md rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-xl font-bold text-on-background flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" /> Political Alignment Distribution
                </h3>
                <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">Collective Bias Matrix</span>
              </div>

              {/* Progress Spectrum Bar */}
              <div className="h-6 w-full rounded-full overflow-hidden flex mb-6 border border-outline-variant/20 shadow-inner">
                <div 
                  style={{ width: `${trends.bias_distribution.left}%` }} 
                  className="bg-gradient-to-r from-blue-600 to-blue-500 h-full flex items-center justify-center text-[10px] text-white font-bold"
                  title="Left Leaning"
                >
                  {trends.bias_distribution.left > 15 && `Left ${trends.bias_distribution.left}%`}
                </div>
                <div 
                  style={{ width: `${trends.bias_distribution.center}%` }} 
                  className="bg-neutral-600 h-full flex items-center justify-center text-[10px] text-white font-bold"
                  title="Center / Balanced"
                >
                  {trends.bias_distribution.center > 15 && `Center ${trends.bias_distribution.center}%`}
                </div>
                <div 
                  style={{ width: `${trends.bias_distribution.right}%` }} 
                  className="bg-gradient-to-r from-red-500 to-red-600 h-full flex items-center justify-center text-[10px] text-white font-bold"
                  title="Right Leaning"
                >
                  {trends.bias_distribution.right > 15 && `Right ${trends.bias_distribution.right}%`}
                </div>
              </div>

              {/* Legend Metrics */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-blue-950/20 border border-blue-500/20 rounded-xl">
                  <span className="block text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Left Wing Bias</span>
                  <span className="font-mono text-2xl font-bold text-blue-400">{trends.bias_distribution.left}%</span>
                </div>
                <div className="p-4 bg-neutral-900/40 border border-neutral-700/20 rounded-xl">
                  <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Balanced Center</span>
                  <span className="font-mono text-2xl font-bold text-neutral-200">{trends.bias_distribution.center}%</span>
                </div>
                <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-xl">
                  <span className="block text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Right Wing Bias</span>
                  <span className="font-mono text-2xl font-bold text-red-400">{trends.bias_distribution.right}%</span>
                </div>
              </div>
            </div>

            {/* Glowing Hype Circular Gauge */}
            <div className="bg-surface-container/30 border border-outline-variant/30 backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between items-center text-center">
              <h3 className="font-serif text-lg font-bold text-on-background w-full text-left flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-primary" /> Sensationalism Index
              </h3>

              {/* SVG Holographic Gauge */}
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#1e293b"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="var(--color-primary)"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * trends.hype_score) / 100}
                    className="transition-all duration-1000 ease-out"
                    style={{ stroke: 'url(#primaryGradient)' }}
                  />
                  <defs>
                    <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#84cc16" />
                      <stop offset="50%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="font-mono text-3xl font-bold text-on-background">{trends.hype_score}</span>
                  <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Hype Score</span>
                </div>
              </div>

              <div className="mt-4">
                <span className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border",
                  trends.hype_score > 60 
                    ? "bg-red-500/10 text-red-400 border-red-500/20" 
                    : "bg-green-500/10 text-green-400 border-green-500/20"
                )}>
                  {trends.hype_label}
                </span>
              </div>
            </div>
          </div>

          {/* Row 2: Emotional Heatmap Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* SVG Emotion Bar Charts */}
            <div className="lg:col-span-2 bg-surface-container/30 border border-outline-variant/30 backdrop-blur-md rounded-2xl p-6">
              <h3 className="font-serif text-xl font-bold text-on-background mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> Collective Emotional Temperature
              </h3>
              
              <div className="space-y-4">
                {Object.entries(trends.sentiment_breakdown).map(([emotion, score]) => (
                  <div key={emotion}>
                    <div className="flex justify-between text-xs text-on-background font-mono mb-1.5 uppercase tracking-wider">
                      <span>{emotion}</span>
                      <span className="font-bold">{score}%</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${score}%` }} 
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          emotion === "fear" ? "bg-red-500" :
                          emotion === "anger" ? "bg-orange-500" :
                          emotion === "optimism" ? "bg-green-500" :
                          emotion === "trust" ? "bg-blue-500" : "bg-purple-500"
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sensationalist Phrases Detected */}
            <div className="bg-surface-container/30 border border-outline-variant/30 backdrop-blur-md rounded-2xl p-6">
              <h3 className="font-serif text-lg font-bold text-on-background flex items-center gap-2 mb-4">
                <ShieldAlert className="w-5 h-5 text-primary" /> Sensationalist Markers
              </h3>
              <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                Core hyperbolic adjectives or phrases identified within the current index that fuel clickbait metrics:
              </p>
              <div className="flex flex-wrap gap-2.5">
                {trends.sensationalist_phrases.map((phrase, i) => (
                  <span 
                    key={i} 
                    className="bg-primary-container/10 text-primary border border-primary/20 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold hover:scale-105 transition-transform"
                  >
                    "{phrase}"
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: Narrative Vectors */}
          <div className="bg-surface-container/30 border border-outline-variant/30 backdrop-blur-md rounded-2xl p-6">
            <h3 className="font-serif text-xl font-bold text-on-background mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" /> Core Media Narrative Vectors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {trends.core_narratives.map((narrative, i) => (
                <div key={i} className="p-5 bg-surface-container-high/30 border border-outline-variant/30 rounded-xl relative group overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary transition-all duration-300 group-hover:w-2" />
                  <div className="pl-4">
                    <span className="block text-[10px] font-bold text-primary uppercase tracking-widest mb-1.5">Narrative Dimension {i + 1}</span>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      {narrative}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

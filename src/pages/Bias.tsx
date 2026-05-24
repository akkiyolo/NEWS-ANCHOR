import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, Info, ShieldAlert, Award } from "lucide-react";
import { cn } from "../lib/utils";
import { fetchBias } from "../lib/api";

export function Bias() {
  const location = useLocation();
  const navigate = useNavigate();
  const article = location.state?.article;

  const [bias, setBias] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!article) {
      navigate("/feed");
      return;
    }
    loadBias();
  }, [article]);

  const loadBias = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBias(article.content || article.description, [article.source_name]);
      setBias(data);
    } catch (err: any) {
      setError(err.message || "Failed to analyze political bias");
    } finally {
      setLoading(false);
    }
  };

  const biasToPercent = (position: number) => ((position + 100) / 200) * 100;

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
            Bias Mitigator
          </span>
        </div>
        <h1 className="font-serif text-[32px] md:text-[42px] leading-tight font-semibold text-on-background tracking-tight mb-4">
          Political Bias Analysis
        </h1>
        <div className="p-6 bg-surface-container rounded-xl border border-outline-variant">
          <span className="font-label-caps text-[10px] text-primary tracking-wider uppercase block mb-1">
            Article
          </span>
          <h3 className="font-serif text-lg font-bold text-on-background mb-2">{article.title}</h3>
          <p className="text-on-surface-variant text-sm">{article.source_name} • {article.source_domain}</p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <TrendingUp className="w-8 h-8 animate-bounce text-primary" />
          <p className="text-on-surface-variant">Performing syntactic sentiment and spectrum analysis...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-6 bg-error-container/20 border border-error/30 rounded-xl text-error">
          <p className="font-bold">Analysis Failed</p>
          <p className="text-sm opacity-80 mt-1">{error}</p>
          <button onClick={loadBias} className="mt-4 text-sm underline font-bold">Try Again</button>
        </div>
      )}

      {/* Bias Results */}
      {!loading && bias && (
        <div className="space-y-8">
          {/* Spectrum Bar */}
          <div className="bg-surface-container rounded-2xl border border-outline-variant p-8 shadow-sm">
            <h3 className="font-serif text-xl font-bold mb-6 text-on-background">Political Alignment</h3>
            
            <div className="flex items-center justify-between mb-4">
              <span className="font-serif text-2xl font-medium text-primary">{bias.label}</span>
              <span className="bg-surface-container-high px-4 py-1.5 rounded-full font-mono text-xs text-on-surface-variant font-bold">
                Position Score: {bias.position > 0 ? "+" : ""}{bias.position}
              </span>
            </div>

            <div className="relative py-8">
              {/* Custom styled color spectrum bar */}
              <div className="h-3 w-full bg-gradient-to-r from-blue-600 via-slate-400 to-red-600 rounded-full shadow-inner" />
              <div className="absolute top-2 left-0 w-full flex justify-between px-2 text-[10px] font-bold text-on-surface-variant/60 tracking-widest">
                <span>FAR LEFT</span><span>NEUTRAL</span><span>FAR RIGHT</span>
              </div>
              <div
                className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-[3px] border-primary rounded-full shadow-lg transition-all duration-1000 z-10 hover:scale-110 cursor-pointer"
                style={{ left: `${biasToPercent(bias.position)}%`, transform: "translate(-50%, -50%)" }}
              />
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed mt-4 bg-background/50 p-4 rounded-lg italic">
              &ldquo;{bias.reasoning}&rdquo;
            </p>
          </div>

          {/* Sentiment breakdown */}
          <div className="bg-surface-container rounded-2xl border border-outline-variant p-8 shadow-sm">
            <h3 className="font-serif text-xl font-bold mb-6 text-on-background">Emotional Signature</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Object.entries(bias.sentiment || {}).map(([key, val]: any) => {
                let colorClass = "bg-primary";
                if (key === "anger" || key === "disgust") colorClass = "bg-error";
                if (key === "fear") colorClass = "bg-secondary";
                if (key === "optimism" || key === "trust") colorClass = "bg-green-500";

                return (
                  <div key={key} className="bg-surface-container-high rounded-xl p-5 border border-outline-variant/40">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-label-caps text-xs uppercase tracking-wider text-on-surface-variant font-bold">{key}</span>
                      <span className="font-mono text-sm text-primary font-bold">{val}%</span>
                    </div>
                    <div className="w-full bg-outline-variant h-2 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-1000", colorClass)}
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Footer warning */}
      <div className="mt-8 p-4 bg-surface-container rounded-xl border border-outline-variant flex gap-3 max-w-xl">
        <Info className="w-5 h-5 text-primary shrink-0" />
        <p className="text-on-surface-variant text-xs leading-normal">
          This analysis measures rhetorical bias and emotional valence. Neutral score indicates objective coverage; higher left/right scores indicate political slanting or loaded wording.
        </p>
      </div>
    </div>
  );
}

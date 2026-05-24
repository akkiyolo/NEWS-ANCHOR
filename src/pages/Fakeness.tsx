import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, ShieldAlert, Loader2, Info, AlertTriangle } from "lucide-react";
import { cn } from "../lib/utils";
import { fetchFakeness } from "../lib/api";

export function Fakeness() {
  const location = useLocation();
  const navigate = useNavigate();
  const article = location.state?.article;

  const [fakeness, setFakeness] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!article) {
      navigate("/feed");
      return;
    }
    loadFakeness();
  }, [article]);

  const loadFakeness = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFakeness(article.title, article.content || article.description, article.source_domain);
      setFakeness(data);
    } catch (err: any) {
      setError(err.message || "Failed to analyze article credibility");
    } finally {
      setLoading(false);
    }
  };

  if (!article) return null;

  const isHighlyCredible = fakeness && fakeness.credibility_rating === "high";

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
            Fact Checker
          </span>
        </div>
        <h1 className="font-serif text-[32px] md:text-[42px] leading-tight font-semibold text-on-background tracking-tight mb-4">
          Credibility Report
        </h1>
        <div className="p-6 bg-surface-container rounded-xl border border-outline-variant">
          <span className="font-label-caps text-[10px] text-primary tracking-wider uppercase block mb-1">
            Article Verified
          </span>
          <h3 className="font-serif text-lg font-bold text-on-background mb-2">{article.title}</h3>
          <p className="text-on-surface-variant text-sm">{article.source_name} • {article.source_domain}</p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-on-surface-variant">Scanning meta signals, domain registry, and claims accuracy...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-6 bg-error-container/20 border border-error/30 rounded-xl text-error">
          <p className="font-bold">Fact Check Failed</p>
          <p className="text-sm opacity-80 mt-1">{error}</p>
          <button onClick={loadFakeness} className="mt-4 text-sm underline font-bold">Try Again</button>
        </div>
      )}

      {/* Credibility Results */}
      {!loading && fakeness && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Score Box */}
          <div className="md:col-span-2 bg-surface-container rounded-2xl border border-outline-variant p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-xl font-bold text-on-background">Fakeness Index</h3>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  isHighlyCredible ? "bg-green-500/20 text-green-400" : fakeness.credibility_rating === "medium" ? "bg-secondary/20 text-secondary" : "bg-error/20 text-error"
                )}>
                  {fakeness.credibility_rating} Credibility
                </span>
              </div>

              <div className="flex items-end gap-2 mb-4">
                <span className="font-mono text-6xl text-on-background">{fakeness.score.toFixed(0)}</span>
                <span className="text-on-surface-variant text-sm mb-2 uppercase tracking-widest font-bold">/ 100</span>
              </div>

              <div className="w-full bg-outline-variant h-2.5 rounded-full overflow-hidden mb-6">
                <div
                  className={cn("h-full rounded-full transition-all duration-1000", isHighlyCredible ? "bg-green-500" : fakeness.score < 50 ? "bg-secondary" : "bg-error")}
                  style={{ width: `${fakeness.score}%` }}
                />
              </div>

              <p className="text-on-surface-variant text-sm leading-relaxed mb-4 bg-background/50 p-4 rounded-lg italic">
                &ldquo;{fakeness.reasoning}&rdquo;
              </p>
            </div>
          </div>

          {/* Warning signals */}
          <div className="bg-surface-container rounded-2xl border border-outline-variant p-8 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold mb-6 text-on-background flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-secondary" />
                Metadata Signals
              </h3>

              <div className="space-y-3">
                {fakeness.signals && fakeness.signals.length > 0 ? (
                  fakeness.signals.map((sig: string, i: number) => (
                    <div key={i} className="flex gap-2.5 items-start bg-background/50 p-3 rounded-lg border border-outline-variant/30">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 mt-2" />
                      <span className="text-xs text-on-surface-variant leading-tight">{sig}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-on-surface-variant/50 text-xs">
                    No alarming fakeness signals detected.
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-outline-variant mt-6 flex items-center gap-3">
              {isHighlyCredible ? (
                <ShieldCheck className="w-8 h-8 text-green-400 shrink-0" />
              ) : (
                <ShieldAlert className="w-8 h-8 text-error shrink-0" />
              )}
              <div>
                <span className="font-bold text-xs text-on-background block">
                  {isHighlyCredible ? "Verified Domain" : "Use Caution"}
                </span>
                <span className="text-[10px] text-on-surface-variant">
                  {isHighlyCredible ? "Standard factual reporting." : "Rhetorical bias or sensationalism detected."}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

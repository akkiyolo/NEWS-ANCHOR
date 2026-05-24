import { useState, useEffect, useCallback } from "react";
import { Play, Plus, Pause, Loader2, Volume2, RefreshCw, X } from "lucide-react";
import { cn } from "../lib/utils";
import { fetchBriefing, fetchTTS, type BriefingStory, type BriefingResponse } from "../lib/api";
import { loadPreferences, savePreferences, addToQueue, type InterestCategory } from "../lib/store";

const ALL_INTERESTS: { label: string; value: InterestCategory }[] = [
  { label: "Tech Innovation", value: "technology" },
  { label: "Global Macro", value: "business" },
  { label: "AI Ethics", value: "science" },
  { label: "Sports Data", value: "sports" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Geopolitics", value: "politics" },
  { label: "World News", value: "world" },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  technology: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/30" },
  business: { bg: "bg-secondary/10", text: "text-secondary", border: "border-secondary/30" },
  science: { bg: "bg-primary/10", text: "text-primary-fixed", border: "border-primary-fixed/30" },
  sports: { bg: "bg-tertiary/10", text: "text-tertiary", border: "border-tertiary/30" },
  entertainment: { bg: "bg-error/10", text: "text-error-container", border: "border-error-container/30" },
  politics: { bg: "bg-error/15", text: "text-error", border: "border-error/30" },
  world: { bg: "bg-primary/10", text: "text-primary-fixed-dim", border: "border-primary-fixed-dim/30" },
};

export function Personalized() {
  const [prefs, setPrefs] = useState(loadPreferences());
  const [briefing, setBriefing] = useState<BriefingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [ttsLoading, setTtsLoading] = useState<string | null>(null);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [showInterestPicker, setShowInterestPicker] = useState(false);

  const loadBriefing = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBriefing(prefs.interests, prefs.language);
      setBriefing(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [prefs.interests, prefs.language]);

  useEffect(() => {
    loadBriefing();
  }, [loadBriefing]);

  const toggleInterest = (interest: InterestCategory) => {
    const current = [...prefs.interests];
    const idx = current.indexOf(interest);
    if (idx >= 0) {
      if (current.length <= 1) return; // Keep at least 1
      current.splice(idx, 1);
    } else {
      current.push(interest);
    }
    const updated = savePreferences({ interests: current });
    setPrefs(updated);
  };

  const handlePlayStory = async (story: BriefingStory, index: number) => {
    const storyId = `briefing-${index}`;

    // If already playing this story, pause
    if (playingId === storyId && audioRef) {
      audioRef.pause();
      setPlayingId(null);
      return;
    }

    // Stop any current audio
    if (audioRef) {
      audioRef.pause();
      audioRef.src = "";
    }

    setTtsLoading(storyId);
    try {
      const blob = await fetchTTS(
        `${story.title}. ${story.summary}`,
        prefs.voicePersona,
        prefs.language
      );
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.playbackRate = prefs.narrativeSpeed;
      audio.muted = prefs.isMuted;
      audio.onended = () => setPlayingId(null);
      await audio.play();
      setAudioRef(audio);
      setPlayingId(storyId);
    } catch (err: any) {
      console.error("TTS error:", err.message);
    } finally {
      setTtsLoading(null);
    }
  };

  const handlePlayAll = () => {
    if (!briefing?.stories) return;
    briefing.stories.forEach((story, i) => {
      addToQueue({
        id: `briefing-${i}`,
        title: story.title,
        source: story.source,
        text: `${story.title}. ${story.summary}`,
        category: story.category,
      });
    });
  };

  const coveredCount = briefing?.stories?.length || 0;
  const totalInterests = prefs.interests.length;
  const progress = totalInterests > 0 ? Math.round((Math.min(coveredCount, totalInterests * 3) / (totalInterests * 3)) * 100) : 0;
  const progressOffset = 175.9 - (175.9 * progress) / 100;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="px-6 py-8 max-w-[1440px] mx-auto w-full animate-in fade-in duration-700">
      {/* Header Section */}
      <section className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="font-label-caps text-primary tracking-[0.2em] mb-4 block uppercase text-xs">
            {dateStr}
          </span>
          <h1 className="font-serif text-[36px] md:text-[48px] leading-[1.1] font-semibold text-on-background tracking-tight">
            {briefing?.greeting || "Good Morning"}, User
          </h1>
          <p className="text-on-surface-variant font-sans text-lg mt-3 max-w-2xl">
            {loading
              ? "Your AI Anchor is analyzing global sources for your personalized briefing..."
              : `Your AI Anchor has synthesized ${briefing?.total_sources || 0} sources into ${coveredCount} critical briefings.`}
          </p>
        </div>

        {/* Progress Ring */}
        <div className="flex items-center gap-6 p-6 bg-surface-container rounded-2xl border border-outline-variant">
          <div className="relative w-16 h-16">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                className="text-outline-variant"
                cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent"
              />
              <circle
                className="text-primary transition-all duration-1000"
                cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent"
                strokeDasharray="175.9" strokeDashoffset={progressOffset}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-primary font-mono text-xs font-medium">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : `${progress}%`}
            </div>
          </div>
          <div>
            <h4 className="font-label-caps text-xs text-on-background tracking-widest uppercase mb-1">Status</h4>
            <p className="text-sm text-on-surface-variant">
              {loading ? "Synthesizing..." : `${coveredCount} stories ready`}
            </p>
          </div>
          <button
            onClick={loadBriefing}
            className="ml-2 p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-primary"
            title="Refresh briefing"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          </button>
        </div>
      </section>

      {/* Interest Pills */}
      <div className="mb-10 flex flex-wrap gap-3">
        {ALL_INTERESTS.map((interest) => {
          const isSelected = prefs.interests.includes(interest.value);
          return (
            <button
              key={interest.value}
              onClick={() => toggleInterest(interest.value)}
              className={cn(
                "px-4 py-2 rounded-full border font-label-caps text-[10px] uppercase tracking-wider transition-all cursor-pointer",
                isSelected
                  ? "border-primary text-primary bg-primary/10 shadow-[0_0_10px_rgba(180,197,255,0.2)]"
                  : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
              )}
            >
              {interest.label}
            </button>
          );
        })}
        <button
          onClick={() => setShowInterestPicker(!showInterestPicker)}
          className="w-9 h-9 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant hover:text-primary"
        >
          {showInterestPicker ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-8 p-6 bg-error-container/10 border border-error/20 rounded-2xl text-error-container backdrop-blur-md shadow-lg animate-in fade-in duration-300">
          <p className="font-serif text-xl font-semibold mb-1">Failed to load briefing</p>
          <p className="text-sm opacity-90">{error}</p>
          <button onClick={loadBriefing} className="mt-3.5 px-4 py-2 bg-error text-on-error rounded-xl font-label-caps text-[10px] tracking-wider uppercase font-bold hover:opacity-90 active:scale-95 transition-all shadow-md">
            Try again
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <section className="grid grid-cols-12 gap-6 pb-24">
          <div className="col-span-12 lg:col-span-8 bg-surface-container rounded-2xl p-10 border border-outline-variant animate-pulse h-64" />
          <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-surface-container rounded-2xl p-8 border border-outline-variant animate-pulse h-56" />
          <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-surface-container rounded-2xl p-8 border border-outline-variant animate-pulse h-56" />
        </section>
      )}

      {/* Briefing Stack */}
      {!loading && briefing?.stories && briefing.stories.length > 0 && (
        <section className="grid grid-cols-12 gap-6 pb-24">
          {/* Play All Button */}
          <div className="col-span-12 flex justify-end mb-2">
            <button
              onClick={handlePlayAll}
              className="flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-xl font-label-caps text-xs tracking-wider uppercase hover:bg-primary/20 transition-all border border-primary/20"
            >
              <Volume2 className="w-4 h-4" />
              Play All Briefings
            </button>
          </div>

          {/* First story (large card) */}
          {briefing.stories[0] && (
            <div className="col-span-12 lg:col-span-8 bg-surface-container/30 rounded-2xl p-8 lg:p-10 border border-outline-variant/30 backdrop-blur-md shadow-lg relative group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_0_25px_rgba(97,139,255,0.15)]">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <div className="w-48 h-48 border-[16px] border-primary rounded-lg"></div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  {(() => {
                    const cat = briefing.stories[0].category;
                    const colors = CATEGORY_COLORS[cat] || CATEGORY_COLORS.technology;
                    return (
                      <span className={cn(colors.bg, colors.text, "border", colors.border, "px-3 py-1 rounded-full font-label-caps text-[10px] tracking-wider uppercase font-bold")}>
                        {cat}
                      </span>
                    );
                  })()}
                  <span className="text-on-surface-variant/70 font-mono text-[11px] font-medium tracking-wide">
                    {briefing.stories[0].source} • {new Date(briefing.stories[0].pubDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                <h2 className="font-serif text-[32px] md:text-[36px] text-on-background mb-4 leading-tight font-medium">
                  {briefing.stories[0].title}
                </h2>
                <p className="text-on-surface-variant font-sans text-lg mb-10 max-w-xl">
                  {briefing.stories[0].summary}
                </p>

                <div className="flex items-center gap-6">
                  <button
                    onClick={() => handlePlayStory(briefing.stories[0], 0)}
                    disabled={ttsLoading === "briefing-0"}
                    className="flex items-center gap-3 bg-primary text-on-primary px-6 py-3 rounded-xl font-label-caps text-xs tracking-wider uppercase hover:opacity-90 transition-all active:scale-95 font-bold shadow-md disabled:opacity-50"
                  >
                    {ttsLoading === "briefing-0" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : playingId === "briefing-0" ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current animate-pulse" />
                    )}
                    {playingId === "briefing-0" ? "Pause" : "Listen to Briefing"}
                  </button>
                  {playingId === "briefing-0" && (
                    <div className="flex gap-1 h-6 items-end px-2">
                      <div className="w-1 bg-primary/40 rounded-full h-3 animate-[pulse_1.5s_infinite_ease-in-out]"></div>
                      <div className="w-1 bg-primary/40 rounded-full h-5 animate-[pulse_2s_infinite_ease-in-out_0.2s]"></div>
                      <div className="w-1 bg-primary/40 rounded-full h-4 animate-[pulse_1.8s_infinite_ease-in-out_0.4s]"></div>
                      <div className="w-1 bg-primary/40 rounded-full h-6 animate-[pulse_1.2s_infinite_ease-in-out_0.1s]"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Remaining stories */}
          {briefing.stories.slice(1).map((story, idx) => {
            const storyIdx = idx + 1;
            const storyId = `briefing-${storyIdx}`;
            const colors = CATEGORY_COLORS[story.category] || CATEGORY_COLORS.technology;

            return (
              <div
                key={storyId}
                className={cn(
                  "bg-surface-container/30 rounded-2xl p-8 border border-outline-variant/30 backdrop-blur-md shadow-lg flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(97,139,255,0.1)]",
                  storyIdx <= 2 ? "col-span-12 md:col-span-6 lg:col-span-4" : "col-span-12 md:col-span-6"
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className={cn(colors.bg, colors.text, "font-bold border", colors.border, "px-3 py-1 rounded-full font-label-caps text-[10px] tracking-wider uppercase")}>
                      {story.category}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl text-on-background mb-4 font-medium leading-snug">
                    {story.title}
                  </h3>
                  <p className="text-on-surface-variant text-base line-clamp-3 mb-8">
                    {story.summary}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant/70 font-mono text-[11px] font-medium tracking-wide">
                    {story.source}
                  </span>
                  <button
                    onClick={() => handlePlayStory(story, storyIdx)}
                    disabled={ttsLoading === storyId}
                    className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center hover:opacity-90 transition-all shadow-md active:scale-95 disabled:opacity-50"
                  >
                    {ttsLoading === storyId ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : playingId === storyId ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current ml-1" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Empty state */}
      {!loading && (!briefing?.stories || briefing.stories.length === 0) && !error && (
        <div className="text-center py-20">
          <p className="text-on-surface-variant text-lg mb-4">No briefings available for your selected interests.</p>
          <button onClick={loadBriefing} className="text-primary underline hover:no-underline">
            Refresh
          </button>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useRef, useCallback } from "react";
import { Globe, X, Loader2, Mic, MicOff, Volume2, VolumeX, Send, Play } from "lucide-react";
import { cn } from "../lib/utils";
import { Link } from "react-router-dom";
import { fetchAnchorBroadcast, fetchAnchorFollowup, fetchTTS } from "../lib/api";
import { loadPreferences } from "../lib/store";

type AnchorState = "idle" | "loading" | "broadcasting" | "listening" | "responding";

interface ChatMessage {
  role: "anchor" | "user";
  text: string;
  timestamp: number;
}

export function Anchor() {
  const [timeStr, setTimeStr] = useState("");
  const [state, setState] = useState<AnchorState>("idle");
  const [captions, setCaptions] = useState("Tap the mic button to start your live AI news briefing...");
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [currentHeadline, setCurrentHeadline] = useState("Waiting for broadcast...");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Voice Input (Chit-Chat) state
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const captionRef = useRef<HTMLDivElement>(null);

  // Clock
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeStr(new Date().toISOString().slice(11, 19) + " UTC");
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cleanup audio & speech on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (recognition) {
        recognition.abort();
      }
    };
  }, [recognition]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      
      const prefs = loadPreferences();
      rec.lang = prefs.language === "hi" ? "hi-IN" : prefs.language === "ta" ? "ta-IN" : prefs.language === "bn" ? "bn-IN" : "en-US";

      rec.onstart = () => {
        setIsListeningVoice(true);
        setCaptions("Listening to your voice...");
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setUserInput(transcript);
          // Auto submit the voice question!
          submitFollowup(transcript);
        }
      };

      rec.onerror = (e: any) => {
        console.error("Speech error:", e.error);
        setIsListeningVoice(false);
        setCaptions("I didn't catch that. Tap the mic to try speaking again.");
      };

      rec.onend = () => {
        setIsListeningVoice(false);
      };

      setRecognition(rec);
    }
  }, [state]);

  const toggleVoiceInput = () => {
    if (!recognition) {
      alert("Voice input is not supported in this browser. Please try Google Chrome or Edge.");
      return;
    }
    if (isListeningVoice) {
      recognition.stop();
    } else {
      if (audioRef.current) {
        audioRef.current.pause(); // pause anchor speech when user wants to talk
      }
      recognition.start();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  // ─── Start Broadcast ──────────────────────────────────────────────────
  const startBroadcast = useCallback(async () => {
    if (state === "broadcasting") {
      // Stop
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setState("idle");
      setCaptions("Broadcast paused. Tap to resume.");
      return;
    }

    setState("loading");
    setCaptions("Connecting to live news sources...");
    setError(null);

    try {
      const prefs = loadPreferences();
      
      // Step 1: Get broadcast script from AI
      const broadcast = await fetchAnchorBroadcast(prefs.language);
      setHeadlines(broadcast.headlines);
      setCurrentHeadline(broadcast.headlines[0] || "Breaking News");

      // Add to chat
      setMessages(prev => [...prev, {
        role: "anchor",
        text: broadcast.broadcast,
        timestamp: Date.now(),
      }]);

      // Step 2: Animate captions
      setState("broadcasting");
      animateCaptions(broadcast.broadcast);

      // Step 3: Generate TTS and play
      if (!prefs.isMuted) {
        try {
          const blob = await fetchTTS(broadcast.broadcast, prefs.voicePersona, prefs.language);
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audio.playbackRate = prefs.narrativeSpeed;
          audio.muted = isMuted;
          audio.onended = () => {
            setState("listening");
            setCaptions("Broadcast complete. Talk to me or type your question below.");
          };
          audioRef.current = audio;
          await audio.play();
        } catch (ttsErr) {
          console.warn("TTS playback failed, showing text only:", ttsErr);
          setState("listening");
        }
      } else {
        setState("listening");
      }
    } catch (err: any) {
      setState("idle");
      setError(err.message);
      setCaptions("Failed to connect. Tap to try again.");
    }
  }, [state, isMuted]);

  // ─── Animate Captions Word by Word ────────────────────────────────────
  const animateCaptions = (text: string) => {
    const words = text.split(" ");
    let idx = 0;
    const chunkSize = 8;

    const interval = setInterval(() => {
      if (idx >= words.length) {
        clearInterval(interval);
        return;
      }
      const chunk = words.slice(Math.max(0, idx - chunkSize * 2), idx + chunkSize).join(" ");
      setCaptions(`"...${chunk}..."`);
      idx += chunkSize;
    }, 800);
  };

  // ─── Submit Follow-up Question ────────────────────────────────────────
  const submitFollowup = async (question: string) => {
    if (!question.trim()) return;

    setUserInput("");
    setState("responding");
    setCaptions("Analyzing your query...");

    setMessages(prev => [...prev, { role: "user", text: question, timestamp: Date.now() }]);

    try {
      const prefs = loadPreferences();
      const context = headlines.join(". ");
      const result = await fetchAnchorFollowup(question, context);

      setMessages(prev => [...prev, { role: "anchor", text: result.response, timestamp: Date.now() }]);
      setCaptions(`"${result.response}"`);
      setState("listening");

      // Play TTS response
      if (!prefs.isMuted && !isMuted) {
        try {
          const blob = await fetchTTS(result.response, prefs.voicePersona, prefs.language);
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audio.playbackRate = prefs.narrativeSpeed;
          audioRef.current = audio;
          await audio.play();
        } catch {}
      }
    } catch (err: any) {
      setCaptions("I had trouble resolving that. Let's try again.");
      setState("listening");
    }
  };

  const isActive = state === "broadcasting" || state === "listening" || state === "responding";

  return (
    <div className="fixed inset-0 z-[70] bg-background text-on-background overflow-hidden flex flex-col">
      {/* Background layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,19,27,0)_0%,rgba(17,19,27,1)_80%)]"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[size:40px_40px] bg-[linear-gradient(to_right,#8d90a1_1px,transparent_1px),linear-gradient(to_bottom,#8d90a1_1px,transparent_1px)]"></div>
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full flex justify-between items-center px-8 h-20 bg-transparent">
        <div className="flex items-center gap-6">
          <Link to="/feed" className="p-2 bg-surface-container rounded-full hover:bg-surface-container-high transition-colors">
            <X className="w-6 h-6 text-on-surface" />
          </Link>
          <span className="font-serif text-2xl font-bold">NewsAnchor AI</span>
          <div className="hidden md:flex items-center gap-3 ml-4">
            <span className={cn(
              "px-3 py-1 rounded-full font-label-caps text-[10px] uppercase font-bold tracking-widest",
              isActive
                ? "bg-secondary-container/20 text-secondary border border-secondary/30 animate-pulse"
                : "bg-surface-container text-on-surface-variant border border-outline-variant"
            )}>
              {state === "loading" ? "Connecting..." : state === "broadcasting" ? "Live Briefing" : state === "listening" ? "Listening..." : state === "responding" ? "Processing..." : "Standby"}
            </span>
            <span className="text-on-surface-variant font-mono text-sm">{timeStr}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button onClick={toggleMute} className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
            <Globe className="w-5 h-5" />
            <span className="font-label-caps text-xs uppercase tracking-widest">Global</span>
          </button>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-between px-6 pt-4 pb-20 w-full max-w-4xl mx-auto min-h-0">
        
        {/* Presenter Visual Slot */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-0 py-4">
          <div className="relative flex flex-col items-center">
            <button
              onClick={startBroadcast}
              className="relative group focus:outline-none"
              aria-label={isActive ? "Stop broadcast" : "Start broadcast"}
            >
              <div className={cn(
                "relative w-[200px] h-[200px] md:w-[280px] md:h-[280px] rounded-full overflow-hidden border-[6px] transition-all duration-500",
                isActive
                  ? "border-primary/40 shadow-[0_0_30px_6px_rgba(97,139,255,0.4)] animate-[pulse-glow_2s_infinite_ease-in-out]"
                  : state === "loading"
                    ? "border-secondary/40 shadow-[0_0_20px_4px_rgba(255,185,85,0.3)]"
                    : "border-outline-variant hover:border-primary/30 hover:shadow-[0_0_20px_4px_rgba(97,139,255,0.2)]"
              )}>
                <img
                  className="w-full h-full object-cover scale-110 translate-y-8"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3iI-YGTVfksDI7FQrRyC9Blpig6_HnzP_a-5hd6Xaqa_zYofpFRTvTuB4LOrb0geVkKgQG-LvLy4GMIFIY99N113lSUC81SMZ83_0ovYuUnu1QA3PLIzuQRtxvreRyCDEOS1Avu2Aam5xtvTMj6la8ApBJHhp5jFSnQj5eSfB56LHn3x6UVP_4QEEbTN2zMriKVJkbhZB3vCNFBVpkSC8hVinTuGBWVCajw7h9ITHhBtFdDb2DghV6NrGxt88zTrmQAqu2bmJhLwy"
                  alt="AI Anchor"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>

                {/* Loading overlay */}
                {state === "loading" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  </div>
                )}
              </div>
            </button>

            {/* Voice Wave */}
            {(isActive || isListeningVoice) && (
              <div className="absolute -bottom-8 flex items-end gap-2 h-16">
                {[0.1, 0.3, 0.5, 0.2, 0.4, 0.6, 0.1].map((delay, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-2.5 rounded-full animate-[wave-scale_1.2s_infinite_ease-in-out]",
                      isListeningVoice ? "bg-red-500" : i === 3 ? "bg-secondary w-3.5" : "bg-primary"
                    )}
                    style={{ animationDelay: `${delay}s`, height: [16, 32, 48, 40, 36, 20, 12][i] }}
                  />
                ))}
              </div>
            )}

            {/* Dedicated Broadcast button on Standby */}
            {state === "idle" && (
              <div className="absolute -bottom-6">
                <button
                  onClick={startBroadcast}
                  className="px-6 py-3.5 bg-primary text-on-primary flex items-center gap-2 rounded-xl shadow-lg hover:opacity-90 hover:scale-105 active:scale-95 transition-all cursor-pointer font-label-caps text-xs tracking-wider uppercase font-bold"
                >
                  <Play className="w-4 h-4" /> Broadcast Live News
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Captions Block (Dynamic Spacing) */}
        <div
          ref={captionRef}
          className="w-full max-w-2xl px-4 text-center my-6 shrink-0 min-h-[80px] flex flex-col justify-center animate-fade-in"
          aria-live="polite"
          role="log"
        >
          <p className={cn(
            "font-serif text-[20px] md:text-[26px] leading-relaxed tracking-tight italic opacity-95 transition-all duration-500",
            state === "broadcasting" ? "text-primary-fixed font-semibold" : isListeningVoice ? "text-red-400" : "text-on-surface"
          )}>
            {captions}
          </p>
          {error && (
            <p className="text-error text-xs mt-2 font-medium bg-error-container/10 py-1.5 px-3 rounded-lg border border-error/20 inline-self-center">{error}</p>
          )}
        </div>

        {/* Follow-up input + Voice microphone chat (Always Visible) */}
        <div className="w-full max-w-xl px-4 shrink-0 pb-4">
          <div className="flex gap-2.5 items-center bg-[#F5F5F0]/5 p-2 rounded-2xl border border-outline-variant/30 backdrop-blur-sm shadow-xl">
            {/* Mic button to talk directly to Anchor */}
            <button
              onClick={toggleVoiceInput}
              className={cn(
                "p-3.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer shrink-0",
                isListeningVoice
                  ? "bg-red-500 text-white border-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                  : "bg-surface-container border-outline-variant text-on-surface-variant hover:border-primary/50"
              )}
              title={isListeningVoice ? "Stop speaking" : "Speak to Anchor"}
            >
              {isListeningVoice ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submitFollowup(userInput)}
              placeholder="Ask or speak to the anchor..."
              disabled={state === "responding" || isListeningVoice}
              className="flex-1 bg-transparent border-0 px-2 py-3 text-on-background placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-0 text-sm"
            />
            <button
              onClick={() => submitFollowup(userInput)}
              disabled={state === "responding" || isListeningVoice || !userInput.trim()}
              className="p-3.5 bg-primary text-on-primary rounded-xl hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer shrink-0"
            >
              {state === "responding" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </main>

      {/* Lower Thirds */}
      <section className="relative z-50 mt-auto">
        <div className="bg-surface-container-high/95 backdrop-blur-md border-t border-primary/30 h-24 flex items-stretch shadow-2xl">
          <div className={cn(
            "px-8 flex items-center justify-center relative overflow-hidden shrink-0 transition-colors duration-500",
            isActive ? "bg-secondary" : "bg-surface-container-highest"
          )}>
            <div className="absolute inset-0 bg-white/10 skew-x-12 translate-x-4"></div>
            <span className="font-label-caps text-on-secondary-fixed text-lg font-bold tracking-widest">
              {isActive ? "LIVE" : "STANDBY"}
            </span>
          </div>
          <div className="flex-1 flex items-center px-10 overflow-hidden">
            <h2 className="font-serif text-[28px] md:text-[32px] text-white truncate">
              {currentHeadline}
            </h2>
          </div>
          <div className="hidden lg:flex flex-col justify-center px-10 border-l border-outline-variant bg-surface-container shrink-0">
            <span className="font-label-caps text-[10px] text-on-surface-variant mb-2 tracking-widest">
              {isActive ? "BROADCASTING" : "STATUS"}
            </span>
            <div className="flex items-center gap-2">
              <span className={cn("w-2 h-2 rounded-full", isActive ? "bg-secondary animate-pulse" : "bg-outline-variant")} />
              <span className="font-mono text-sm text-on-surface-variant">
                {state === "idle" ? "Ready" : state === "loading" ? "Connecting" : state === "broadcasting" ? "On Air" : state === "listening" ? "Awaiting Input" : "Processing"}
              </span>
            </div>
          </div>
        </div>

        {/* Ticker */}
        <div className="bg-background border-t border-outline-variant h-10 flex items-center overflow-hidden">
          <div className="font-mono text-xs text-on-surface-variant flex gap-16 items-center whitespace-nowrap px-4 w-full animate-[scroll-left_30s_linear_infinite]">
            {headlines.length > 0 ? (
              headlines.map((h, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className={cn("w-2 h-2 rounded-full", i === 0 ? "bg-primary" : i === 1 ? "bg-error" : "bg-secondary")} />
                  {h}
                </span>
              ))
            ) : (
              <>
                <span className="flex items-center gap-2"><span className="w-2 h-2 bg-primary rounded-full"></span> Waiting for live headlines...</span>
                <span className="flex items-center gap-2"><span className="w-2 h-2 bg-secondary rounded-full"></span> Tap the anchor to start your briefing</span>
              </>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes wave-scale {
            0%, 100% { height: 16px; }
            50% { height: 60px; }
        }
        @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 15px 2px rgba(97, 139, 255, 0.4); }
            50% { box-shadow: 0 0 30px 6px rgba(97, 139, 255, 0.7); }
        }
        @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

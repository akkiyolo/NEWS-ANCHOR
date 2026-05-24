import { useState, useEffect } from "react";
import { PlayCircle, Mic2, Save, Info, Loader2, Check, Volume2 } from "lucide-react";
import { cn } from "../lib/utils";
import { loadPreferences, savePreferences, type LanguageCode } from "../lib/store";
import { fetchTTS } from "../lib/api";

export function Settings() {
  const [prefs, setPrefs] = useState(loadPreferences());
  const [saved, setSaved] = useState(false);
  const [previewLoading, setPreviewLoading] = useState<string | null>(null);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  const languages = [
    { name: "English", code: "en" as LanguageCode, type: "International Standard", flag: "🇺🇸" },
    { name: "Hindi", code: "hi" as LanguageCode, type: "हिन्दी - Regional", flag: "🇮🇳" },
    { name: "Tamil", code: "ta" as LanguageCode, type: "தமிழ் - Southern", flag: "🇮🇳" },
    { name: "Bengali", code: "bn" as LanguageCode, type: "বাংলা - Eastern", flag: "🇮🇳" },
  ];

  const voices = [
    { name: "Deep Male", desc: "Authority & Weight", icon: Mic2 },
    { name: "Warm Female", desc: "Empathy & Insight", icon: Mic2 },
    { name: "Neutral", desc: "Pure Data Flow", icon: Mic2 },
    { name: "Regional East", desc: "Kolkata Inflection", icon: Mic2 },
    { name: "The Analyst", desc: "High-Speed Reports", icon: Mic2 },
    { name: "Cyber Voice", desc: "Digital Texture", icon: Mic2 },
  ];

  const handleSave = () => {
    savePreferences(prefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePreview = async (langCode?: LanguageCode) => {
    const previewId = langCode || prefs.language;
    if (audioRef) {
      audioRef.pause();
      audioRef.src = "";
    }

    setPreviewLoading(previewId);
    try {
      const langNames: Record<string, string> = {
        en: "Welcome to NewsAnchor AI. Your personalized news briefing is ready.",
        hi: "न्यूज़ एंकर AI में आपका स्वागत है। आपकी व्यक्तिगत समाचार ब्रीफिंग तैयार है।",
        ta: "NewsAnchor AI-க்கு வரவேற்கிறோம். உங்கள் தனிப்பயனாக்கப்பட்ட செய்தி சுருக்கம் தயாராக உள்ளது.",
        bn: "NewsAnchor AI-তে স্বাগতম। আপনার ব্যক্তিগতকৃত সংবাদ ব্রিফিং প্রস্তুত।",
      };

      const text = langNames[previewId] || langNames.en;
      const blob = await fetchTTS(text, prefs.voicePersona, previewId);
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.playbackRate = prefs.narrativeSpeed;
      await audio.play();
      setAudioRef(audio);
    } catch (err: any) {
      console.error("Preview error:", err.message);
    } finally {
      setPreviewLoading(null);
    }
  };

  return (
    <div className="px-6 py-8 max-w-[1200px] mx-auto w-full animate-in fade-in duration-700">
      <div className="mb-10">
        <h1 className="font-serif text-[36px] md:text-[48px] leading-[1.1] font-semibold text-on-background tracking-tight mb-3">
          Voice & Language Settings
        </h1>
        <p className="text-on-surface-variant font-sans text-lg">
          Customize how your AI Anchor delivers global intelligence.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column */}
        <section className="col-span-12 xl:col-span-8 space-y-12">

          {/* Broadcast Language */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-[32px] font-medium text-on-background">Broadcast Language</h2>
              <span className="bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full font-label-caps text-[10px] uppercase font-bold tracking-wider">
                4 Active Streams
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {languages.map((lang) => (
                <div
                  key={lang.code}
                  onClick={() => setPrefs({ ...prefs, language: lang.code })}
                  className={cn(
                    "rounded-xl p-6 flex flex-col justify-between cursor-pointer transition-all border",
                    prefs.language === lang.code
                      ? "bg-[#F5F5F0] border-primary border-2 shadow-md relative overflow-hidden"
                      : "bg-surface-container-highest border-outline-variant hover:border-primary/50 group"
                  )}
                >
                  {prefs.language === lang.code && (
                    <div className="absolute top-0 right-0 p-3">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                  )}
                  <div>
                    <span className="text-4xl mb-4 block">{lang.flag}</span>
                    <h3 className={cn("font-serif text-2xl font-medium", prefs.language === lang.code ? "text-black" : "text-on-background")}>
                      {lang.name}
                    </h3>
                    <p className={cn("font-label-caps text-[10px] uppercase tracking-wider mt-2", prefs.language === lang.code ? "text-slate-500" : "text-on-surface-variant")}>
                      {lang.type}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePreview(lang.code); }}
                    disabled={previewLoading === lang.code}
                    className={cn(
                      "mt-8 w-full py-2.5 border rounded-lg font-bold font-label-caps text-[10px] uppercase flex items-center justify-center gap-2 transition-colors",
                      prefs.language === lang.code
                        ? "border-slate-300 text-slate-800 hover:bg-slate-100"
                        : "border-outline-variant text-on-background hover:bg-surface-container-high group-hover:border-primary/50"
                    )}>
                    {previewLoading === lang.code ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <PlayCircle className="w-4 h-4" />
                    )}
                    Preview
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Voice Persona */}
          <div>
            <h2 className="font-serif text-[32px] font-medium text-on-background mb-6">Voice Persona</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {voices.map((voice) => (
                <button
                  key={voice.name}
                  onClick={() => setPrefs({ ...prefs, voicePersona: voice.name })}
                  className={cn(
                    "p-6 rounded-xl flex flex-col items-center text-center transition-all",
                    prefs.voicePersona === voice.name
                      ? "bg-[#F5F5F0] border-2 border-primary shadow-md relative"
                      : "bg-surface-container border border-outline-variant hover:bg-surface-container-high"
                  )}
                >
                  <div className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center mb-5",
                    prefs.voicePersona === voice.name ? "bg-primary/10" : "bg-surface-container-highest"
                  )}>
                    <voice.icon className={cn("w-8 h-8", prefs.voicePersona === voice.name ? "text-primary fill-primary" : "text-on-surface-variant")} />
                  </div>
                  <span className={cn("font-bold text-base", prefs.voicePersona === voice.name ? "text-black" : "text-on-background")}>
                    {voice.name}
                  </span>
                  <span className={cn("font-label-caps text-[10px] uppercase tracking-wider mt-1", prefs.voicePersona === voice.name ? "text-slate-500" : "text-on-surface-variant")}>
                    {voice.desc}
                  </span>

                  {prefs.voicePersona === voice.name && (
                    <div className="mt-5 flex gap-1 h-4 items-end">
                      <div className="w-1 bg-primary rounded-full h-2 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1 bg-primary rounded-full h-4 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1 bg-primary rounded-full h-3 animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                      <div className="w-1 bg-primary rounded-full h-4 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Right Column: Synthesis Controls */}
        <aside className="col-span-12 xl:col-span-4">
          <div className="bg-surface-container rounded-2xl border border-outline-variant p-8 sticky top-24">
            <h3 className="font-serif text-2xl font-medium mb-8 text-primary flex items-center gap-3">
              ⚙️ Synthesis Controls
            </h3>

            <div className="space-y-10">
              {/* Speed Slider */}
              <div>
                <div className="flex justify-between items-center mb-5">
                  <label className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant">Narrative Speed</label>
                  <span className="font-mono text-primary text-sm font-medium">{prefs.narrativeSpeed}x</span>
                </div>
                <input
                  type="range"
                  min="0.5" max="2" step="0.1"
                  value={prefs.narrativeSpeed}
                  onChange={e => setPrefs({ ...prefs, narrativeSpeed: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Pitch Visualization */}
              <div>
                <div className="flex justify-between items-center mb-5">
                  <label className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant">Emphasis / Pitch</label>
                  <span className="font-mono text-primary text-sm font-medium">Dynamic</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 h-12 items-end">
                  <div className="bg-primary/20 rounded-t w-full h-1/2"></div>
                  <div className="bg-primary/40 rounded-t w-full h-3/4"></div>
                  <div className="bg-primary rounded-t w-full h-full"></div>
                  <div className="bg-primary/60 rounded-t w-full h-4/5"></div>
                  <div className="bg-primary/30 rounded-t w-full h-1/3"></div>
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-8 border-t border-outline-variant space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-base">Auto-Translate Feed</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prefs.autoTranslate}
                      onChange={e => setPrefs({ ...prefs, autoTranslate: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-outline-variant rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base">Bias Mitigation Voice</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prefs.biasMitigationVoice}
                      onChange={e => setPrefs({ ...prefs, biasMitigationVoice: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-outline-variant rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base">Global Mute</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prefs.isMuted}
                      onChange={e => setPrefs({ ...prefs, isMuted: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-outline-variant rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  </label>
                </div>
              </div>

              {/* Accent Select */}
              <div className="pt-8 border-t border-outline-variant">
                <label className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant block mb-4">
                  Accent Nuance
                </label>
                <select
                  value={prefs.accentNuance}
                  onChange={e => setPrefs({ ...prefs, accentNuance: e.target.value })}
                  className="w-full bg-surface-container-highest border border-outline-variant text-on-background rounded-lg px-4 py-3 focus:outline-none focus:border-primary font-sans appearance-none cursor-pointer"
                >
                  <option>Standard British RP</option>
                  <option>North American Corporate</option>
                  <option>Singaporean Neutral</option>
                  <option>Australian Informative</option>
                </select>
              </div>

              <button
                onClick={handleSave}
                className={cn(
                  "w-full py-4 rounded-xl font-bold font-label-caps text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3",
                  saved
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-primary-container text-on-primary-container hover:opacity-90"
                )}
              >
                {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                {saved ? "Saved!" : "Apply Voice Profile"}
              </button>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mt-6 flex gap-4 items-start">
            <Info className="w-6 h-6 text-primary shrink-0" />
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Your voice profile is saved locally and synced across sessions. All voice previews use ElevenLabs neural synthesis for natural-sounding output.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

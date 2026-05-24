import { useState, useEffect } from "react";
import { Globe, X } from "lucide-react";
import { cn } from "../lib/utils";
import { Link } from "react-router-dom";

export function Anchor() {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeStr(new Date().toISOString().slice(11, 19) + " UTC");
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
            <span className="bg-secondary-container/20 text-secondary border border-secondary/30 px-3 py-1 rounded-full font-label-caps text-[10px] uppercase font-bold tracking-widest">
              Live Briefing
            </span>
            <span className="text-on-surface-variant font-mono text-sm">{timeStr}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
            <Globe className="w-5 h-5" />
            <span className="font-label-caps text-xs uppercase tracking-widest">Global</span>
          </button>
          <div className="w-10 h-10 rounded-full border border-outline-variant overflow-hidden">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvVtEH2z_IPf0WqJrRS-da4z1tYNoQQRxLCqYghNs5KFgbKTujdDnuCZ1OPqtq-3bFNTn6tn7j04Xg_azwmT2K2HHUFmeyUfUQIzpBCaFtclwFfx70K4j3V_xOrFL5KIhlOTSHLd8fu0MjFhDv6ek9HKUaeyXgUTixGcr5wIsKRHodsTvQ46fdt9m52ww2WN146I7t0WY0mczQlgUCsKJOJOd3B_JtxQbBBK3qytqPPEynS0GY7iSGy6oVi8Kz8xMAfn-hM320TrGu" 
              alt="User profile" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
        
        {/* Presenter Visual Wrapper */}
        <div className="relative flex flex-col items-center">
          <div className="relative w-[320px] h-[320px] md:w-[480px] md:h-[480px] rounded-full overflow-hidden border-[6px] border-primary/20 shadow-[0_0_30px_6px_rgba(97,139,255,0.4)] animate-[pulse-glow_2s_infinite_ease-in-out]">
            <img 
              className="w-full h-full object-cover scale-110 translate-y-8" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3iI-YGTVfksDI7FQrRyC9Blpig6_HnzP_a-5hd6Xaqa_zYofpFRTvTuB4LOrb0geVkKgQG-LvLy4GMIFIY99N113lSUC81SMZ83_0ovYuUnu1QA3PLIzuQRtxvreRyCDEOS1Avu2Aam5xtvTMj6la8ApBJHhp5jFSnQj5eSfB56LHn3x6UVP_4QEEbTN2zMriKVJkbhZB3vCNFBVpkSC8hVinTuGBWVCajw7h9ITHhBtFdDb2DghV6NrGxt88zTrmQAqu2bmJhLwy" 
              alt="AI Anchor" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          </div>
          
          {/* Voice Wave */}
          <div className="absolute -bottom-8 flex items-end gap-2 h-16">
            <div className="w-2.5 bg-primary rounded-full h-4 animate-[wave-scale_1.2s_infinite_ease-in-out]" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2.5 bg-primary rounded-full h-8 animate-[wave-scale_1.2s_infinite_ease-in-out]" style={{ animationDelay: '0.3s' }}></div>
            <div className="w-2.5 bg-primary rounded-full h-12 animate-[wave-scale_1.2s_infinite_ease-in-out]" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-3.5 bg-secondary rounded-full h-10 animate-[wave-scale_1.2s_infinite_ease-in-out]" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2.5 bg-primary rounded-full h-9 animate-[wave-scale_1.2s_infinite_ease-in-out]" style={{ animationDelay: '0.4s' }}></div>
            <div className="w-2.5 bg-primary rounded-full h-5 animate-[wave-scale_1.2s_infinite_ease-in-out]" style={{ animationDelay: '0.6s' }}></div>
            <div className="w-2.5 bg-primary rounded-full h-3 animate-[wave-scale_1.2s_infinite_ease-in-out]" style={{ animationDelay: '0.1s' }}></div>
          </div>
        </div>

        {/* Captions */}
        <div className="absolute bottom-40 w-full max-w-3xl px-6 text-center">
          <p className="font-serif text-[28px] md:text-[36px] text-primary-fixed leading-relaxed tracking-tight italic opacity-90 drop-shadow-md">
            "...latest reports from the Central European energy summit indicate a significant breakthrough in fusion scalability protocols, potentially halving transition costs..."
          </p>
        </div>
      </main>

      {/* Lower Thirds */}
      <section className="relative z-50 mt-auto">
        <div className="bg-surface-container-high/95 backdrop-blur-md border-t border-primary/30 h-24 flex items-stretch shadow-2xl">
          <div className="bg-secondary px-8 flex items-center justify-center relative overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-white/10 skew-x-12 translate-x-4"></div>
            <span className="font-label-caps text-on-secondary-fixed text-lg font-bold tracking-widest">BREAKING</span>
          </div>
          <div className="flex-1 flex items-center px-10 overflow-hidden">
            <h2 className="font-serif text-[32px] text-white truncate">
              Global Market Volatility Stabilizes After AI Regulation Accord
            </h2>
          </div>
          <div className="hidden lg:flex flex-col justify-center px-10 border-l border-outline-variant bg-surface-container shrink-0">
            <span className="font-label-caps text-[10px] text-on-surface-variant mb-2 tracking-widest">BIAS METER</span>
            <div className="w-40 h-2 bg-outline-variant rounded-full relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-0.5 bg-on-background/50"></div>
              <div className="absolute top-0 left-[48%] w-5 h-2 bg-secondary rounded-full shadow-[0_0_10px_rgba(255,185,85,0.8)]"></div>
            </div>
          </div>
        </div>
        
        {/* Ticker */}
        <div className="bg-background border-t border-outline-variant h-10 flex items-center overflow-hidden">
          <div className="font-mono text-xs text-on-surface-variant flex gap-16 items-center whitespace-nowrap px-4 w-full">
            <span className="flex items-center gap-2"><span className="w-2 h-2 bg-primary rounded-full"></span> TECHNOLOGY: OpenAI Pro unveils new multi-agent reasoning framework</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 bg-error rounded-full"></span> URGENT: Deep sea volcanic activity detected near Kermadec Trench</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 bg-secondary rounded-full"></span> ECONOMY: S&P 500 AI-Index hits record high </span>
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
      `}</style>
    </div>
  );
}

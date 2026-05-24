import { Play, Plus } from "lucide-react";
import { cn } from "../lib/utils";

export function Personalized() {
  return (
    <div className="px-6 py-8 max-w-[1440px] mx-auto w-full animate-in fade-in duration-700">
      {/* Header Section */}
      <section className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="font-label-caps text-primary tracking-[0.2em] mb-4 block uppercase text-xs">
            October 24, 2023
          </span>
          <h1 className="font-serif text-[36px] md:text-[48px] leading-[1.1] font-semibold text-on-background tracking-tight">
            Good Morning, Alexander
          </h1>
          <p className="text-on-surface-variant font-sans text-lg mt-3 max-w-2xl">
            Your AI Anchor has synthesized 1,402 sources into 5 critical briefings for your morning routine.
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
                className="text-primary"
                cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent"
                strokeDasharray="175.9" strokeDashoffset="70.36"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-primary font-mono text-xs font-medium">
              60%
            </div>
          </div>
          <div>
            <h4 className="font-label-caps text-xs text-on-background tracking-widest uppercase mb-1">Status</h4>
            <p className="text-sm text-on-surface-variant">3/5 topics covered</p>
          </div>
        </div>
      </section>

      {/* Interest Pills */}
      <div className="mb-10 flex flex-wrap gap-3">
        {["Tech Innovation", "Global Macro", "AI Ethics", "Fintech", "Venture Capital"].map((pill, i) => (
          <span
            key={pill}
            className={cn(
              "px-4 py-2 rounded-full border font-label-caps text-[10px] uppercase tracking-wider transition-all cursor-pointer",
              i === 0
                ? "border-primary text-primary bg-primary/10 shadow-[0_0_10px_rgba(180,197,255,0.2)]"
                : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
            )}
          >
            {pill}
          </span>
        ))}
        <button className="w-9 h-9 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant hover:text-primary">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Briefing Stack (Bento Grid) */}
      <section className="grid grid-cols-12 gap-6 pb-24">
        {/* Tech Card (Large) */}
        <div className="col-span-12 lg:col-span-8 bg-[#F5F5F0] rounded-2xl p-8 lg:p-10 border border-[#E2E8F0] shadow-sm relative group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
             <div className="w-48 h-48 border-[16px] border-black rounded-lg"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full font-label-caps text-[10px] tracking-wider uppercase font-bold">
                Tech
              </span>
              <span className="text-black/50 font-mono text-[11px] font-medium tracking-wide">
                8:42 AM • 4 MIN READ
              </span>
            </div>
            
            <h2 className="font-serif text-[32px] md:text-[36px] text-black mb-4 leading-tight font-medium">
              The Silicon Transition: Why Edge AI is Decoupling from the Cloud
            </h2>
            <p className="text-black/70 font-sans text-lg mb-10 max-w-xl">
              New architecture benchmarks suggest a 40% reduction in latency for local LLM processing, signaling a shift for enterprise mobile hardware.
            </p>
            
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-3 bg-primary text-on-primary px-6 py-3 rounded-xl font-label-caps text-xs tracking-wider uppercase hover:opacity-90 transition-all active:scale-95 font-bold shadow-md">
                <Play className="w-4 h-4 fill-current" />
                Listen to Briefing
              </button>
              <div className="flex gap-1 h-6 items-end px-2">
                <div className="w-1 bg-primary/40 rounded-full h-3 animate-[pulse_1.5s_infinite_ease-in-out]"></div>
                <div className="w-1 bg-primary/40 rounded-full h-5 animate-[pulse_2s_infinite_ease-in-out_0.2s]"></div>
                <div className="w-1 bg-primary/40 rounded-full h-4 animate-[pulse_1.8s_infinite_ease-in-out_0.4s]"></div>
                <div className="w-1 bg-primary/40 rounded-full h-6 animate-[pulse_1.2s_infinite_ease-in-out_0.1s]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Finance Card */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-[#F5F5F0] rounded-2xl p-8 border border-[#E2E8F0] shadow-sm flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="bg-secondary/10 text-secondary-container font-bold border border-secondary/20 px-3 py-1 rounded-full font-label-caps text-[10px] tracking-wider uppercase">
                Finance
              </span>
            </div>
            <h3 className="font-serif text-2xl text-black mb-6 font-medium leading-snug">
              Yield Curves & AI Sentiment
            </h3>
            <div className="h-1 w-full bg-black/5 rounded-full mb-8 overflow-hidden">
              <div className="h-full w-2/3 bg-secondary rounded-full"></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-black/50 font-mono text-[11px] font-medium tracking-wide">3 MIN LISTEN</span>
            <button className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-black/80 transition-colors shadow-md">
              <Play className="w-5 h-5 fill-current ml-1" />
            </button>
          </div>
        </div>

        {/* AI Card */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-[#F5F5F0] rounded-2xl p-8 border border-[#E2E8F0] shadow-sm flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="bg-primary/5 text-primary font-bold border border-primary/10 px-3 py-1 rounded-full font-label-caps text-[10px] tracking-wider uppercase">
                Artificial Intelligence
              </span>
            </div>
            <h3 className="font-serif text-2xl text-black mb-4 font-medium leading-snug">
              Neural Architecture Search Efficiency
            </h3>
            <p className="text-black/60 text-base line-clamp-3 mb-8">
              How automated model design is beating human engineering in power-constrained environments with low latency requirements.
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-black/50 font-mono text-[11px] font-medium tracking-wide">5 MIN LISTEN</span>
            <button className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-black/80 transition-colors shadow-md">
              <Play className="w-5 h-5 fill-current ml-1" />
            </button>
          </div>
        </div>

        {/* Global/Sports Row Shared Column */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Global Card */}
          <div className="bg-[#F5F5F0] rounded-2xl p-8 border border-[#E2E8F0] shadow-sm flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="bg-tertiary-container/10 text-tertiary-container font-bold border border-tertiary-container/20 px-3 py-1 rounded-full font-label-caps text-[10px] tracking-wider uppercase">
                  Global
                </span>
              </div>
              <h3 className="font-serif text-2xl text-black font-medium leading-snug">
                Supply Chain Shifts in SE Asia
              </h3>
            </div>
            <div className="flex items-center justify-between mt-12">
              <span className="text-black/50 font-mono text-[11px] font-medium tracking-wide">2 MIN LISTEN</span>
              <button className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-black/80 transition-colors shadow-md">
                <Play className="w-5 h-5 fill-current ml-1" />
              </button>
            </div>
          </div>

          {/* Sports Card */}
          <div 
            className="bg-[#F5F5F0] rounded-2xl p-8 border border-[#E2E8F0] shadow-sm flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-lg relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/90 to-white/50 z-0"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <span className="bg-black/5 text-black font-bold border border-black/10 px-3 py-1 rounded-full font-label-caps text-[10px] tracking-wider uppercase">
                  Sports Data
                </span>
              </div>
              <h3 className="font-serif text-2xl text-black font-medium leading-snug">
                Predictive Draft Analysis
              </h3>
            </div>
            <div className="flex items-center justify-between mt-12 relative z-10">
              <span className="text-black/50 font-mono text-[11px] font-medium tracking-wide">4 MIN LISTEN</span>
              <button className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-black/80 transition-colors shadow-md">
                <Play className="w-5 h-5 fill-current ml-1" />
              </button>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

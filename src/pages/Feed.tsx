import { Globe, MoreVertical, Share2, Headphones, Bookmark, TrendingUp, Radar, PieChart } from "lucide-react";
import { cn } from "../lib/utils";

export function Feed() {
  return (
    <div className="px-6 py-8 max-w-[1440px] mx-auto w-full animate-in fade-in duration-700">
      <div className="mb-10 flex flex-col justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
             <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border border-primary/20">
               Live Intelligence
             </span>
             <span className="text-on-surface-variant text-sm flex items-center gap-1 font-mono">
               Updated 2m ago
             </span>
          </div>
          <h1 className="font-serif text-[36px] md:text-[48px] leading-[1.1] font-semibold text-on-background tracking-tight mb-2">
            Bias Analysis Dashboard
          </h1>
          <p className="text-on-surface-variant font-sans text-lg max-w-3xl">
            Deep-learning analysis of global news narratives concerning the "Renewable Grid Initiative". Highlighting systematic deviations and sentiment volatility across 142 detected sources.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
        {/* Metric Cards */}
        <div className="md:col-span-4 bg-[#F5F5F0] border border-[#E2E8F0] shadow-sm p-6 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-caps text-[10px] uppercase text-black/60 font-bold tracking-widest">Fake News Score</h3>
          </div>
          <div className="flex items-end gap-2">
            <span className="font-mono text-4xl text-black">12.4</span>
            <span className="text-black/60 text-sm mb-1 uppercase tracking-wide">% Confidence</span>
          </div>
          <div className="mt-4 w-full bg-black/10 h-1.5 rounded-full overflow-hidden">
            <div className="bg-secondary h-full" style={{ width: '12.4%' }}></div>
          </div>
          <p className="text-xs text-black/50 mt-4 italic">Low systemic misinformation detected.</p>
        </div>

        <div className="md:col-span-4 bg-[#F5F5F0] border border-[#E2E8F0] shadow-sm p-6 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-caps text-[10px] uppercase text-black/60 font-bold tracking-widest">Contradiction Flags</h3>
          </div>
          <div className="flex items-end gap-2">
            <span className="font-mono text-4xl text-black">07</span>
            <span className="text-black/60 text-sm mb-1 uppercase tracking-wide">Active Collisions</span>
          </div>
          <p className="text-xs text-black/50 mt-8 italic">Significant factual discrepancy in budget reporting.</p>
        </div>

        <div className="md:col-span-4 bg-primary/5 border border-primary/30 shadow-sm p-6 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-caps text-[10px] uppercase text-primary font-bold tracking-widest">Source Credibility</h3>
          </div>
          <div className="flex items-end gap-2">
             <span className="font-mono text-4xl text-black dark:text-white">High</span>
          </div>
          <div className="flex gap-1.5 mt-5">
             <div className="h-2 w-full bg-primary rounded-sm"></div>
             <div className="h-2 w-full bg-primary rounded-sm"></div>
             <div className="h-2 w-full bg-primary rounded-sm"></div>
             <div className="h-2 w-full bg-black/20 dark:bg-white/20 rounded-sm"></div>
          </div>
          <p className="text-xs text-on-surface-variant mt-4 italic">Aggregated score based on 5 historical cycles.</p>
        </div>

        {/* Bias Spectrum */}
        <div className="md:col-span-8 bg-[#F5F5F0] border border-[#E2E8F0] p-8 rounded-xl">
           <div className="flex justify-between items-center mb-10">
             <h3 className="font-serif text-2xl text-black font-medium">Horizontal Bias Spectrum</h3>
             <span className="bg-black/10 px-3 py-1 rounded text-[10px] font-bold text-black/60">AVG: -0.12 (Neutral)</span>
           </div>
           
           <div className="relative py-12">
             <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-slate-300 to-red-600 rounded-full"></div>
             <div className="absolute top-2 left-0 w-full flex justify-between px-2 text-[10px] font-bold text-black/50 tracking-widest">
                <span>FAR LEFT</span>
                <span>NEUTRAL</span>
                <span>FAR RIGHT</span>
             </div>
             <div className="absolute top-1/2 left-[45%] -translate-y-1/2 group">
                <div className="w-5 h-5 bg-white border-2 border-primary rounded-full shadow-lg cursor-pointer transform hover:scale-125 transition-transform z-10 relative"></div>
             </div>
             <div className="absolute top-1/2 left-[20%] -translate-y-1/2 w-3 h-3 bg-primary/40 rounded-full"></div>
             <div className="absolute top-1/2 left-[75%] -translate-y-1/2 w-3 h-3 bg-primary/40 rounded-full"></div>
           </div>
           
           <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-black/10">
              <div className="text-center">
                 <p className="text-[10px] text-black/50 font-bold mb-1 tracking-widest">DENSITY</p>
                 <p className="font-mono text-black">Moderate</p>
              </div>
              <div className="text-center">
                 <p className="text-[10px] text-black/50 font-bold mb-1 tracking-widest">STABILITY</p>
                 <p className="font-mono text-black">84%</p>
              </div>
              <div className="text-center">
                 <p className="text-[10px] text-black/50 font-bold mb-1 tracking-widest">OUTLIERS</p>
                 <p className="font-mono text-black">12</p>
              </div>
           </div>
        </div>

        {/* Source Distribution */}
        <div className="md:col-span-4 bg-surface-container border border-outline-variant p-6 rounded-xl">
           <h4 className="font-serif text-2xl text-on-background mb-6 flex items-center gap-2">
             <PieChart className="w-5 h-5 text-primary" /> Source Distribution
           </h4>
           <div className="flex justify-center mb-6 relative">
              <svg className="w-40 h-40 transform -rotate-90">
                 <circle className="text-surface-variant" cx="80" cy="80" fill="transparent" r="70" strokeWidth="12" stroke="currentColor"></circle>
                 <circle className="text-primary" cx="80" cy="80" fill="transparent" r="70" strokeWidth="12" strokeDasharray="440" strokeDashoffset="110" stroke="currentColor"></circle>
                 <circle className="text-secondary" cx="80" cy="80" fill="transparent" r="70" strokeWidth="12" strokeDasharray="440" strokeDashoffset="330" stroke="currentColor"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="font-mono text-[32px]">42</span>
                 <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">Sources</span>
              </div>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                 <span className="w-3 h-3 rounded-sm bg-primary"></span>
                 <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Neutral (65%)</span>
              </div>
              <div className="flex items-center gap-2">
                 <span className="w-3 h-3 rounded-sm bg-secondary"></span>
                 <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Center-Right (20%)</span>
              </div>
           </div>
        </div>
      </div>

      <div className="columns-1 md:columns-2 gap-6 space-y-6">
        <article className="break-inside-avoid bg-[#F5F5F0] rounded-2xl border border-black/10 overflow-hidden shadow-sm group">
          <div className="relative">
            <img 
               className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700" 
               src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop" 
               alt="Tech" 
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded text-black text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm">
               <span className="w-2 h-2 rounded-full bg-blue-500"></span> Verified Source
            </div>
          </div>
          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
               <span className="font-label-caps text-[10px] text-black/50 tracking-widest">TECH • 12 MINS AGO</span>
               <MoreVertical className="w-5 h-5 text-black/40" />
            </div>
            <h3 className="font-serif text-[28px] text-black mb-6 leading-tight">The Silicon Valley Paradox: Why AI hardware is outpacing software innovation</h3>
            
            <div className="mb-8">
               <p className="font-label-caps text-[10px] text-black/50 mb-2 tracking-widest">ANALYZED BIAS: NEUTRAL</p>
               <div className="h-1.5 w-full bg-black/10 rounded-full relative">
                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-white z-10"></div>
                  <div className="absolute inset-y-0 left-[48%] right-[48%] bg-primary rounded-full"></div>
               </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-black/10">
               <div className="flex gap-5">
                  <Share2 className="w-5 h-5 text-black/60 hover:text-primary transition-colors cursor-pointer" />
                  <Headphones className="w-5 h-5 text-black/60 hover:text-primary transition-colors cursor-pointer" />
               </div>
               <button className="text-primary font-bold text-sm tracking-wider uppercase">Read Analysis</button>
            </div>
          </div>
        </article>

        <article className="break-inside-avoid bg-[#F5F5F0] rounded-2xl border border-black/10 p-8 shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                 <span className="font-label-caps text-[10px] text-black/50 uppercase tracking-widest">Breaking Finance</span>
              </div>
              <MoreVertical className="w-5 h-5 text-black/40" />
           </div>
           
           <h3 className="font-serif text-[28px] text-black mb-4 leading-tight">Central Banks signal a pivot toward algorithmic interest rate management</h3>
           <p className="text-black/70 text-lg mb-8 leading-relaxed">
             Global financial leaders are increasingly turning to real-time data modeling to determine fiscal policy, marking a departure from traditional quarterly assessments...
           </p>

           <div className="mb-8 p-4 bg-black/5 rounded-xl">
             <div className="flex items-center justify-between mb-3">
               <span className="font-label-caps text-[10px] text-black/50 tracking-widest">AI CONFIDENCE SCORE</span>
               <span className="font-mono text-sm font-bold text-primary">94%</span>
             </div>
             <div className="h-1.5 bg-black/10 rounded-full overflow-hidden">
               <div className="h-full bg-primary" style={{ width: '94%' }}></div>
             </div>
           </div>

           <div className="flex items-center justify-between pt-6 border-t border-black/10">
               <div className="flex gap-5">
                  <Share2 className="w-5 h-5 text-black/60 hover:text-primary transition-colors cursor-pointer" />
                  <Bookmark className="w-5 h-5 text-black/60 hover:text-primary transition-colors cursor-pointer" />
               </div>
               <button className="text-primary font-bold text-sm tracking-wider uppercase">View Source Tree</button>
            </div>
        </article>
      </div>

    </div>
  );
}

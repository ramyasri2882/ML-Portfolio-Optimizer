import React from 'react';

export default function FinanceBackground() {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#020817] pointer-events-none overflow-hidden">
      
      {/* 1. Base Subtle Financial Grid */}
      <div className="absolute inset-0 opacity-20" 
           style={{
             backgroundImage: `
               linear-gradient(to right, #06B6D4 1px, transparent 1px),
               linear-gradient(to bottom, #06B6D4 1px, transparent 1px)
             `,
             backgroundSize: '40px 40px'
           }} 
      />
      
      {/* 2. Candlestick Charts (25-35% opacity) */}
      <div className="absolute left-[8%] top-[15%] opacity-30 text-[#00D084] scale-[2.5]">
        <svg width="40" height="120" viewBox="0 0 40 120" fill="none">
          <rect x="19" y="10" width="2" height="100" fill="currentColor" />
          <rect x="10" y="30" width="20" height="50" fill="currentColor" />
        </svg>
      </div>
      <div className="absolute left-[14%] top-[28%] opacity-[0.35] text-[#00D084] scale-[2.5]">
        <svg width="40" height="120" viewBox="0 0 40 120" fill="none">
          <rect x="19" y="20" width="2" height="80" fill="currentColor" />
          <rect x="10" y="40" width="20" height="30" fill="currentColor" />
        </svg>
      </div>
      <div className="absolute left-[20%] top-[10%] opacity-30 text-[#FF1744] scale-[2.5]">
        <svg width="40" height="120" viewBox="0 0 40 120" fill="none">
          <rect x="19" y="30" width="2" height="80" fill="currentColor" />
          <rect x="10" y="50" width="20" height="60" fill="currentColor" />
        </svg>
      </div>

      <div className="absolute right-[22%] bottom-[15%] opacity-[0.35] text-[#FF1744] scale-[2.5]">
        <svg width="40" height="120" viewBox="0 0 40 120" fill="none">
          <rect x="19" y="10" width="2" height="90" fill="currentColor" />
          <rect x="10" y="20" width="20" height="60" fill="currentColor" />
        </svg>
      </div>
      <div className="absolute right-[16%] bottom-[30%] opacity-30 text-[#00D084] scale-[2.5]">
        <svg width="40" height="120" viewBox="0 0 40 120" fill="none">
          <rect x="19" y="30" width="2" height="70" fill="currentColor" />
          <rect x="10" y="40" width="20" height="40" fill="currentColor" />
        </svg>
      </div>
      <div className="absolute right-[10%] bottom-[20%] opacity-[0.35] text-[#FF1744] scale-[2.5]">
        <svg width="40" height="120" viewBox="0 0 40 120" fill="none">
          <rect x="19" y="40" width="2" height="60" fill="currentColor" />
          <rect x="10" y="60" width="20" height="30" fill="currentColor" />
        </svg>
      </div>

      {/* 3. Stock Price Line Charts & Thin Graphs */}
      <svg className="absolute bottom-0 left-0 w-full h-[45vh] opacity-[0.25] text-[#2563EB] preserve-3d" viewBox="0 0 1000 500" preserveAspectRatio="none">
        <path d="M0,500 L0,350 Q100,400 200,300 T400,280 T600,220 T800,150 T1000,100 L1000,500 Z" fill="url(#gradGraph)" />
        <path d="M0,350 Q100,400 200,300 T400,280 T600,220 T800,150 T1000,100" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
        <defs>
          <linearGradient id="gradGraph" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      
      <svg className="absolute top-[10%] right-[5%] w-[45vw] h-[30vh] opacity-[0.35] text-[#8B5CF6]" viewBox="0 0 500 200" preserveAspectRatio="none">
        <path d="M0,150 L50,120 L100,140 L150,90 L200,110 L250,60 L300,70 L350,30 L400,50 L450,20 L500,40" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
        <path d="M0,180 L100,150 L200,170 L300,100 L400,120 L500,70" stroke="#06B6D4" strokeWidth="1" strokeDasharray="5 5" fill="none" />
      </svg>

      {/* 4. Small Bar Charts & Pie Charts */}
      <svg className="absolute top-[40%] right-[35%] w-[120px] h-[80px] opacity-30" viewBox="0 0 120 80" fill="none">
        <rect x="0" y="50" width="10" height="30" fill="#00D084" />
        <rect x="15" y="30" width="10" height="50" fill="#00D084" />
        <rect x="30" y="10" width="10" height="70" fill="#00D084" />
        <rect x="45" y="40" width="10" height="40" fill="#FF1744" />
        <rect x="60" y="20" width="10" height="60" fill="#06B6D4" />
        <rect x="75" y="60" width="10" height="20" fill="#FF1744" />
        <rect x="90" y="15" width="10" height="65" fill="#00D084" />
      </svg>
      
      <svg className="absolute top-[25%] left-[30%] w-[80px] h-[80px] opacity-30" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#7C3AED" strokeWidth="8" strokeDasharray="180 80" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="#06B6D4" strokeWidth="8" strokeDasharray="60 200" strokeDashoffset="-180" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="#00D084" strokeWidth="8" strokeDasharray="10 240" strokeDashoffset="-240" />
      </svg>
      
      <svg className="absolute bottom-[20%] left-[10%] w-[100px] h-[100px] opacity-[0.25] text-[#06B6D4]" viewBox="0 0 100 100" stroke="currentColor" strokeWidth="2" fill="none">
        <circle cx="50" cy="50" r="40" strokeDasharray="4 4" />
        <line x1="10" y1="50" x2="40" y2="50" />
        <line x1="60" y1="50" x2="90" y2="50" />
        <line x1="50" y1="10" x2="50" y2="40" />
        <line x1="50" y1="60" x2="50" y2="90" />
        <circle cx="50" cy="50" r="2" fill="currentColor" />
      </svg>

      {/* 5. Faint World Financial Market/Map Patterns */}
      <svg className="absolute top-[10%] left-[5%] w-[90vw] h-[80vh] opacity-[0.10] text-[#2563EB]" viewBox="0 0 1000 500">
        <pattern id="dotGrid" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
        </pattern>
        <path d="M150,150 Q200,100 300,120 T400,150 T450,200 T500,150 T600,180 T700,150 T800,200 T850,250 T800,350 T750,400 T650,380 T550,450 T450,400 T350,420 T250,380 T150,350 T100,250 Z" fill="url(#dotGrid)" />
        <path d="M600,100 Q650,50 750,80 T850,100 T900,150 T850,180 T750,160 T650,120 Z" fill="url(#dotGrid)" />
      </svg>

      {/* 6. Financial Symbols (₹, $, €, %, ↑, ↓) & Market Numbers (30-45% Opacity) */}
      <div className="absolute inset-0 font-mono font-bold select-none overflow-hidden">
        
        {/* Large Currency & Math Symbols */}
        <div className="absolute top-[12%] left-[45%] text-4xl text-[#06B6D4] opacity-40">₹</div>
        <div className="absolute top-[55%] right-[25%] text-5xl text-[#00D084] opacity-35">$</div>
        <div className="absolute top-[75%] left-[20%] text-3xl text-[#8B5CF6] opacity-45">€</div>
        <div className="absolute bottom-[15%] right-[45%] text-4xl text-[#06B6D4] opacity-[0.35]">%</div>
        <div className="absolute top-[35%] left-[55%] text-3xl text-[#FF1744] opacity-[0.35]">%</div>
        
        {/* Directional Arrows */}
        <div className="absolute top-[65%] left-[12%] text-2xl text-[#00D084] opacity-45">↑</div>
        <div className="absolute top-[22%] right-[12%] text-2xl text-[#FF1744] opacity-45">↓</div>
        <div className="absolute bottom-[35%] left-[40%] text-3xl text-[#00D084] opacity-40">↑</div>

        {/* Distributed Market Numbers & Percentages */}
        <div className="absolute top-[20%] right-[30%] text-base text-[#00D084] opacity-45">+2.45%</div>
        <div className="absolute bottom-[35%] left-[25%] text-base text-[#FF1744] opacity-[0.35]">-0.55%</div>
        <div className="absolute top-[48%] left-[12%] text-sm text-[#06B6D4] opacity-40">14.8%</div>
        <div className="absolute bottom-[22%] right-[32%] text-sm text-[#8B5CF6] opacity-[0.45]">11.2%</div>
        <div className="absolute top-[65%] left-[32%] text-base text-[#00D084] opacity-35">+1.25%</div>
        <div className="absolute top-[15%] left-[65%] text-base text-[#FF1744] opacity-40">-1.38%</div>
        <div className="absolute top-[45%] right-[15%] text-sm text-[#06B6D4] opacity-[0.35]">22.13</div>
        <div className="absolute bottom-[45%] left-[8%] text-sm text-[#8B5CF6] opacity-40">28.75</div>
        <div className="absolute top-[85%] right-[22%] text-sm text-[#06B6D4] opacity-45">1.85</div>
        
        {/* Tiny Numerical Market-Data Streams */}
        <div className="absolute top-[5%] left-[2%] opacity-[0.35] text-[10px] text-[#06B6D4] flex flex-col gap-1 tracking-widest">
          <span>TKR    PRICE      VOL</span>
          <span>---    ------     ---</span>
          <span>NFTY   24500.20   1.2M</span>
          <span>BNKF   51200.50   0.8M</span>
          <span>RELI   2980.15    4.5M</span>
        </div>

        <div className="absolute bottom-[8%] right-[2%] opacity-[0.35] text-[10px] text-[#7C3AED] flex flex-col gap-1 tracking-widest text-right">
          <span>SYS_LOG // QUANT_TERM</span>
          <span>&gt; COVAR_MAT_CALC: OK</span>
          <span>&gt; BOUNDS: RESOLVED</span>
          <span>&gt; SR_MAX: 1.85</span>
          <span>&gt; VOL_MIN: 11.24%</span>
          <span>&gt; STATUS: CONSTRUCTED</span>
        </div>
      </div>

    </div>
  );
}

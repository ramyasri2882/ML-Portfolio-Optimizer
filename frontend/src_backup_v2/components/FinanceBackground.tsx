export default function FinanceBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#050b14]">
      {/* Subtle Financial Grid / Graph Paper */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #4f46e5 1px, transparent 1px),
            linear-gradient(to bottom, #4f46e5 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Neon Glow Highlights */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[100px]" />
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-cyan-600/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[10%] right-[10%] w-[25%] h-[25%] bg-emerald-600/10 rounded-full blur-[100px]" />

      {/* Scattered Financial Symbols & Charts */}
      <div className="absolute inset-0 opacity-[0.04] text-white font-mono text-xl md:text-2xl font-bold select-none">
        
        {/* Currencies & Math Symbols */}
        <div className="absolute top-[12%] left-[12%]">₹</div>
        <div className="absolute top-[22%] right-[18%]">$</div>
        <div className="absolute top-[48%] left-[22%]">%</div>
        <div className="absolute top-[68%] right-[28%]">€</div>
        <div className="absolute top-[82%] left-[14%]">↑</div>
        <div className="absolute bottom-[18%] right-[12%]">↓</div>
        <div className="absolute top-[35%] left-[8%] text-sm">∑</div>
        <div className="absolute bottom-[40%] right-[8%] text-sm">ƒ(x)</div>

        {/* Abstract mini charts (SVGs) */}
        {/* Line Chart */}
        <svg className="absolute top-[38%] left-[78%] w-16 h-16 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 3v18h18" />
          <path d="M7 14l4-4 4 4 6-6" />
        </svg>

        {/* Bar Chart */}
        <svg className="absolute top-[75%] left-[25%] w-20 h-20 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="4" y="14" width="4" height="6" />
          <rect x="10" y="8" width="4" height="12" />
          <rect x="16" y="4" width="4" height="16" />
          <path d="M2 22h20" />
        </svg>

        {/* Coin/Dollar symbol */}
        <svg className="absolute top-[15%] left-[45%] w-12 h-12 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8" />
          <path d="M10 10h4" />
          <path d="M10 14h4" />
        </svg>

        {/* Pie Chart */}
        <svg className="absolute top-[52%] left-[6%] w-16 h-16 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
          <path d="M22 12A10 10 0 0 0 12 2v10z" />
        </svg>
        
        {/* Candlestick 1 */}
        <div className="absolute top-[22%] left-[32%] w-[2px] h-10 bg-current">
          <div className="absolute top-2 -left-1 w-2.5 h-5 border border-current bg-transparent"></div>
        </div>
        
        {/* Candlestick 2 */}
        <div className="absolute bottom-[28%] right-[32%] w-[2px] h-12 bg-current">
          <div className="absolute top-3 -left-[5px] w-3 h-6 border border-current bg-transparent"></div>
        </div>

        {/* Candlestick 3 */}
        <div className="absolute top-[65%] left-[42%] w-[2px] h-8 bg-current">
          <div className="absolute top-1 -left-[3px] w-2 h-4 border border-current bg-transparent"></div>
        </div>
        
        {/* Additional scatter text */}
        <div className="absolute top-[85%] right-[42%] text-xs tracking-[0.2em] opacity-70">AI-QUANT</div>
        <div className="absolute top-[8%] right-[38%] text-xs tracking-[0.2em] opacity-70">ML-OPTIMIZED</div>
        <div className="absolute bottom-[12%] left-[45%] text-[10px] tracking-[0.3em] opacity-60">PORTFOLIO.V2</div>

      </div>
    </div>
  );
}

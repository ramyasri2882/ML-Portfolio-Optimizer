import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Activity, ShieldAlert, Target, Play, BarChart2, PieChart, ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';
import { useUser } from '../App';

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [stocks, setStocks] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/stocks')
      .then(res => res.json())
      .then(data => setStocks(data));
  }, []);
  
  const portfolios = currentUser.portfolios || [];
  const latestPortfolio = portfolios.length > 0 ? portfolios[portfolios.length - 1] : null;
  const backtest = latestPortfolio?.backtest;
  
  const expReturn = latestPortfolio ? (latestPortfolio.expectedReturn || 0).toFixed(2) + '%' : 'N/A';
  const risk = latestPortfolio ? (latestPortfolio.risk || 0).toFixed(2) + '%' : 'N/A';
  const sharpe = backtest ? (backtest.sharpe_ratio || 0).toFixed(2) : (latestPortfolio ? (latestPortfolio.sharpeRatio || 0).toFixed(2) : 'N/A');
  const maxDd = backtest ? '-' + (backtest.max_drawdown || 0).toFixed(2) + '%' : 'N/A';

  const kpis = [
    { label: 'Portfolio Expected Return', value: expReturn, trend: '+2.1%', isPositive: true, icon: TrendingUp, color: 'text-emerald-400', shadowColor: 'rgba(0,255,102,0.5)', glowBorder: 'hover:border-emerald-500/50', glowShadow: 'hover:shadow-[0_0_30px_rgba(0,255,102,0.15)]', sparkline: 'M0 20 Q 10 10, 20 15 T 40 5 T 60 10 T 80 0 T 100 5' },
    { label: 'Portfolio Risk (Vol.)', value: risk, trend: '-0.5%', isPositive: true, icon: ShieldAlert, color: 'text-[#00f0ff]', shadowColor: 'rgba(0,240,255,0.5)', glowBorder: 'hover:border-cyan-400/50', glowShadow: 'hover:shadow-[0_0_30px_rgba(0,240,255,0.15)]', sparkline: 'M0 15 Q 20 5, 40 10 T 80 15 T 100 10' },
    { label: 'Sharpe Ratio', value: sharpe, trend: '+0.15', isPositive: true, icon: Target, color: 'text-purple-400', shadowColor: 'rgba(138,43,226,0.5)', glowBorder: 'hover:border-purple-400/50', glowShadow: 'hover:shadow-[0_0_30px_rgba(138,43,226,0.15)]', sparkline: 'M0 25 Q 15 15, 30 20 T 60 10 T 90 15 T 100 5' },
    { label: 'Maximum Drawdown', value: maxDd, trend: '-1.2%', isPositive: false, icon: Activity, color: 'text-rose-400', shadowColor: 'rgba(255,0,60,0.5)', glowBorder: 'hover:border-rose-400/50', glowShadow: 'hover:shadow-[0_0_30px_rgba(255,0,60,0.15)]', sparkline: 'M0 5 Q 20 15, 40 10 T 70 25 T 100 20' },
  ];

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00ffff]"></span>
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">System Active</span>
          </div>
          <h2 className="text-3xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] tracking-tight">Portfolio Terminal</h2>
          <p className="text-slate-400 text-sm mt-1 font-mono tracking-wide">AI-Optimized Quantitative Strategy Engine</p>
        </div>
        <button 
          onClick={() => navigate('/optimizer')}
          className="px-6 py-3 bg-[#020817]/80 glass-card neon-border hover:neon-border-hover text-cyan-400 font-bold rounded-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 w-fit relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <Play className="w-4 h-4 fill-cyan-400/20 group-hover:fill-cyan-400" />
          <span className="tracking-wide">INITIATE OPTIMIZER</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className={cn("glass-card p-5 rounded-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group cursor-default", kpi.glowBorder, kpi.glowShadow)}>
            {/* Background Glow */}
            <div className={cn("absolute -top-10 -right-10 w-24 h-24 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity")} style={{ backgroundColor: kpi.shadowColor }}></div>
            
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="p-2.5 rounded-xl bg-[#020817]/60 border border-slate-800 shadow-inner group-hover:border-cyan-900/50 transition-colors">
                <kpi.icon className={cn("w-5 h-5 drop-shadow-[0_0_8px_currentColor]", kpi.color)} />
              </div>
              <div className={cn("flex items-center text-xs font-bold px-2.5 py-1 rounded-md backdrop-blur-md border shadow-lg font-mono", kpi.isPositive ? "text-emerald-400 bg-emerald-950/30 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]" : "text-rose-400 bg-rose-950/30 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.15)]")}>
                {kpi.isPositive ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                {kpi.trend}
              </div>
            </div>
            
            <div className="relative z-10">
              <p className="text-xs text-slate-400 font-medium mb-1.5 tracking-wide uppercase">{kpi.label}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-bold text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]">{kpi.value}</h3>
                
                {/* Mini Sparkline */}
                <svg className={cn("w-16 h-8 opacity-60 group-hover:opacity-100 transition-opacity", kpi.color)} viewBox="0 0 100 30" preserveAspectRatio="none">
                  <path d={kpi.sparkline} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_5px_currentColor]" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Market Overview */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between border-b border-cyan-900/30 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400 animate-pulse-slow" />
              <h3 className="text-lg font-bold text-white tracking-wide">Market Overview</h3>
            </div>
            <Link to="/stocks" className="text-xs font-bold font-mono text-cyan-400 hover:text-cyan-300 hover:drop-shadow-[0_0_5px_rgba(0,255,255,0.8)] transition-all flex items-center">
              VIEW_ALL_STOCKS <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stocks.slice(0, 6).map((stock, idx) => (
              <Link 
                key={stock.symbol} 
                to={`/stocks/${stock.symbol}`}
                className="glass-card p-4 rounded-xl hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors tracking-tight">{stock.symbol}</h4>
                    <p className="text-[10px] text-slate-400 truncate w-32 uppercase tracking-wider">{stock.name}</p>
                  </div>
                  <div className={cn("flex items-center text-xs font-bold px-2 py-1 rounded bg-[#020817]/50 border", stock.dailyReturn >= 0 ? "text-emerald-400 border-emerald-900/50 group-hover:border-emerald-500/30 group-hover:shadow-[0_0_10px_rgba(16,185,129,0.2)]" : "text-rose-400 border-rose-900/50 group-hover:border-rose-500/30 group-hover:shadow-[0_0_10px_rgba(244,63,94,0.2)]")}>
                    {stock.dailyReturn >= 0 ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                    {Math.abs(stock.dailyReturn).toFixed(2)}%
                  </div>
                </div>
                
                <div className="flex items-end justify-between mt-2">
                  <div className="text-xl font-mono font-bold text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                    <span className="text-slate-500 mr-1 text-sm">₹</span>
                    {stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  
                  {/* Fake sparkline for visual effect */}
                  <svg className={cn("w-14 h-6 opacity-40 group-hover:opacity-80 transition-opacity", stock.dailyReturn >= 0 ? "text-emerald-500" : "text-rose-500")} viewBox="0 0 50 20" preserveAspectRatio="none">
                    <path d={stock.dailyReturn >= 0 ? "M0 15 Q10 10 20 12 T40 5 T50 0" : "M0 0 Q10 5 20 8 T40 15 T50 20"} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="drop-shadow-[0_0_3px_currentColor]" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 border-b border-cyan-900/30 pb-3">
            <Target className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white tracking-wide">Command Center</h3>
          </div>
          
          <div className="glass-card rounded-2xl overflow-hidden flex flex-col">
            <Link to="/stocks" className="flex items-center justify-between p-4 hover:bg-cyan-950/30 transition-all border-b border-cyan-900/30 group">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-[#020817]/80 rounded-lg text-cyan-400 border border-cyan-900/50 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all">
                  <BarChart2 className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_#00ffff]" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm group-hover:text-cyan-100 transition-colors">Analyze Stocks</h4>
                  <p className="text-[10px] text-slate-400 font-mono tracking-wide uppercase">Historical data & metrics</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors group-hover:translate-x-1" />
            </Link>
            
            <Link to="/ml-prediction" className="flex items-center justify-between p-4 hover:bg-purple-950/30 transition-all border-b border-cyan-900/30 group">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-[#020817]/80 rounded-lg text-purple-400 border border-purple-900/50 group-hover:border-purple-400/50 group-hover:shadow-[0_0_15px_rgba(138,43,226,0.2)] transition-all">
                  <Target className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_#8a2be2]" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm group-hover:text-purple-100 transition-colors">Run ML Prediction</h4>
                  <p className="text-[10px] text-slate-400 font-mono tracking-wide uppercase">Forecast expected returns</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors group-hover:translate-x-1" />
            </Link>
            
            <Link to="/optimizer" className="flex items-center justify-between p-4 hover:bg-emerald-950/30 transition-all border-b border-cyan-900/30 group">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-[#020817]/80 rounded-lg text-emerald-400 border border-emerald-900/50 group-hover:border-emerald-400/50 group-hover:shadow-[0_0_15px_rgba(0,255,102,0.2)] transition-all">
                  <PieChart className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_#00ff66]" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm group-hover:text-emerald-100 transition-colors">Optimize Portfolio</h4>
                  <p className="text-[10px] text-slate-400 font-mono tracking-wide uppercase">Build risk-aware allocation</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 transition-colors group-hover:translate-x-1" />
            </Link>
            
            <Link to="/backtesting" className="flex items-center justify-between p-4 hover:bg-blue-950/30 transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-[#020817]/80 rounded-lg text-blue-400 border border-blue-900/50 group-hover:border-blue-400/50 group-hover:shadow-[0_0_15px_rgba(0,191,255,0.2)] transition-all">
                  <Activity className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_#00bfff]" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm group-hover:text-blue-100 transition-colors">View Backtest</h4>
                  <p className="text-[10px] text-slate-400 font-mono tracking-wide uppercase">Evaluate historical perf</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Activity, ShieldAlert, Target, Play, BarChart2, PieChart } from 'lucide-react';
import { cn } from '../utils/cn';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/stocks')
      .then(res => res.json())
      .then(data => setStocks(data));
  }, []);
  
  const kpis = [
    { label: 'Portfolio Expected Return', value: '14.8%', trend: '+2.1%', isPositive: true, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-950/40 border border-emerald-500/30' },
    { label: 'Portfolio Risk (Vol.)', value: '11.2%', trend: '-0.5%', isPositive: true, icon: ShieldAlert, color: 'text-blue-600', bg: 'bg-blue-950/40 border border-blue-500/30' },
    { label: 'Sharpe Ratio', value: '1.85', trend: '+0.15', isPositive: true, icon: Target, color: 'text-purple-600', bg: 'bg-purple-950/40 border border-purple-500/30' },
    { label: 'Maximum Drawdown', value: '-8.4%', trend: '-1.2%', isPositive: false, icon: Activity, color: 'text-rose-600', bg: 'bg-rose-950/40 border border-rose-500/30' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Portfolio Dashboard</h2>
          <p className="text-slate-400">Analyze stocks, predict returns and build an optimized portfolio.</p>
        </div>
        <button 
          onClick={() => navigate('/optimizer')}
          className="px-5 py-2.5 bg-slate-900 border border-indigo-500/50 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/50 font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 w-fit shadow-md shadow-primary-500/20"
        >
          <Play className="w-4 h-4" />
          Start Portfolio Analysis
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-slate-900/40 backdrop-blur-xl p-5 rounded-2xl border border-indigo-500/20 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(79,70,229,0.2)] hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
              <div className={cn("p-2 rounded-lg", kpi.bg)}>
                <kpi.icon className={cn("w-5 h-5", kpi.color)} />
              </div>
              <div className={cn("flex items-center text-xs font-semibold px-2 py-1 rounded-full", kpi.isPositive ? "text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]" : "text-rose-400 bg-rose-950/40 border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.1)]")}>
                {kpi.isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {kpi.trend}
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-400 font-medium mb-1">{kpi.label}</p>
              <h3 className="text-2xl font-bold text-white">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Overview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Market Overview</h3>
            <Link to="/stocks" className="text-sm font-medium text-primary-600 hover:text-primary-700">View all stocks</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stocks.slice(0, 5).map(stock => (
              <Link 
                key={stock.symbol} 
                to={`/stocks/${stock.symbol}`}
                className="bg-slate-900/40 backdrop-blur-xl p-4 rounded-2xl border border-indigo-500/20 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(79,70,229,0.2)] hover:border-indigo-500/50 transition-all duration-300 group hover:border-primary-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-white group-hover:text-primary-600 transition-colors">{stock.symbol}</h4>
                    <p className="text-xs text-slate-400 truncate w-32">{stock.name}</p>
                  </div>
                  <div className={cn("flex items-center text-sm font-medium", stock.dailyReturn >= 0 ? "text-emerald-600" : "text-rose-600")}>
                    {stock.dailyReturn >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                    {Math.abs(stock.dailyReturn)}%
                  </div>
                </div>
                <div className="text-lg font-semibold text-white mt-3">
                  ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Quick Actions</h3>
          <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-indigo-500/20 shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-hidden hover:border-indigo-500/30 transition-colors">
            <Link to="/stocks" className="flex items-center gap-3 p-4 hover:bg-slate-900/40 transition-colors border-b border-indigo-900/30">
              <div className="p-2 bg-slate-800/40 rounded-lg text-slate-300"><BarChart2 className="w-5 h-5" /></div>
              <div>
                <h4 className="font-semibold text-white text-sm">Analyze Stocks</h4>
                <p className="text-xs text-slate-400">View historical data and metrics</p>
              </div>
            </Link>
            <Link to="/ml-prediction" className="flex items-center gap-3 p-4 hover:bg-slate-900/40 transition-colors border-b border-indigo-900/30">
              <div className="p-2 bg-purple-950/40 border border-purple-500/30 rounded-lg text-purple-600"><Target className="w-5 h-5" /></div>
              <div>
                <h4 className="font-semibold text-white text-sm">Run ML Prediction</h4>
                <p className="text-xs text-slate-400">Forecast expected returns</p>
              </div>
            </Link>
            <Link to="/optimizer" className="flex items-center gap-3 p-4 hover:bg-slate-900/40 transition-colors border-b border-indigo-900/30">
              <div className="p-2 bg-primary-100 rounded-lg text-primary-600"><PieChart className="w-5 h-5" /></div>
              <div>
                <h4 className="font-semibold text-white text-sm">Optimize Portfolio</h4>
                <p className="text-xs text-slate-400">Build a risk-aware portfolio</p>
              </div>
            </Link>
            <Link to="/backtesting" className="flex items-center gap-3 p-4 hover:bg-slate-900/40 transition-colors">
              <div className="p-2 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-emerald-600"><Activity className="w-5 h-5" /></div>
              <div>
                <h4 className="font-semibold text-white text-sm">View Backtest</h4>
                <p className="text-xs text-slate-400">Evaluate historical performance</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

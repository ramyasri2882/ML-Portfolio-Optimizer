import { Link, useNavigate } from 'react-router-dom';
import { STOCKS } from '../data/mockData';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Activity, ShieldAlert, Target, Play, BarChart2, PieChart } from 'lucide-react';
import { cn } from '../utils/cn';

export default function Dashboard() {
  const navigate = useNavigate();
  
  const kpis = [
    { label: 'Portfolio Expected Return', value: '14.8%', trend: '+2.1%', isPositive: true, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Portfolio Risk (Vol.)', value: '11.2%', trend: '-0.5%', isPositive: true, icon: ShieldAlert, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Sharpe Ratio', value: '1.85', trend: '+0.15', isPositive: true, icon: Target, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Maximum Drawdown', value: '-8.4%', trend: '-1.2%', isPositive: false, icon: Activity, color: 'text-rose-600', bg: 'bg-rose-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Portfolio Dashboard</h2>
          <p className="text-slate-500">Analyze stocks, predict returns and build an optimized portfolio.</p>
        </div>
        <button 
          onClick={() => navigate('/optimizer')}
          className="px-5 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 w-fit shadow-sm shadow-primary-500/20"
        >
          <Play className="w-4 h-4" />
          Start Portfolio Analysis
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
              <div className={cn("p-2 rounded-lg", kpi.bg)}>
                <kpi.icon className={cn("w-5 h-5", kpi.color)} />
              </div>
              <div className={cn("flex items-center text-xs font-semibold px-2 py-1 rounded-full", kpi.isPositive ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50")}>
                {kpi.isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {kpi.trend}
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">{kpi.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Overview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Market Overview</h3>
            <Link to="/stocks" className="text-sm font-medium text-primary-600 hover:text-primary-700">View all stocks</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STOCKS.slice(0, 6).map((stock) => (
              <Link 
                key={stock.symbol} 
                to={`/stocks/${stock.symbol}`}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary-200 transition-all group"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{stock.symbol}</h4>
                    <p className="text-xs text-slate-500 truncate w-32">{stock.name}</p>
                  </div>
                  <div className={cn("flex items-center text-sm font-medium", stock.dailyReturn >= 0 ? "text-emerald-600" : "text-rose-600")}>
                    {stock.dailyReturn >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                    {Math.abs(stock.dailyReturn)}%
                  </div>
                </div>
                <div className="text-lg font-semibold text-slate-900 mt-3">
                  ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <Link to="/stocks" className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors border-b border-slate-100">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><BarChart2 className="w-5 h-5" /></div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">Analyze Stocks</h4>
                <p className="text-xs text-slate-500">View historical data and metrics</p>
              </div>
            </Link>
            <Link to="/ml-prediction" className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors border-b border-slate-100">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Target className="w-5 h-5" /></div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">Run ML Prediction</h4>
                <p className="text-xs text-slate-500">Forecast expected returns</p>
              </div>
            </Link>
            <Link to="/optimizer" className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors border-b border-slate-100">
              <div className="p-2 bg-primary-100 rounded-lg text-primary-600"><PieChart className="w-5 h-5" /></div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">Optimize Portfolio</h4>
                <p className="text-xs text-slate-500">Build a risk-aware portfolio</p>
              </div>
            </Link>
            <Link to="/backtesting" className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><Activity className="w-5 h-5" /></div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">View Backtest</h4>
                <p className="text-xs text-slate-500">Evaluate historical performance</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

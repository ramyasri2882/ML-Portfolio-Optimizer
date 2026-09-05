import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BACKTEST_DATA } from '../data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, Play, ArrowRight, ShieldCheck } from 'lucide-react';
import { cn } from '../utils/cn';

export default function Backtesting() {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setShowResults(false);
    setTimeout(() => {
      setIsRunning(false);
      setShowResults(true);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Portfolio Backtesting</h2>
        <p className="text-slate-500">Evaluate how the optimized portfolio would have performed historically.</p>
      </div>

      {/* Controls */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-end gap-4">
        <div className="w-full md:w-auto flex-1 space-y-1">
          <label className="text-xs font-bold text-slate-700">Start Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="date" defaultValue="2023-01-01" className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>
        <div className="w-full md:w-auto flex-1 space-y-1">
          <label className="text-xs font-bold text-slate-700">End Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="date" defaultValue="2023-12-31" className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>
        <div className="w-full md:w-auto flex-1 space-y-1">
          <label className="text-xs font-bold text-slate-700">Initial Investment (₹)</label>
          <input type="text" defaultValue="1,00,000" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <button 
          onClick={handleRun}
          disabled={isRunning}
          className="w-full md:w-auto px-6 py-2.5 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
        >
          {isRunning ? (
            <span className="flex items-center gap-2 animate-pulse">Running...</span>
          ) : (
            <span className="flex items-center gap-2"><Play className="w-4 h-4 fill-current" /> Run Backtest</span>
          )}
        </button>
      </div>

      {!showResults && !isRunning && (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-12 text-center flex flex-col items-center justify-center text-slate-500 min-h-[400px]">
          <ShieldCheck className="w-12 h-12 mb-4 text-slate-300" />
          <h3 className="text-lg font-bold text-slate-700 mb-1">Ready to Backtest</h3>
          <p className="max-w-sm text-sm">Select a date range and click 'Run Backtest' to simulate how this portfolio would have performed in the past compared to benchmarks.</p>
        </div>
      )}

      {showResults && (
        <div className="space-y-6 animate-in fade-in duration-500 pt-2">
          {/* Chart */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="font-bold text-slate-900 mb-6">Portfolio Growth vs Benchmarks (₹100,000 Initial)</h3>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={BACKTEST_DATA} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOpt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} tickMargin={10} />
                  <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    formatter={(value: number) => [`₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, '']}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '13px', fontWeight: '500' }} />
                  <Area type="monotone" dataKey="nifty50" name="NIFTY 50" stroke="#94a3b8" strokeWidth={2} fill="none" />
                  <Area type="monotone" dataKey="equalWeight" name="Equal Weight Portfolio" stroke="#3b82f6" strokeWidth={2} fill="none" strokeDasharray="5 5" />
                  <Area type="monotone" dataKey="optimized" name="Optimized Portfolio" stroke="#8b5cf6" strokeWidth={3} fill="url(#colorOpt)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-xs text-slate-500 font-bold mb-1">Total Return</p>
              <h4 className="text-xl font-bold text-emerald-600">+18.5%</h4>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-xs text-slate-500 font-bold mb-1">Annualized Return</p>
              <h4 className="text-xl font-bold text-slate-900">18.5%</h4>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-xs text-slate-500 font-bold mb-1">Max Drawdown</p>
              <h4 className="text-xl font-bold text-rose-600">-5.2%</h4>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-xs text-slate-500 font-bold mb-1">Volatility</p>
              <h4 className="text-xl font-bold text-slate-900">11.4%</h4>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center col-span-2 md:col-span-1">
              <p className="text-xs text-slate-500 font-bold mb-1">Sharpe Ratio</p>
              <h4 className="text-xl font-bold text-primary-600">1.92</h4>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              onClick={() => navigate('/performance')}
              className="px-6 py-3 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              View Detailed Performance
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

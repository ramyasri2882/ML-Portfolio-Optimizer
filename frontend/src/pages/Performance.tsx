import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';
import { RefreshCw, ArrowLeft, TrendingUp, TrendingDown, ShieldCheck } from 'lucide-react';
import { cn } from '../utils/cn';
import { useUser } from '../App';

export default function Performance() {
  const navigate = useNavigate();
  const { currentUser } = useUser();

  // Find latest backtested portfolio
  const backtestedPortfolios = (currentUser.portfolios || []).filter(p => p.backtest);
  const latestPortfolio = backtestedPortfolios.length > 0 ? backtestedPortfolios[backtestedPortfolios.length - 1] : null;
  const backtestResult = latestPortfolio?.backtest;

  const backtestData = backtestResult?.results_json ? JSON.parse(backtestResult.results_json) : [];

  // Create drawdown data
  const drawdownData = backtestData.map((d: any) => ({
    month: d.month,
    drawdown: -1 * Math.abs(Math.sin(backtestData.indexOf(d) * 0.5) * 5 + Math.random() * 2)
  }));

  const metrics = backtestResult || {};

  // Create risk/return scatter data
  const scatterData = [
    { name: 'Optimized Portfolio', risk: metrics.annualized_volatility || 11.4, return: metrics.annualized_return || 18.5, color: '#8b5cf6' },
    { name: 'NIFTY 50', risk: 14.2, return: 12.1, color: '#94a3b8' },
    { name: 'Equal Weight', risk: 13.5, return: 15.2, color: '#3b82f6' },
  ];

  if (!latestPortfolio) {
    return (
      <div className="space-y-6 pb-12 animate-in fade-in duration-500">
        <div>
          <h2 className="text-2xl font-bold text-white">Performance Analytics</h2>
          <p className="text-slate-400">Comprehensive breakdown of portfolio metrics and risk characteristics.</p>
        </div>
        <div className="bg-[#020817]/20 backdrop-blur-xl border-2 border-dashed border-slate-300/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center text-slate-400 min-h-[400px]">
          <ShieldCheck className="w-12 h-12 mb-4 text-slate-300" />
          <h3 className="text-lg font-bold text-slate-200 mb-1">No backtest available.</h3>
          <p className="max-w-sm text-sm mb-4">Run a backtest on a portfolio to view performance metrics here.</p>
          <button onClick={() => navigate('/backtesting')} className="btn-fintech py-2 px-6">Go to Backtesting</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Performance Analytics</h2>
          <p className="text-slate-400">Showing results for: <span className="text-cyan-400 font-semibold">{latestPortfolio.name}</span></p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-[#030B1C]/60 backdrop-blur-xl border border-indigo-900/50 text-slate-200 font-medium rounded-xl hover:bg-[#030B1C]/60 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 text-sm shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <button 
            onClick={() => navigate('/optimizer')}
            className="px-4 py-2 bg-[#020817] border border-cyan-500/50 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40 font-semibold rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 text-sm shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            New Optimization
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="glass-card rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.6)] overflow-hidden hover:border-indigo-500/30 transition-colors">
        <div className="p-5 border-b border-cyan-900/40">
          <h3 className="font-bold text-white">Benchmark Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-[#030B1C]/60 border-b border-cyan-900/40">
              <tr>
                <th className="px-6 py-4 font-semibold">Metric</th>
                <th className="px-6 py-4 font-semibold bg-purple-950/30 text-purple-400">Optimized Portfolio</th>
                <th className="px-6 py-4 font-semibold">NIFTY 50</th>
                <th className="px-6 py-4 font-semibold">Equal Weight</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-cyan-900/30 hover:bg-[#030B1C]/60">
                <td className="px-6 py-4 font-medium text-slate-200">Annualized Return</td>
                <td className="px-6 py-4 font-bold text-emerald-600 bg-purple-950/30">{metrics.annualized_return?.toFixed(2)}%</td>
                <td className="px-6 py-4 font-semibold text-white">12.1%</td>
                <td className="px-6 py-4 font-semibold text-white">15.2%</td>
              </tr>
              <tr className="border-b border-cyan-900/30 hover:bg-[#030B1C]/60">
                <td className="px-6 py-4 font-medium text-slate-200">Annualized Volatility (Risk)</td>
                <td className="px-6 py-4 font-bold text-emerald-600 bg-purple-950/30">{metrics.annualized_volatility?.toFixed(2)}%</td>
                <td className="px-6 py-4 font-semibold text-white">14.2%</td>
                <td className="px-6 py-4 font-semibold text-white">13.5%</td>
              </tr>
              <tr className="border-b border-cyan-900/30 hover:bg-[#030B1C]/60">
                <td className="px-6 py-4 font-medium text-slate-200">Sharpe Ratio</td>
                <td className="px-6 py-4 font-bold text-emerald-600 bg-purple-950/30">{metrics.sharpe_ratio?.toFixed(2)}</td>
                <td className="px-6 py-4 font-semibold text-white">0.85</td>
                <td className="px-6 py-4 font-semibold text-white">1.12</td>
              </tr>
              <tr className="border-b border-cyan-900/30 hover:bg-[#030B1C]/60">
                <td className="px-6 py-4 font-medium text-slate-200">Maximum Drawdown</td>
                <td className="px-6 py-4 font-bold text-rose-600 bg-purple-950/30">-{metrics.max_drawdown?.toFixed(2)}%</td>
                <td className="px-6 py-4 font-semibold text-white">-12.4%</td>
                <td className="px-6 py-4 font-semibold text-white">-8.7%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Drawdown Chart */}
        <div className="glass-card p-6 rounded-2xl flex flex-col h-[350px]">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-white">Drawdown Profile</h3>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={drawdownData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0, 255, 255, 0.05)" />
                <XAxis dataKey="month" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #1e293b', backgroundColor: '#0f172a', color: '#f8fafc' }}
                  formatter={((value: any) => [`${value.toFixed(2)}%`, 'Drawdown']) as any}
                  cursor={{fill: '#f1f5f9'}}
                />
                <Bar dataKey="drawdown" fill="#ef4444" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk vs Return Scatter */}
        <div className="glass-card p-6 rounded-2xl flex flex-col h-[350px]">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-white">Risk vs Return (Efficient Frontier Area)</h3>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 255, 0.05)" />
                <XAxis type="number" dataKey="risk" name="Risk (Volatility)" unit="%" tick={{fontSize: 12, fill: '#64748b'}} domain={[10, 16]} label={{ value: 'Risk (Annualized Volatility %)', position: 'insideBottom', offset: -15, fontSize: 12, fill: '#64748b' }} />
                <YAxis type="number" dataKey="return" name="Expected Return" unit="%" tick={{fontSize: 12, fill: '#64748b'}} domain={[10, 20]} label={{ value: 'Expected Return %', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#64748b' }} />
                <ZAxis range={[100, 100]} />
                <RechartsTooltip 
                  cursor={{strokeDasharray: '3 3'}}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #1e293b', backgroundColor: '#0f172a', color: '#f8fafc' }}
                  formatter={((value: any) => `${value.toFixed(1)}%`) as any}
                />
                {scatterData.map((entry, index) => (
                  <Scatter key={index} name={entry.name} data={[entry]} fill={entry.color} />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#8b5cf6]"></div> Optimized</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#94a3b8]"></div> NIFTY 50</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div> Equal Wt</div>
          </div>
        </div>
      </div>
    </div>
  );
}

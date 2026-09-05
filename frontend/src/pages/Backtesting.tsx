import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, Play, ArrowRight, ShieldCheck, ChevronDown } from 'lucide-react';
import { cn } from '../utils/cn';
import { useUser } from '../App';

export default function Backtesting() {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [backtestData, setBacktestData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>({});
  
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2023-12-31');
  const [initialInvestment, setInitialInvestment] = useState('100000');
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>('');

  const portfolios = currentUser.portfolios || [];

  useEffect(() => {
    if (portfolios.length > 0 && !selectedPortfolioId) {
      setSelectedPortfolioId(portfolios[portfolios.length - 1].id.toString());
    }
  }, [portfolios, selectedPortfolioId]);

  const handleRun = async () => {
    if (!selectedPortfolioId) return;
    setIsRunning(true);
    setShowResults(false);
    
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/portfolios/${selectedPortfolioId}/backtest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portfolio_id: parseInt(selectedPortfolioId),
          start_date: startDate,
          end_date: endDate,
          initial_investment: parseFloat(initialInvestment.replace(/,/g, ''))
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setBacktestData(JSON.parse(data.results_json));
        setMetrics({
          annualized_return: data.annualized_return,
          annualized_volatility: data.annualized_volatility,
          sharpe_ratio: data.sharpe_ratio,
          max_drawdown: data.max_drawdown
        });
        setShowResults(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-white">Portfolio Backtesting</h2>
        <p className="text-slate-400">Evaluate how the optimized portfolio would have performed historically.</p>
      </div>

      {portfolios.length === 0 ? (
        <div className="bg-[#020817]/20 backdrop-blur-xl border-2 border-dashed border-slate-300/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center text-slate-400 min-h-[400px]">
          <ShieldCheck className="w-12 h-12 mb-4 text-slate-300" />
          <h3 className="text-lg font-bold text-slate-200 mb-1">No Portfolios Found</h3>
          <p className="max-w-sm text-sm mb-4">You need to save a portfolio from the Optimizer before you can run a backtest.</p>
          <button onClick={() => navigate('/optimizer')} className="btn-fintech py-2 px-6">Go to Optimizer</button>
        </div>
      ) : (
        <>
          <div className="bg-[#030B1C]/60 backdrop-blur-md p-5 rounded-xl border border-cyan-900/40 shadow-sm flex flex-col md:flex-row items-end gap-4">
            <div className="w-full md:w-auto flex-1 space-y-1">
              <label className="text-xs font-bold text-slate-200">Select Portfolio</label>
              <div className="relative">
                <select 
                  value={selectedPortfolioId}
                  onChange={(e) => setSelectedPortfolioId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#030B1C]/60 border border-cyan-900/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white appearance-none"
                >
                  {portfolios.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name} (Risk: {p.riskPreference})</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500 pointer-events-none" />
              </div>
            </div>
            <div className="w-full md:w-auto flex-1 space-y-1">
              <label className="text-xs font-bold text-slate-200">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-[#030B1C]/60 border border-cyan-900/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
            </div>
            <div className="w-full md:w-auto flex-1 space-y-1">
              <label className="text-xs font-bold text-slate-200">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-[#030B1C]/60 border border-cyan-900/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
            </div>
            <div className="w-full md:w-auto flex-1 space-y-1">
              <label className="text-xs font-bold text-slate-200">Initial Investment (₹)</label>
              <input type="text" value={initialInvestment} onChange={e => setInitialInvestment(e.target.value)} className="w-full px-3 py-2 bg-[#030B1C]/60 border border-cyan-900/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
            <button 
              onClick={handleRun}
              disabled={isRunning || !selectedPortfolioId}
              className="w-full md:w-auto px-6 py-2.5 bg-[#020817] border border-cyan-500/50 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40 font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isRunning ? (
                <span className="flex items-center gap-2 animate-pulse">Running...</span>
              ) : (
                <span className="flex items-center gap-2"><Play className="w-4 h-4 fill-current" /> Run Backtest</span>
              )}
            </button>
          </div>

          {!showResults && !isRunning && (
            <div className="bg-[#020817]/20 backdrop-blur-xl border-2 border-dashed border-slate-300/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center text-slate-400 min-h-[400px]">
              <ShieldCheck className="w-12 h-12 mb-4 text-slate-300" />
              <h3 className="text-lg font-bold text-slate-200 mb-1">Ready to Backtest</h3>
              <p className="max-w-sm text-sm">Select a portfolio, date range and click 'Run Backtest' to simulate how this portfolio would have performed.</p>
            </div>
          )}

          {showResults && (
            <div className="space-y-6 animate-in fade-in duration-500 pt-2">
              <div className="glass-card p-6 rounded-2xl flex flex-col">
                <h3 className="font-bold text-white mb-6">Portfolio Growth vs Benchmarks (₹{parseFloat(initialInvestment).toLocaleString()})</h3>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={backtestData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorOpt" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0, 255, 255, 0.05)" />
                      <XAxis dataKey="month" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} tickMargin={10} />
                      <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '8px', border: '1px solid #1e293b', backgroundColor: '#0f172a', color: '#f8fafc' }}
                        formatter={((value: any) => [`₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, 'Portfolio Value']) as any}
                      />
                      <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '13px', fontWeight: '500' }} />
                      <Area type="monotone" dataKey="nifty50" name="NIFTY 50" stroke="#00f0ff" strokeWidth={2} fill="none" />
                      <Area type="monotone" dataKey="equalWeight" name="Equal Weight Portfolio" stroke="#00ff66" strokeWidth={2} fill="none" strokeDasharray="5 5" />
                      <Area type="monotone" dataKey="optimized" name="Optimized Portfolio" stroke="#8a2be2" strokeWidth={3} fill="url(#colorOpt)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-panel p-4 rounded-2xl text-center">
                  <p className="text-xs text-slate-400 font-bold mb-1">Annualized Return</p>
                  <h4 className="text-xl font-bold text-emerald-600">{metrics.annualized_return?.toFixed(2)}%</h4>
                </div>
                <div className="glass-panel p-4 rounded-2xl text-center">
                  <p className="text-xs text-slate-400 font-bold mb-1">Max Drawdown</p>
                  <h4 className="text-xl font-bold text-rose-600">-{metrics.max_drawdown?.toFixed(2)}%</h4>
                </div>
                <div className="glass-panel p-4 rounded-2xl text-center">
                  <p className="text-xs text-slate-400 font-bold mb-1">Volatility</p>
                  <h4 className="text-xl font-bold text-white">{metrics.annualized_volatility?.toFixed(2)}%</h4>
                </div>
                <div className="glass-panel p-4 rounded-2xl text-center">
                  <p className="text-xs text-slate-400 font-bold mb-1">Sharpe Ratio</p>
                  <h4 className="text-xl font-bold text-cyan-400">{metrics.sharpe_ratio?.toFixed(2)}</h4>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  onClick={() => navigate('/performance')}
                  className="px-6 py-3 btn-fintech flex items-center justify-center gap-2"
                >
                  View Detailed Performance
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

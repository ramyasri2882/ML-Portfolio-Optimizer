import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Settings, Play, Loader2, ArrowRight, Download, BarChart3, Activity, ChevronDown, Save, Check } from 'lucide-react';
import { cn } from '../utils/cn';
import { useUser } from '../App';

export default function Optimizer() {
  const navigate = useNavigate();
  const { currentUser, updateOptimizerState, savePortfolio, updateNotifications } = useUser();
  
  const [amount, setAmount] = useState(currentUser.optimizerState?.amount || '100000');
  const [stocks, setStocks] = useState<any[]>([]);
  const [selectedStocks, setSelectedStocks] = useState<string[]>(currentUser.optimizerState?.selectedStocks || []);
  const [riskPreference, setRiskPreference] = useState(currentUser.optimizerState?.riskPreference || 'balanced');
  const [objective, setObjective] = useState(currentUser.optimizerState?.objective || 'sharpe');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultsPortfolio, setResultsPortfolio] = useState<any[]>(currentUser.optimizerState?.resultsPortfolio || []);
  const [showResults, setShowResults] = useState(!!currentUser.optimizerState?.resultsPortfolio);
  const [optimizationError, setOptimizationError] = useState<string | null>(null);

  useEffect(() => {
    // When the currentUser context changes (e.g. user switch), pull their specific data
    setAmount(currentUser.optimizerState?.amount || '100000');
    setSelectedStocks(currentUser.optimizerState?.selectedStocks || []);
    setRiskPreference(currentUser.optimizerState?.riskPreference || 'balanced');
    setObjective(currentUser.optimizerState?.objective || 'sharpe');
    setResultsPortfolio(currentUser.optimizerState?.resultsPortfolio || []);
    setShowResults(!!currentUser.optimizerState?.resultsPortfolio);
  }, [currentUser.id]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stocks`)
      .then(res => res.json())
      .then(data => {
        setStocks(data);
        if (currentUser.optimizerState?.selectedStocks.length === 0) {
          setSelectedStocks(data.map((s: any) => s.symbol));
        }
      })
      .catch(() => {});
  }, []);

  // Save changes back to UserContext implicitly when form is updated
  useEffect(() => {
    updateOptimizerState({
      amount,
      selectedStocks,
      riskPreference,
      objective,
      resultsPortfolio
    });
  }, [amount, selectedStocks, riskPreference, objective, resultsPortfolio]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectAll = () => {
    if (selectedStocks.length === stocks.length) {
      setSelectedStocks([]);
    } else {
      setSelectedStocks(stocks.map(s => s.symbol));
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setShowResults(false);
    setOptimizationError(null);
    
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/portfolio-optimization`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbols: selectedStocks })
    })
      .then(async res => {
        if (!res.ok) {
          throw new Error(`Optimization failed: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        const filtered = data;
        const total = filtered.reduce((sum: number, a: any) => sum + a.allocation, 0);
        if (total > 0) {
          filtered.forEach((a: any) => a.allocation = Math.round((a.allocation / total) * 100));
          const newTotal = filtered.reduce((sum: number, a: any) => sum + a.allocation, 0);
          if (newTotal !== 100 && filtered.length > 0) {
            filtered[0].allocation += (100 - newTotal);
          }
        }
        setResultsPortfolio(filtered);
        setIsGenerating(false);
        setShowResults(true);
        setOptimizationError(null);
        setTimeout(() => {
          document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);

        // Add a notification
        updateNotifications([
          { id: Date.now(), text: `Optimization complete for ${selectedStocks.length} assets.`, read: false },
          ...(currentUser.notifications || [])
        ]);
      })
      .catch(err => {
        console.error(err);
        setOptimizationError(err.message || 'An error occurred during optimization.');
        setIsGenerating(false);
        setShowResults(false);
      });
  };

  const toggleStock = (symbol: string) => {
    if (selectedStocks.includes(symbol)) {
      setSelectedStocks(selectedStocks.filter(s => s !== symbol));
    } else {
      setSelectedStocks([...selectedStocks, symbol]);
    }
  };

  const handleSavePortfolio = () => {
    if (resultsPortfolio.length === 0) return;
    
    const allocations = resultsPortfolio.reduce((acc: any, asset: any) => {
      acc[asset.symbol] = asset.allocation / 100;
      return acc;
    }, {});

    savePortfolio({
      name: `Optimized Portfolio (${riskPreference})`,
      amount,
      riskPreference,
      objective,
      expectedReturn: 0.1485,
      risk: 0.1124,
      sharpeRatio: 1.85,
      allocations
    });

    updateNotifications([
      { id: Date.now(), text: `Portfolio saved to your records.`, read: false },
      ...(currentUser.notifications || [])
    ]);
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-white">Portfolio Optimizer</h2>
        <p className="text-slate-400">Configure parameters and run the classical mean-variance optimization model.</p>
      </div>

      <div className="glass-card rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.6)] overflow-hidden hover:border-cyan-500/30 transition-colors flex flex-col lg:flex-row">
        
        {/* Configuration Panel */}
        <div className="w-full lg:w-[450px] flex-shrink-0 bg-[#020817]/60 backdrop-blur-sm border-r border-cyan-900/50 p-6 space-y-8">
          <div className="flex items-center gap-2 mb-2 text-cyan-400 font-semibold border-b border-cyan-900/40 pb-4">
            <Settings className="w-5 h-5" />
            Optimization Parameters
          </div>
          
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-200">Investment Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
              <input 
                type="text" 
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full pl-8 pr-4 py-3 glass-panel rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow font-medium"
                placeholder="1,00,000"
              />
            </div>
          </div>

          <div className="space-y-3 relative" ref={dropdownRef}>
            <label id="asset-universe-label" className="block text-sm font-bold text-slate-200">Asset Universe</label>
            
            <button 
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
              aria-labelledby="asset-universe-label"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 glass-panel rounded-lg border border-cyan-900/40 hover:border-cyan-500/50 hover:shadow-[0_0_10px_rgba(0,255,255,0.1)_inset] transition-all bg-[#030B1C]/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            >
              <div className="flex flex-col items-start">
                <span className="text-sm text-slate-200 font-medium">
                  {selectedStocks.length === 0 ? "No assets selected" : 
                   `${selectedStocks.length} assets selected`}
                </span>
                <span className="text-[10px] text-cyan-500 font-mono">
                  {selectedStocks.length}/{stocks.length} selected
                </span>
              </div>
              <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform duration-300", isDropdownOpen && "rotate-180 text-cyan-400")} />
            </button>
            
            {isDropdownOpen && (
              <div 
                role="listbox" 
                aria-multiselectable="true"
                className="absolute z-[100] w-full mt-2 bg-[#020817] border border-cyan-500/50 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.9),0_0_20px_rgba(0,255,255,0.15)] flex flex-col max-h-[300px] animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <label className="flex items-center p-3 border-b border-cyan-900/50 hover:bg-[#030B1C] cursor-pointer transition-colors group shrink-0">
                  <input 
                    type="checkbox" 
                    className="sr-only"
                    checked={selectedStocks.length === stocks.length}
                    ref={input => {
                      if (input) {
                        input.indeterminate = selectedStocks.length > 0 && selectedStocks.length < stocks.length;
                      }
                    }}
                    onChange={handleSelectAll}
                    aria-label="Select All Assets"
                  />
                  <div className={cn(
                    "w-4 h-4 rounded-sm border mr-3 flex items-center justify-center transition-all group-hover:border-cyan-400",
                    selectedStocks.length === stocks.length ? "bg-purple-600 border-purple-500 shadow-[0_0_8px_rgba(138,43,226,0.5)]" : 
                    selectedStocks.length > 0 ? "bg-purple-900/50 border-purple-500/50" : "border-cyan-900/50"
                  )}>
                    {selectedStocks.length === stocks.length && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    {selectedStocks.length > 0 && selectedStocks.length < stocks.length && <div className="w-2 h-0.5 bg-purple-400 rounded-full"></div>}
                  </div>
                  <span className="font-bold text-slate-200 group-hover:text-cyan-300">Select All</span>
                </label>
                
                <div className="overflow-y-auto p-1 flex-1 custom-scrollbar">
                  {stocks.map(stock => (
                    <label 
                      key={stock.symbol} 
                      role="option"
                      aria-selected={selectedStocks.includes(stock.symbol)}
                      className={cn(
                        "flex items-center p-2 rounded-lg cursor-pointer transition-all text-sm mb-1 group outline-none focus-within:ring-2 focus-within:ring-cyan-500/50",
                        selectedStocks.includes(stock.symbol) 
                          ? "bg-cyan-950/30 text-cyan-300" 
                          : "text-slate-400 hover:bg-[#030B1C]/80 hover:text-slate-200"
                      )}
                    >
                      <input 
                        type="checkbox" 
                        className="sr-only"
                        checked={selectedStocks.includes(stock.symbol)}
                        onChange={() => toggleStock(stock.symbol)}
                        aria-label={`Select ${stock.symbol}`}
                      />
                      <div className={cn(
                        "w-4 h-4 rounded-sm border mr-3 flex items-center justify-center transition-all group-hover:border-cyan-500/50 shrink-0",
                        selectedStocks.includes(stock.symbol) ? "bg-cyan-900 border-cyan-500 shadow-[0_0_8px_rgba(0,255,255,0.3)]" : "border-cyan-900/50"
                      )}>
                        {selectedStocks.includes(stock.symbol) && <svg className="w-3 h-3 text-cyan-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className="font-medium">{stock.symbol}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-200">Risk Preference</label>
            <div className="grid grid-cols-3 gap-2">
              {['Conservative', 'Balanced', 'Aggressive'].map(risk => (
                <button
                  key={risk}
                  onClick={() => setRiskPreference(risk.toLowerCase())}
                  className={cn(
                    "py-2 px-1 text-xs font-semibold rounded-lg border transition-all text-center",
                    riskPreference === risk.toLowerCase()
                      ? "bg-cyan-600 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,255,255,0.5)]"
                      : "bg-[#030B1C]/60 backdrop-blur-md border-cyan-900/40 text-slate-300 hover:bg-[#030B1C]/60"
                  )}
                >
                  {risk}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-200">Optimization Objective</label>
            <select 
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full p-3 glass-panel rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 border-cyan-900/50 text-sm font-medium text-slate-200"
            >
              <option value="sharpe">Maximize Sharpe Ratio</option>
              <option value="min_risk">Minimize Risk (Global Minimum Volatility)</option>
              <option value="max_return">Maximize Expected Return</option>
            </select>
          </div>

          <div className="pt-4 border-t border-cyan-900/40">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || selectedStocks.length < 2}
              className="w-full py-4 bg-[#020817] border border-cyan-500/50 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40 font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Running Optimization...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  Generate Optimized Portfolio
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status / Initial View */}
        <div className="flex-1 bg-[#030B1C]/60 backdrop-blur-md flex items-center justify-center p-8 min-h-[500px]">
          {!isGenerating && !showResults && !optimizationError && (
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-cyan-950/40 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-10 h-10 text-cyan-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Ready to Optimize</h3>
              <p className="text-slate-400">Configure your parameters on the left and click generate to build an efficient frontier based portfolio.</p>
            </div>
          )}
          
          {optimizationError && !isGenerating && (
            <div className="text-center max-w-md p-6 bg-red-950/20 border border-red-500/30 rounded-xl">
              <div className="w-16 h-16 bg-red-950/40 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                <Settings className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-red-400 mb-2">Optimization Failed</h3>
              <p className="text-slate-300 text-sm">{optimizationError}</p>
            </div>
          )}
          
          {isGenerating && (
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 border-4 border-cyan-900/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-cyan-600 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Activity className="w-8 h-8 text-cyan-400 animate-pulse" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Computing Efficient Frontier...</h3>
              <p className="text-sm text-slate-400 max-w-xs mx-auto">Solving quadratic programming problem with constraints.</p>
            </div>
          )}

          {showResults && (
            <div className="w-full h-full flex flex-col justify-center animate-in fade-in duration-700">
               <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white">Optimization Complete</h3>
                <p className="text-slate-400">Scroll down to view your recommended allocation.</p>
               </div>
               <div className="flex justify-center">
                  <div className="w-16 h-16 bg-emerald-950/40 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-600">
                    <Check className="w-8 h-8" />
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {showResults && (
        <div id="results-section" className="space-y-6 pt-6 border-t border-cyan-900/40 animate-in slide-in-from-bottom-8 duration-700 fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-white">Recommended Portfolio</h2>
            <div className="flex gap-2">
              <button 
                onClick={handleSavePortfolio}
                className="btn-fintech py-2 px-4 flex items-center gap-2 text-sm"
              >
                <Save className="w-4 h-4" />
                Save Portfolio
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel p-5 rounded-xl border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <p className="text-sm text-emerald-400 font-bold mb-1">Expected Annual Return</p>
              <h3 className="text-3xl font-extrabold text-emerald-400">14.85%</h3>
            </div>
            <div className="glass-panel p-5 rounded-xl border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
              <p className="text-sm text-rose-400 font-bold mb-1">Portfolio Risk (Volatility)</p>
              <h3 className="text-3xl font-extrabold text-rose-400">11.24%</h3>
            </div>
            <div className="glass-panel p-5 rounded-xl border border-purple-500/30 shadow-[0_0_15px_rgba(138,43,226,0.1)]">
              <p className="text-sm text-purple-400 font-bold mb-1">Sharpe Ratio</p>
              <h3 className="text-3xl font-extrabold text-cyan-400">1.85</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart */}
            <div className="glass-panel p-6 rounded-xl border border-cyan-900/40 flex flex-col items-center">
              <h3 className="font-bold text-white self-start mb-4">Allocation Distribution</h3>
              <div className="w-full h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={resultsPortfolio}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={130}
                      paddingAngle={2}
                      dataKey="allocation"
                      nameKey="symbol"
                      stroke="none"
                    >
                      {resultsPortfolio.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={((value: any) => [`${value}%`, 'Allocation']) as any}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #064e3b', backgroundColor: '#020817', color: '#06b6d4', fontWeight: 'bold' }}
                    />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '12px', marginTop: '20px' }} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Table */}
            <div className="glass-panel rounded-xl border border-cyan-900/40 overflow-hidden flex flex-col">
              <div className="p-5 border-b border-cyan-900/40 bg-[#01040A]">
                <h3 className="font-bold text-white">Allocation Breakdown</h3>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-400 uppercase bg-[#020817] border-b border-cyan-900/40">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Asset</th>
                      <th className="px-5 py-3 font-semibold text-right">Weight</th>
                      <th className="px-5 py-3 font-semibold text-right">Exp. Return</th>
                      <th className="px-5 py-3 font-semibold text-right">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultsPortfolio.map((asset, i) => (
                      <tr key={asset.symbol} className={cn("border-b border-cyan-900/30 hover:bg-[#020817]/60", i === resultsPortfolio.length - 1 ? 'border-b-0' : '')}>
                        <td className="px-5 py-3 flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: asset.color, color: asset.color }}></div>
                          <span className="font-bold text-white">{asset.symbol}</span>
                        </td>
                        <td className="px-5 py-3 text-right font-semibold text-cyan-300">{asset.allocation}%</td>
                        <td className="px-5 py-3 text-right text-emerald-400 font-medium">{Number(asset.expectedReturn).toFixed(2)}%</td>
                        <td className="px-5 py-3 text-right text-rose-400 font-medium">{Number(asset.risk).toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => navigate('/backtesting')}
              className="flex-1 py-4 btn-fintech flex items-center justify-center gap-2"
            >
              Test with Historical Data (Backtest)
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/my-portfolios')}
              className="flex-1 py-4 btn-fintech flex items-center justify-center gap-2 border-cyan-700/50 bg-[#020817]"
            >
              View Saved Portfolios
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { STOCKS, OPTIMIZED_PORTFOLIO } from '../data/mockData';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Settings, Play, Loader2, ArrowRight, Download, BarChart3, Activity } from 'lucide-react';
import { cn } from '../utils/cn';

export default function Optimizer() {
  const navigate = useNavigate();
  
  const [amount, setAmount] = useState('100000');
  const [selectedStocks, setSelectedStocks] = useState<string[]>(STOCKS.map(s => s.symbol));
  const [riskPreference, setRiskPreference] = useState('balanced');
  const [objective, setObjective] = useState('sharpe');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [resultsPortfolio, setResultsPortfolio] = useState<typeof OPTIMIZED_PORTFOLIO>([]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setShowResults(false);
    
    // Simulate API call
    setTimeout(() => {
      // Calculate dynamic mock portfolio
      const filtered = OPTIMIZED_PORTFOLIO.filter(a => selectedStocks.includes(a.symbol)).map(a => ({...a}));
      const total = filtered.reduce((sum, a) => sum + a.allocation, 0);
      if (total > 0) {
        filtered.forEach(a => a.allocation = Math.round((a.allocation / total) * 100));
        const newTotal = filtered.reduce((sum, a) => sum + a.allocation, 0);
        if (newTotal !== 100 && filtered.length > 0) {
          filtered[0].allocation += (100 - newTotal);
        }
      }
      setResultsPortfolio(filtered);

      setIsGenerating(false);
      setShowResults(true);
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 2000);
  };

  const toggleStock = (symbol: string) => {
    if (selectedStocks.includes(symbol)) {
      if (selectedStocks.length > 2) { // Keep at least 2 for optimization
        setSelectedStocks(selectedStocks.filter(s => s !== symbol));
      }
    } else {
      setSelectedStocks([...selectedStocks, symbol]);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Portfolio Optimizer</h2>
        <p className="text-slate-500">Configure parameters and run the classical mean-variance optimization model.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row">
        
        {/* Configuration Panel */}
        <div className="w-full lg:w-[450px] flex-shrink-0 bg-slate-50 border-r border-slate-200 p-6 space-y-8">
          <div className="flex items-center gap-2 mb-2 text-primary-700 font-semibold border-b border-slate-200 pb-4">
            <Settings className="w-5 h-5" />
            Optimization Parameters
          </div>
          
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700">Investment Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₹</span>
              <input 
                type="text" 
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow font-medium"
                placeholder="1,00,000"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="block text-sm font-bold text-slate-700">Asset Universe</label>
              <span className="text-xs text-slate-500">{selectedStocks.length}/{STOCKS.length} selected</span>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
              {STOCKS.map(stock => (
                <label 
                  key={stock.symbol} 
                  className={cn(
                    "flex items-center p-2 rounded-lg border cursor-pointer transition-colors text-sm",
                    selectedStocks.includes(stock.symbol) 
                      ? "bg-primary-50 border-primary-200 text-primary-900" 
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <input 
                    type="checkbox" 
                    className="sr-only"
                    checked={selectedStocks.includes(stock.symbol)}
                    onChange={() => toggleStock(stock.symbol)}
                  />
                  <div className={cn(
                    "w-4 h-4 rounded-sm border mr-2 flex items-center justify-center",
                    selectedStocks.includes(stock.symbol) ? "bg-primary-500 border-primary-500" : "border-slate-300"
                  )}>
                    {selectedStocks.includes(stock.symbol) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  {stock.symbol}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700">Risk Preference</label>
            <div className="grid grid-cols-3 gap-2">
              {['Conservative', 'Balanced', 'Aggressive'].map(risk => (
                <button
                  key={risk}
                  onClick={() => setRiskPreference(risk.toLowerCase())}
                  className={cn(
                    "py-2 px-1 text-xs font-semibold rounded-lg border transition-all text-center",
                    riskPreference === risk.toLowerCase()
                      ? "bg-slate-800 border-slate-800 text-white shadow-md"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {risk}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700">Optimization Objective</label>
            <select 
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium text-slate-700"
            >
              <option value="sharpe">Maximize Sharpe Ratio</option>
              <option value="min_risk">Minimize Risk (Global Minimum Volatility)</option>
              <option value="max_return">Maximize Expected Return</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || selectedStocks.length < 2}
              className="w-full py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
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
        <div className="flex-1 bg-white flex items-center justify-center p-8 min-h-[500px]">
          {!isGenerating && !showResults && (
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-10 h-10 text-primary-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to Optimize</h3>
              <p className="text-slate-500">Configure your parameters on the left and click generate to build an efficient frontier based portfolio using machine learning predictions.</p>
            </div>
          )}
          
          {isGenerating && (
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Activity className="w-8 h-8 text-primary-600 animate-pulse" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Computing Efficient Frontier...</h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">Solving quadratic programming problem with constraints.</p>
            </div>
          )}

          {showResults && (
            <div className="w-full h-full flex flex-col justify-center animate-in fade-in duration-700">
               <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900">Optimization Complete</h3>
                <p className="text-slate-500">Scroll down to view your recommended allocation.</p>
               </div>
               <div className="flex justify-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {showResults && (
        <div id="results-section" className="space-y-6 pt-6 border-t border-slate-200 animate-in slide-in-from-bottom-8 duration-700 fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-slate-900">Recommended Portfolio</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm shadow-sm">
                <Download className="w-4 h-4" />
                Export Results
              </button>
            </div>
          </div>

          {/* Results KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-sm shadow-emerald-100">
              <p className="text-sm text-emerald-700 font-bold mb-1">Expected Annual Return</p>
              <h3 className="text-3xl font-extrabold text-emerald-700">14.85%</h3>
            </div>
            <div className="bg-white p-5 rounded-xl border border-rose-200 shadow-sm shadow-rose-100">
              <p className="text-sm text-rose-700 font-bold mb-1">Portfolio Risk (Volatility)</p>
              <h3 className="text-3xl font-extrabold text-rose-700">11.24%</h3>
            </div>
            <div className="bg-white p-5 rounded-xl border border-primary-200 shadow-sm shadow-primary-100">
              <p className="text-sm text-primary-700 font-bold mb-1">Sharpe Ratio</p>
              <h3 className="text-3xl font-extrabold text-primary-700">1.85</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
              <h3 className="font-bold text-slate-900 self-start mb-4">Allocation Distribution</h3>
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
                    <RechartsTooltip 
                      formatter={(value: number) => [`${value}%`, 'Allocation']}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}
                    />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '12px', marginTop: '20px' }} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-200">
                <h3 className="font-bold text-slate-900">Allocation Breakdown</h3>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Asset</th>
                      <th className="px-5 py-3 font-semibold text-right">Weight</th>
                      <th className="px-5 py-3 font-semibold text-right">Exp. Return</th>
                      <th className="px-5 py-3 font-semibold text-right">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultsPortfolio.map((asset, i) => (
                      <tr key={asset.symbol} className={cn("border-b border-slate-100 hover:bg-slate-50", i === resultsPortfolio.length - 1 ? 'border-b-0' : '')}>
                        <td className="px-5 py-3 flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }}></div>
                          <span className="font-bold text-slate-900">{asset.symbol}</span>
                        </td>
                        <td className="px-5 py-3 text-right font-semibold text-slate-900">{asset.allocation}%</td>
                        <td className="px-5 py-3 text-right text-emerald-600 font-medium">{asset.expectedReturn}%</td>
                        <td className="px-5 py-3 text-right text-rose-600 font-medium">{asset.risk}%</td>
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
              className="flex-1 py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              Test with Historical Data (Backtest)
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/performance')}
              className="flex-1 py-4 bg-white text-slate-800 border-2 border-slate-200 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center gap-2"
            >
              View Detailed Performance
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

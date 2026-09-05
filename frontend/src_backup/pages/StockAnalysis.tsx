import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Info, ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn';

export default function StockAnalysis() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  
  const [stocks, setStocks] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCorrelationStocks, setSelectedCorrelationStocks] = useState<string[]>([]);
  const [correlationMatrix, setCorrelationMatrix] = useState<Record<string, Record<string, number>> | null>(null);

  useEffect(() => {
    if (activeTab === 'correlation' && symbol) {
      if (selectedCorrelationStocks.length === 0) {
        setSelectedCorrelationStocks([symbol]);
      }
    }
  }, [activeTab, symbol]);

  useEffect(() => {
    if (selectedCorrelationStocks.length >= 2) {
      fetch('http://localhost:8000/api/correlation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbols: selectedCorrelationStocks })
      })
      .then(res => res.json())
      .then(data => setCorrelationMatrix(data));
    } else {
      setCorrelationMatrix(null);
    }
  }, [selectedCorrelationStocks]);

  useEffect(() => {
    fetch('http://localhost:8000/api/stocks')
      .then(res => res.json())
      .then(data => {
        setStocks(data);
        if (!symbol && data.length > 0) {
          navigate(`/stocks/${data[0].symbol}`, { replace: true });
        }
      });
  }, [symbol, navigate]);

  useEffect(() => {
    if (symbol) {
      fetch(`http://localhost:8000/api/stocks/${symbol}/chart`)
        .then(res => res.json())
        .then(data => setChartData(data));
    }
  }, [symbol]);

  const selectedStock = stocks.find(s => s.symbol === symbol) || stocks[0];
  
  if (!selectedStock) {
    return <div className="p-8 text-center text-slate-400">Loading stock data...</div>;
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'returns', label: 'Returns' },
    { id: 'risk', label: 'Risk & Volatility' },
    { id: 'correlation', label: 'Correlation' }
  ];

  const statCards = [
    { label: 'Current Price', value: `₹${selectedStock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` },
    { label: 'Daily Return', value: `${selectedStock.dailyReturn > 0 ? '+' : ''}${selectedStock.dailyReturn}%`, isPercent: true, val: selectedStock.dailyReturn },
    { label: 'Annual Return', value: `${selectedStock.annualReturn}%`, isPercent: true, val: selectedStock.annualReturn },
    { label: 'Volatility', value: `${selectedStock.volatility}%`, tooltip: 'Annualized standard deviation of daily returns' },
    { label: '52 Week High', value: `₹${selectedStock.high52.toLocaleString('en-IN')}` },
    { label: '52 Week Low', value: `₹${selectedStock.low52.toLocaleString('en-IN')}` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Stock Selector Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0 bg-slate-900/40 backdrop-blur-md border border-indigo-900/40 rounded-xl overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-indigo-900/40 bg-slate-900/40">
            <h3 className="font-bold text-white">Select Stock</h3>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {stocks.map((stock) => (
              <Link
                key={stock.symbol}
                to={`/stocks/${stock.symbol}`}
                className={cn(
                  "p-3 rounded-xl flex items-center justify-between transition-all duration-300",
                  stock.symbol === selectedStock.symbol 
                    ? "bg-gradient-to-r from-primary-50 to-white border border-primary-200 shadow-sm" 
                    : "hover:bg-slate-900/40 border border-transparent"
                )}
              >
                <div>
                  <div className={cn("font-bold text-sm", stock.symbol === selectedStock.symbol ? "text-primary-700" : "text-slate-200")}>{stock.symbol}</div>
                  <div className="text-xs text-slate-400 truncate w-24">{stock.name}</div>
                </div>
                <div className={cn("text-xs font-medium flex items-center", stock.dailyReturn >= 0 ? "text-emerald-600" : "text-rose-600")}>
                  {stock.dailyReturn >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(stock.dailyReturn)}%
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div className="bg-slate-900/40 backdrop-blur-xl p-6 rounded-2xl border border-indigo-500/20 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-white">{selectedStock.symbol}</h2>
              <p className="text-slate-400 font-medium">{selectedStock.name}</p>
            </div>
            <Link 
              to="/optimizer"
              className="px-6 py-2.5 bg-slate-900 border border-indigo-500/50 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/50 font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 shadow-md shadow-primary-500/20"
            >
              Use This Stock
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {statCards.map((stat, i) => (
              <div key={i} className="bg-slate-900/40 backdrop-blur-xl p-4 rounded-2xl border border-indigo-500/20 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-transform duration-300">
                <div className="text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                  {stat.label}
                  {stat.tooltip && (
                    <div className="group relative">
                      <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                        {stat.tooltip}
                      </div>
                    </div>
                  )}
                </div>
                <div className={cn(
                  "text-xl font-bold",
                  stat.isPercent 
                    ? stat.val! >= 0 ? "text-emerald-600" : "text-rose-600"
                    : "text-white"
                )}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-indigo-500/20 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-hidden hover:border-indigo-500/30 transition-colors flex flex-col h-[450px]">
            <div className="flex border-b border-indigo-900/40 bg-slate-900/40 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors",
                    activeTab === tab.id
                      ? "border-primary-600 text-primary-700 bg-slate-900/40 backdrop-blur-md"
                      : "border-transparent text-slate-300 hover:text-white hover:bg-slate-800/40/50"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="flex-1 p-6">
              {activeTab === 'overview' && (
                <div className="h-full flex flex-col">
                  <h4 className="font-semibold text-white mb-4">Historical Price (30 Days)</h4>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                        <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} tickMargin={10} minTickGap={30} />
                        <YAxis domain={['auto', 'auto']} tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val.toFixed(0)}`} width={60} />
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '8px', border: '1px solid #1e293b', backgroundColor: '#0f172a', color: '#f8fafc', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Price']}
                          labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                        />
                        <Area type="monotone" dataKey="price" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {activeTab === 'returns' && (
                <div className="h-full flex flex-col">
                  <h4 className="font-semibold text-white mb-4">Daily Returns (%)</h4>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                        <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} tickMargin={10} minTickGap={30} />
                        <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} width={50} />
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '8px', border: '1px solid #1e293b', backgroundColor: '#0f172a', color: '#f8fafc' }}
                          formatter={(value: number) => [`${value.toFixed(2)}%`, 'Return']}
                        />
                        <Line type="linear" dataKey="return_val" stroke="#a855f7" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {activeTab === 'risk' && (
                <div className="h-full flex flex-col">
                  <h4 className="font-semibold text-white mb-4">Rolling Volatility (30 Days)</h4>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                        <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} tickMargin={10} minTickGap={30} />
                        <YAxis domain={['auto', 'auto']} tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} width={50} />
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '8px', border: '1px solid #1e293b', backgroundColor: '#0f172a', color: '#f8fafc' }}
                          formatter={(value: number) => [`${value.toFixed(2)}%`, 'Volatility']}
                        />
                        <Line type="monotone" dataKey="volatility" stroke="#fb7185" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {activeTab === 'correlation' && (
                <div className="h-full flex flex-col">
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-slate-200 mb-2">Select Assets for Comparison</label>
                    <div className="flex flex-wrap gap-2">
                      {stocks.map(s => (
                        <label key={s.symbol} className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm cursor-pointer transition-colors",
                          selectedCorrelationStocks.includes(s.symbol) 
                            ? "border-primary-500 bg-primary-50 text-primary-700 font-medium" 
                            : "border-indigo-900/40 hover:bg-slate-900/40 text-slate-300"
                        )}>
                          <input 
                            type="checkbox" 
                            className="hidden"
                            checked={selectedCorrelationStocks.includes(s.symbol)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCorrelationStocks(prev => [...prev, s.symbol]);
                              } else {
                                setSelectedCorrelationStocks(prev => prev.filter(x => x !== s.symbol));
                              }
                            }}
                          />
                          {s.symbol}
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-auto border border-indigo-900/40 rounded-xl rounded-b-none border-b-0 bg-slate-900/40 backdrop-blur-md">
                    {selectedCorrelationStocks.length < 2 ? (
                      <div className="h-full flex items-center justify-center p-6">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-slate-800/40 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Info className="w-6 h-6 text-slate-400" />
                          </div>
                          <p className="text-sm text-slate-400">Please select at least two assets to compute the Pearson correlation matrix.</p>
                        </div>
                      </div>
                    ) : correlationMatrix ? (
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-900/40 sticky top-0 z-10 shadow-sm">
                          <tr>
                            <th className="px-6 py-3 font-semibold bg-slate-900/40">Asset</th>
                            {selectedCorrelationStocks.map(sym => (
                              <th key={sym} className="px-6 py-3 font-semibold text-center bg-slate-900/40">{sym}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {selectedCorrelationStocks.map((rowSym) => (
                            <tr key={rowSym} className="border-b border-indigo-900/30 hover:bg-slate-900/40 transition-colors">
                              <td className="px-6 py-3 font-bold text-white bg-slate-900/40 backdrop-blur-md sticky left-0 shadow-[1px_0_0_0_#f1f5f9] z-10">{rowSym}</td>
                              {selectedCorrelationStocks.map((colSym) => {
                                const val = correlationMatrix[rowSym]?.[colSym] || 0;
                                return (
                                  <td key={colSym} className="px-6 py-3 text-center">
                                    <span className={cn(
                                      "px-2 py-1 rounded font-medium",
                                      val > 0.7 ? "bg-emerald-950/40 border border-emerald-500/30 text-emerald-800" :
                                      val > 0.3 ? "bg-emerald-950/30 text-emerald-600" :
                                      val < -0.7 ? "bg-rose-950/40 border border-rose-500/30 text-rose-800" :
                                      val < -0.3 ? "bg-rose-950/30 text-rose-600" :
                                      "bg-slate-800/40 text-slate-300"
                                    )}>
                                      {val.toFixed(2)}
                                    </span>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="h-full flex items-center justify-center p-6">
                        <div className="text-sm text-slate-400 animate-pulse">Calculating matrix...</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { STOCKS, STOCK_CHART_DATA } from '../data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Info, ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn';

export default function StockAnalysis() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  
  const selectedStock = STOCKS.find(s => s.symbol === symbol) || STOCKS[0];
  const [activeTab, setActiveTab] = useState('overview');

  // If URL has no symbol but we matched the route, we might want to redirect to the first stock
  // or just use the first stock as default (which we do above).
  useEffect(() => {
    if (!symbol) {
      navigate(`/stocks/${STOCKS[0].symbol}`, { replace: true });
    }
  }, [symbol, navigate]);

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
        <div className="w-full md:w-64 flex-shrink-0 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-bold text-slate-900">Select Stock</h3>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {STOCKS.map((stock) => (
              <Link
                key={stock.symbol}
                to={`/stocks/${stock.symbol}`}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg transition-colors",
                  stock.symbol === selectedStock.symbol 
                    ? "bg-primary-50 border border-primary-100" 
                    : "hover:bg-slate-50 border border-transparent"
                )}
              >
                <div>
                  <div className={cn("font-bold text-sm", stock.symbol === selectedStock.symbol ? "text-primary-700" : "text-slate-700")}>{stock.symbol}</div>
                  <div className="text-xs text-slate-500 truncate w-24">{stock.name}</div>
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
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">{selectedStock.symbol}</h2>
              <p className="text-slate-500 font-medium">{selectedStock.name}</p>
            </div>
            <Link 
              to="/optimizer"
              className="px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-primary-500/20"
            >
              Use This Stock
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {statCards.map((stat, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
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
                    : "text-slate-900"
                )}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[450px]">
            <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors",
                    activeTab === tab.id
                      ? "border-primary-600 text-primary-700 bg-white"
                      : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="flex-1 p-6">
              {activeTab === 'overview' && (
                <div className="h-full flex flex-col">
                  <h4 className="font-semibold text-slate-900 mb-4">Historical Price (30 Days)</h4>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={STOCK_CHART_DATA}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} tickMargin={10} minTickGap={30} />
                        <YAxis domain={['auto', 'auto']} tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val.toFixed(0)}`} width={60} />
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Price']}
                          labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                        />
                        <Area type="monotone" dataKey="price" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {activeTab === 'returns' && (
                <div className="h-full flex flex-col">
                  <h4 className="font-semibold text-slate-900 mb-4">Daily Returns (%)</h4>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={STOCK_CHART_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} tickMargin={10} minTickGap={30} />
                        <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} width={50} />
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                          formatter={(value: number) => [`${value.toFixed(2)}%`, 'Return']}
                        />
                        <Line type="linear" dataKey="return" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {activeTab === 'risk' && (
                <div className="h-full flex flex-col">
                  <h4 className="font-semibold text-slate-900 mb-4">Rolling Volatility (30 Days)</h4>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={STOCK_CHART_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} tickMargin={10} minTickGap={30} />
                        <YAxis domain={['auto', 'auto']} tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} width={50} />
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                          formatter={(value: number) => [`${value.toFixed(2)}%`, 'Volatility']}
                        />
                        <Line type="monotone" dataKey="volatility" stroke="#f43f5e" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {activeTab === 'correlation' && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Info className="w-8 h-8 text-slate-400" />
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-2">Correlation Matrix</h4>
                    <p className="text-sm text-slate-500 max-w-sm">Correlation data is computed dynamically when optimizing the portfolio involving multiple assets.</p>
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

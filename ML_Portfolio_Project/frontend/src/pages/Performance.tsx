import { useNavigate } from 'react-router-dom';
import { BACKTEST_DATA } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';
import { RefreshCw, ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../utils/cn';

export default function Performance() {
  const navigate = useNavigate();

  // Create mock drawdown data
  const drawdownData = BACKTEST_DATA.map(d => ({
    month: d.month,
    drawdown: -1 * Math.abs(Math.sin(BACKTEST_DATA.indexOf(d) * 0.5) * 5 + Math.random() * 2)
  }));

  // Create mock risk/return scatter data
  const scatterData = [
    { name: 'Optimized Portfolio', risk: 11.4, return: 18.5, color: '#8b5cf6' },
    { name: 'NIFTY 50', risk: 14.2, return: 12.1, color: '#94a3b8' },
    { name: 'Equal Weight', risk: 13.5, return: 15.2, color: '#3b82f6' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Performance Analytics</h2>
          <p className="text-slate-500">Comprehensive breakdown of portfolio metrics and risk characteristics.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <button 
            onClick={() => navigate('/optimizer')}
            className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 text-sm shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            New Optimization
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h3 className="font-bold text-slate-900">Benchmark Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Metric</th>
                <th className="px-6 py-4 font-semibold bg-purple-50/50 text-purple-900">Optimized Portfolio</th>
                <th className="px-6 py-4 font-semibold">NIFTY 50</th>
                <th className="px-6 py-4 font-semibold">Equal Weight</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-700">Annualized Return</td>
                <td className="px-6 py-4 font-bold text-emerald-600 bg-purple-50/30">18.5%</td>
                <td className="px-6 py-4 font-semibold text-slate-900">12.1%</td>
                <td className="px-6 py-4 font-semibold text-slate-900">15.2%</td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-700">Annualized Volatility (Risk)</td>
                <td className="px-6 py-4 font-bold text-emerald-600 bg-purple-50/30">11.4%</td>
                <td className="px-6 py-4 font-semibold text-slate-900">14.2%</td>
                <td className="px-6 py-4 font-semibold text-slate-900">13.5%</td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-700">Sharpe Ratio</td>
                <td className="px-6 py-4 font-bold text-emerald-600 bg-purple-50/30">1.92</td>
                <td className="px-6 py-4 font-semibold text-slate-900">0.85</td>
                <td className="px-6 py-4 font-semibold text-slate-900">1.12</td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-700">Maximum Drawdown</td>
                <td className="px-6 py-4 font-bold text-emerald-600 bg-purple-50/30">-5.2%</td>
                <td className="px-6 py-4 font-semibold text-slate-900">-12.4%</td>
                <td className="px-6 py-4 font-semibold text-slate-900">-8.7%</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-700">Win Rate (Months)</td>
                <td className="px-6 py-4 font-bold text-emerald-600 bg-purple-50/30">75%</td>
                <td className="px-6 py-4 font-semibold text-slate-900">58%</td>
                <td className="px-6 py-4 font-semibold text-slate-900">66%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Drawdown Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[350px]">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-slate-900">Drawdown Profile</h3>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={drawdownData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  formatter={(value: number) => [`${value.toFixed(2)}%`, 'Drawdown']}
                  cursor={{fill: '#f1f5f9'}}
                />
                <Bar dataKey="drawdown" fill="#ef4444" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk vs Return Scatter */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[350px]">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-slate-900">Risk vs Return (Efficient Frontier Area)</h3>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" dataKey="risk" name="Risk (Volatility)" unit="%" tick={{fontSize: 12, fill: '#64748b'}} domain={[10, 16]} label={{ value: 'Risk (Annualized Volatility %)', position: 'insideBottom', offset: -15, fontSize: 12, fill: '#64748b' }} />
                <YAxis type="number" dataKey="return" name="Expected Return" unit="%" tick={{fontSize: 12, fill: '#64748b'}} domain={[10, 20]} label={{ value: 'Expected Return %', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#64748b' }} />
                <ZAxis range={[100, 100]} />
                <RechartsTooltip 
                  cursor={{strokeDasharray: '3 3'}}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                />
                {scatterData.map((entry, index) => (
                  <Scatter key={index} name={entry.name} data={[entry]} fill={entry.color} />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-purple-500"></div> Optimized</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-slate-400"></div> NIFTY 50</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Equal Wt</div>
          </div>
        </div>
      </div>
    </div>
  );
}

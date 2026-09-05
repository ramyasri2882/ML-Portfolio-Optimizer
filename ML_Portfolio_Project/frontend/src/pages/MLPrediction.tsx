import { Link, useNavigate } from 'react-router-dom';
import { ML_PREDICTIONS, ML_ACTUAL_VS_PREDICTED } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { Database, ArrowRight, Cpu, Target, BrainCircuit, Activity } from 'lucide-react';
import { cn } from '../utils/cn';

export default function MLPrediction() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Machine Learning Prediction</h2>
          <p className="text-slate-500">Predict expected stock returns using historical market features.</p>
        </div>
        <button 
          onClick={() => navigate('/optimizer')}
          className="px-5 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-sm shadow-primary-500/20"
        >
          Use Predictions for Optimization
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ML Pipeline Flowchart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Prediction Pipeline</h3>
        <div className="flex items-center min-w-max">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 z-10 relative">
              <Database className="w-8 h-8 text-slate-600" />
            </div>
            <span className="text-xs font-semibold text-slate-700 mt-3">Historical Data</span>
          </div>
          <div className="h-0.5 w-16 bg-slate-200 flex-shrink-0 -mt-8 relative">
            <ArrowRight className="absolute -right-1 -top-2 w-4 h-4 text-slate-400" />
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-200 z-10 relative">
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-slate-700 mt-3">Feature Eng.</span>
          </div>
          <div className="h-0.5 w-16 bg-slate-200 flex-shrink-0 -mt-8 relative">
            <ArrowRight className="absolute -right-1 -top-2 w-4 h-4 text-slate-400" />
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-purple-50 rounded-xl flex items-center justify-center border border-purple-200 z-10 relative">
              <Cpu className="w-8 h-8 text-purple-600" />
            </div>
            <span className="text-xs font-semibold text-slate-700 mt-3">Random Forest</span>
          </div>
          <div className="h-0.5 w-16 bg-slate-200 flex-shrink-0 -mt-8 relative">
            <ArrowRight className="absolute -right-1 -top-2 w-4 h-4 text-slate-400" />
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-200 z-10 relative">
              <Target className="w-8 h-8 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold text-slate-700 mt-3">Predicted Return</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-purple-600" />
              Model Predictions (Next 30 Days)
            </h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Stock</th>
                  <th className="px-6 py-4 font-semibold">Predicted Return</th>
                  <th className="px-6 py-4 font-semibold">Signal</th>
                  <th className="px-6 py-4 font-semibold">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {ML_PREDICTIONS.map((pred, i) => (
                  <tr key={pred.symbol} className={cn("border-b border-slate-100 hover:bg-slate-50 transition-colors", i === ML_PREDICTIONS.length - 1 ? 'border-b-0' : '')}>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{pred.symbol}</div>
                      <div className="text-xs text-slate-500">{pred.name}</div>
                    </td>
                    <td className={cn("px-6 py-4 font-semibold", pred.predictedReturn >= 0 ? "text-emerald-600" : "text-rose-600")}>
                      {pred.predictedReturn > 0 ? '+' : ''}{pred.predictedReturn.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 text-xs font-bold rounded-md",
                        pred.signal === 'BUY' ? "bg-emerald-100 text-emerald-700" :
                        pred.signal === 'SELL' ? "bg-rose-100 text-rose-700" :
                        "bg-slate-100 text-slate-700"
                      )}>
                        {pred.signal}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full", pred.confidence > 75 ? "bg-emerald-500" : pred.confidence > 60 ? "bg-blue-500" : "bg-amber-500")} 
                            style={{ width: `${pred.confidence}%` }}
                          />
                        </div>
                        <span className="font-medium text-slate-700">{pred.confidence}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Metrics & Chart */}
        <div className="space-y-6 flex flex-col">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Model Performance Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">Root Mean Square Error (RMSE)</span>
                  <span className="font-semibold text-slate-900">0.024</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="w-1/4 h-full bg-blue-500"></div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">Mean Absolute Error (MAE)</span>
                  <span className="font-semibold text-slate-900">0.018</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="w-1/5 h-full bg-indigo-500"></div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">R² Score (Testing Data)</span>
                  <span className="font-semibold text-slate-900">0.76</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="w-3/4 h-full bg-emerald-500"></div></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col min-h-[300px]">
            <h3 className="font-bold text-slate-900 mb-4">Actual vs Predicted (Test Set)</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ML_ACTUAL_VS_PREDICTED.slice(0, 5)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="symbol" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    cursor={{ fill: '#f1f5f9' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="actual" name="Actual Return" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="predicted" name="Predicted Return" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

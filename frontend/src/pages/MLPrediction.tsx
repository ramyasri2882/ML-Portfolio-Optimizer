import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { Database, ArrowRight, Cpu, Target, BrainCircuit, Activity, RefreshCw } from 'lucide-react';
import { cn } from '../utils/cn';
import { useUser } from '../App';

export default function MLPrediction() {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [predictions, setPredictions] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchPredictions = () => {
    fetch(`http://127.0.0.1:8000/api/users/${currentUser.id}/ml-predictions`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setPredictions(data);
        } else {
          // Fallback to global if none for user
          fetch('http://127.0.0.1:8000/api/ml-predictions')
            .then(r => r.json())
            .then(d => setPredictions(d));
        }
      });
  };

  useEffect(() => {
    fetchPredictions();
  }, [currentUser.id]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await fetch(`http://127.0.0.1:8000/api/users/${currentUser.id}/ml-predictions`, {
        method: 'POST'
      });
      fetchPredictions();
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const actualVsPredicted = predictions.map(p => ({
    symbol: p.symbol,
    predicted: p.predictedReturn,
    actual: p.actualReturn || p.actual
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-white">Machine Learning Prediction</h2>
          <p className="text-slate-400">Predict expected stock returns using historical market features.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-5 py-2.5 bg-[#030B1C]/60 border border-purple-500/50 text-purple-400 hover:text-purple-300 hover:bg-purple-950/40 font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={cn("w-4 h-4", isGenerating && "animate-spin")} />
            {isGenerating ? 'Training Model...' : 'Run New Prediction'}
          </button>
          <button 
            onClick={() => navigate('/optimizer')}
            className="px-5 py-2.5 bg-[#020817] border border-cyan-500/50 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40 font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 shadow-md"
          >
            Use Predictions
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ML Pipeline Flowchart */}
      <div className="glass-card p-6 rounded-2xl overflow-x-auto">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Prediction Pipeline</h3>
        <div className="flex items-center min-w-max">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-800/40 rounded-xl flex items-center justify-center border border-cyan-900/40 z-10 relative">
              <Database className="w-8 h-8 text-slate-300" />
            </div>
            <span className="text-xs font-semibold text-slate-200 mt-3">Historical Data</span>
          </div>
          <div className="h-0.5 w-16 bg-cyan-900/50 flex-shrink-0 -mt-8 relative">
            <ArrowRight className="absolute -right-1 -top-2 w-4 h-4 text-slate-400" />
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-950/30 rounded-xl flex items-center justify-center border border-blue-200 z-10 relative">
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-slate-200 mt-3">Feature Eng.</span>
          </div>
          <div className="h-0.5 w-16 bg-cyan-900/50 flex-shrink-0 -mt-8 relative">
            <ArrowRight className="absolute -right-1 -top-2 w-4 h-4 text-slate-400" />
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-purple-950/30 rounded-xl flex items-center justify-center border border-purple-200 z-10 relative">
              <Cpu className="w-8 h-8 text-purple-600" />
            </div>
            <span className="text-xs font-semibold text-slate-200 mt-3">Random Forest</span>
          </div>
          <div className="h-0.5 w-16 bg-cyan-900/50 flex-shrink-0 -mt-8 relative">
            <ArrowRight className="absolute -right-1 -top-2 w-4 h-4 text-slate-400" />
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-950/30 rounded-xl flex items-center justify-center border border-emerald-200 z-10 relative">
              <Target className="w-8 h-8 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold text-slate-200 mt-3">Predicted 30-Day Return</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table */}
        <div className="lg:col-span-2 glass-card rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.6)] overflow-hidden hover:border-indigo-500/30 transition-colors flex flex-col">
          <div className="p-5 border-b border-cyan-900/40 flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-purple-600" />
              Model Predictions (Latest Run)
            </h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-[#030B1C]/60 border-b border-cyan-900/40">
                <tr>
                  <th className="px-6 py-4 font-semibold">Stock</th>
                  <th className="px-6 py-4 font-semibold">Predicted 30-Day Return</th>
                  <th className="px-6 py-4 font-semibold">Signal</th>
                  <th className="px-6 py-4 font-semibold">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((pred, i) => (
                  <tr key={pred.symbol + i} className={cn("border-b border-cyan-900/30 hover:bg-[#030B1C]/60 transition-colors", i === predictions.length - 1 ? 'border-b-0' : '')}>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{pred.symbol}</div>
                      <div className="text-xs text-slate-400">{pred.name}</div>
                    </td>
                    <td className={cn("px-6 py-4 font-semibold", pred.predictedReturn >= 0 ? "text-emerald-600" : "text-rose-600")}>
                      {pred.predictedReturn > 0 ? '+' : ''}{pred.predictedReturn.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 text-xs font-bold rounded-md",
                        pred.signal === 'BUY' ? "bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" :
                        pred.signal === 'SELL' ? "bg-rose-950/40 border border-rose-500/30 text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]" :
                        "bg-slate-800/40 text-slate-200"
                      )}>
                        {pred.signal}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-800/40 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full", pred.confidence > 75 ? "bg-emerald-950/300" : pred.confidence > 60 ? "bg-blue-950/300" : "bg-amber-500")} 
                            style={{ width: `${pred.confidence}%` }}
                          />
                        </div>
                        <span className="font-medium text-slate-200">{pred.confidence}%</span>
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
          <div className="bg-[#030B1C]/60 backdrop-blur-md p-5 rounded-xl border border-cyan-900/40 shadow-sm">
            <h3 className="font-bold text-white mb-4">Model Performance Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Root Mean Square Error (RMSE)</span>
                  <span className="font-semibold text-white">0.024</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800/40 rounded-full overflow-hidden"><div className="w-1/4 h-full bg-blue-950/300"></div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Mean Absolute Error (MAE)</span>
                  <span className="font-semibold text-white">0.018</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800/40 rounded-full overflow-hidden"><div className="w-1/5 h-full bg-indigo-500"></div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">R² Score (Testing Data)</span>
                  <span className="font-semibold text-white">0.76</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800/40 rounded-full overflow-hidden"><div className="w-3/4 h-full bg-emerald-950/300"></div></div>
              </div>
            </div>
          </div>

          <div className="bg-[#030B1C]/60 backdrop-blur-md p-5 rounded-xl border border-cyan-900/40 shadow-sm flex-1 flex flex-col min-h-[300px]">
            <h3 className="font-bold text-white mb-4">Actual vs Predicted (Test Set)</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={actualVsPredicted.slice(0, 5)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0, 255, 255, 0.05)" />
                  <XAxis dataKey="symbol" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #1e293b', backgroundColor: '#0f172a', color: '#f8fafc', fontSize: '12px' }}
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

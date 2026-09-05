import { useUser } from '../App';
import { Briefcase, Trash2, ExternalLink, Calendar, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MyPortfolios() {
  const { currentUser, deletePortfolio } = useUser();
  const navigate = useNavigate();

  const portfolios = currentUser.portfolios || [];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">My Portfolios</h2>
          <p className="text-slate-400 text-sm mt-1">Manage and review your saved optimization results.</p>
        </div>
        <button 
          onClick={() => navigate('/optimizer')}
          className="btn-fintech py-2 px-4 flex items-center gap-2"
        >
          <Briefcase className="w-4 h-4" />
          Create New Portfolio
        </button>
      </div>

      {portfolios.length === 0 ? (
        <div className="glass-panel p-12 rounded-xl border border-cyan-900/30 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-cyan-900/20 border border-cyan-500/30 flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8 text-cyan-500/50" />
          </div>
          <h3 className="text-lg font-bold text-slate-300">No Portfolios Found</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-md">You haven't saved any optimized portfolios yet. Run the Portfolio Optimizer and save your results to see them here.</p>
          <button 
            onClick={() => navigate('/optimizer')}
            className="mt-6 text-cyan-400 hover:text-cyan-300 font-mono text-sm uppercase tracking-widest flex items-center gap-2 group"
          >
            Launch Optimizer <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {portfolios.map(p => (
            <div key={p.id} className="glass-panel p-6 rounded-xl border border-cyan-900/30 hover:border-cyan-500/50 transition-colors shadow-lg relative group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{p.name || 'Optimized Portfolio'}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono px-2 py-0.5 bg-cyan-950/40 text-cyan-300 border border-cyan-900/50 rounded">{p.objective}</span>
                    <span className="text-xs font-mono px-2 py-0.5 bg-purple-950/40 text-purple-300 border border-purple-900/50 rounded">{p.riskPreference} Risk</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => deletePortfolio(p.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors border border-transparent hover:border-red-500/30"
                    title="Delete Portfolio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4 border-y border-cyan-900/30 mb-4">
                <div>
                  <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> Exp. Return</p>
                  <p className="text-lg font-bold text-emerald-400 font-mono">{(p.expectedReturn * 100).toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Risk (Vol)</p>
                  <p className="text-lg font-bold text-amber-400 font-mono">{(p.risk * 100).toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-1 flex items-center gap-1"><Briefcase className="w-3 h-3"/> Sharpe</p>
                  <p className="text-lg font-bold text-cyan-400 font-mono">{p.sharpeRatio.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-2 font-medium">Allocated Assets ({p.allocations ? Object.keys(p.allocations).length : 0})</p>
                <div className="flex flex-wrap gap-2">
                  {p.allocations && Object.entries(p.allocations)
                    .filter(([_, weight]) => (weight as number) > 0.01)
                    .map(([sym, weight]) => (
                    <div key={sym} className="text-xs bg-[#020817] border border-cyan-900/40 px-2 py-1 rounded flex items-center gap-2">
                      <span className="font-bold text-slate-300">{sym}</span>
                      <span className="font-mono text-cyan-500">{((weight as number) * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-slate-500 pt-3 border-t border-cyan-900/20">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {p.created_at ? new Date(p.created_at).toLocaleDateString() : 'N/A'}</span>
                  <span className="font-mono">Invest: ₹{Number(p.amount || 10000).toLocaleString()}</span>
                </div>
                <button 
                  onClick={() => navigate('/backtesting')}
                  className="px-3 py-1.5 bg-indigo-950/40 border border-indigo-500/50 text-indigo-300 rounded hover:bg-indigo-900/60 transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" /> Run Backtest
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

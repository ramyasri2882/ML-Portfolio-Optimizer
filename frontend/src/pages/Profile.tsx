import { useUser } from '../App';
import { User, Activity, Briefcase, Settings, PieChart, Shield, History, MapPin } from 'lucide-react';
import { useState } from 'react';

export default function Profile() {
  const { currentUser, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || '');
  const [terminalName, setTerminalName] = useState(currentUser.terminalName || 'SECURE_NODE_01');

  // Derive stats dynamically from user context
  const optimizedCount = currentUser.portfolios ? currentUser.portfolios.length : 0;
  
  const stats = [
    { label: 'Optimized Portfolios', value: optimizedCount.toString(), icon: PieChart, color: 'text-cyan-400', bg: 'bg-cyan-950/40' },
    { label: 'Backtests Run', value: '0', icon: History, color: 'text-purple-400', bg: 'bg-purple-950/40' },
    { label: 'Saved Assets', value: currentUser.optimizerState?.selectedStocks?.length?.toString() || '0', icon: Briefcase, color: 'text-emerald-400', bg: 'bg-emerald-950/40' },
  ];

  const [isSaving, setIsSaving] = useState(false);
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUser({ name, email, avatarUrl, terminalName });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">Operator Profile</h2>
        <p className="text-slate-400 text-sm mt-1">Manage your terminal access and review system activity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Identity Card */}
        <div className="glass-card rounded-2xl border border-cyan-900/40 overflow-hidden shadow-lg shadow-cyan-900/10">
          <div className="h-32 bg-gradient-to-r from-cyan-900/40 via-[#01040A] to-purple-900/40 relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]"></div>
          </div>
          <div className="px-6 pb-6 relative">
            <div className="w-24 h-24 rounded-2xl bg-[#020817] border-2 border-cyan-500 shadow-[0_0_20px_rgba(0,255,255,0.3)] absolute -top-12 flex items-center justify-center overflow-hidden">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-cyan-400" />
              )}
            </div>
            
            <div className="pt-16">
              <h3 className="text-xl font-bold text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">{currentUser.name}</h3>
              <p className="text-cyan-500 text-sm font-mono tracking-wide">{currentUser.email}</p>
              
              <div className="mt-6 space-y-4 border-t border-cyan-900/30 pt-4">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Shield className="w-4 h-4 text-slate-500" />
                  <span>Access Level: <strong className="text-cyan-400 font-mono font-normal uppercase">{currentUser.accessLevel || 'OPERATOR'}</strong></span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Activity className="w-4 h-4 text-slate-500" />
                  <span>Status: <strong className="text-emerald-400 font-mono font-normal drop-shadow-[0_0_5px_rgba(16,185,129,0.5)] uppercase">{currentUser.lastActivity || 'ONLINE'}</strong></span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span>Terminal: <strong className="text-slate-400 font-mono font-normal uppercase">{currentUser.terminalName || 'SECURE_NODE_01'}</strong></span>
                </div>
              </div>

              <div className="mt-8">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full btn-fintech py-2 text-sm flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Edit Configuration
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Activity & Stats */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="glass-panel p-5 rounded-xl border border-cyan-900/30 flex items-center gap-4 hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)] transition-all">
                <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center border border-current ${stat.color} shadow-[0_0_10px_currentColor_inset]`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">{stat.value}</p>
                  <p className="text-xs text-slate-400 uppercase tracking-widest">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-panel rounded-xl border border-cyan-900/30 overflow-hidden">
            <div className="px-6 py-4 border-b border-cyan-900/40 bg-[#01040A]">
              <h3 className="font-bold text-white text-sm uppercase tracking-widest">Recent Terminal Activity</h3>
            </div>
            <div className="divide-y divide-cyan-900/20 max-h-64 overflow-y-auto">
              {currentUser.notifications && currentUser.notifications.map((log: any, i: number) => (
                <div key={i} className="px-6 py-4 flex items-start justify-between hover:bg-[#020817]/60 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-slate-200 font-mono">{log.text}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className={`text-[10px] font-mono mt-1 font-bold text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]`}>[SYS_LOG]</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#020817]/80 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-[#01040A] border border-cyan-500/30 rounded-xl shadow-[0_0_30px_rgba(0,255,255,0.1)] p-6">
            <h2 className="text-xl font-bold text-white mb-4 drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">Edit Configuration</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cyan-100 mb-1">Full Name</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#020817] border border-cyan-900/50 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-100 mb-1">Email</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#020817] border border-cyan-900/50 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-100 mb-1">Avatar URL</label>
                <input type="url" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} className="w-full bg-[#020817] border border-cyan-900/50 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-100 mb-1">Terminal Name</label>
                <input type="text" value={terminalName} onChange={e => setTerminalName(e.target.value)} className="w-full bg-[#020817] border border-cyan-900/50 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-2 px-4 bg-[#020817] border border-cyan-900/50 rounded-lg text-slate-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={isSaving} className="flex-1 py-2 px-4 bg-cyan-950/40 border border-cyan-500 text-cyan-300 font-semibold rounded-lg hover:shadow-[0_0_15px_rgba(0,255,255,0.2)_inset] transition-all disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

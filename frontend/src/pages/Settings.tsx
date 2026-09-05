import { useUser } from '../App';
import { Settings as SettingsIcon, Bell, Palette, Shield, Save, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Settings() {
  const { currentUser, updateUser } = useUser();
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [notifications, setNotifications] = useState(currentUser.settings?.notifications ?? true);
  const [theme, setTheme] = useState(currentUser.settings?.theme ?? 'dark');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(currentUser.name);
    setEmail(currentUser.email);
    setNotifications(currentUser.settings?.notifications ?? true);
    setTheme(currentUser.settings?.theme ?? 'dark');
  }, [currentUser]);

  const handleSave = () => {
    updateUser({
      name,
      email,
      settings: { ...currentUser.settings, notifications, theme }
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">Global Settings</h2>
        <p className="text-slate-400 text-sm mt-1">Configure your terminal preferences and notification alerts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-cyan-950/40 border border-cyan-500/50 text-cyan-300 rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.1)_inset]">
            <SettingsIcon className="w-5 h-5" />
            <span className="font-semibold text-sm">General</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 border border-transparent hover:border-cyan-900/50 hover:bg-[#020817] hover:text-cyan-100 rounded-lg transition-all">
            <Bell className="w-5 h-5" />
            <span className="font-semibold text-sm">Notifications</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 border border-transparent hover:border-cyan-900/50 hover:bg-[#020817] hover:text-cyan-100 rounded-lg transition-all">
            <Palette className="w-5 h-5" />
            <span className="font-semibold text-sm">Appearance</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 border border-transparent hover:border-cyan-900/50 hover:bg-[#020817] hover:text-cyan-100 rounded-lg transition-all">
            <Shield className="w-5 h-5" />
            <span className="font-semibold text-sm">Security</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-xl border border-cyan-900/30">
            <h3 className="text-lg font-bold text-white mb-6 border-b border-cyan-900/30 pb-2">Profile Preferences</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-cyan-100 mb-1">Display Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#020817] border border-cyan-900/50 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 shadow-[inset_0_0_10px_rgba(0,255,255,0.02)]" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-cyan-100 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#020817] border border-cyan-900/50 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 shadow-[inset_0_0_10px_rgba(0,255,255,0.02)]" 
                />
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-cyan-900/30">
            <h3 className="text-lg font-bold text-white mb-6 border-b border-cyan-900/30 pb-2">System Preferences</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-cyan-100">System Notifications</h4>
                  <p className="text-xs text-slate-400 mt-1">Receive alerts for optimization and ML completion.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
                  <div className="w-11 h-6 bg-[#020817] border border-cyan-900/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-cyan-500 after:border-cyan-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-900/40 peer-checked:border-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.1)_inset]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-cyan-100">Terminal Theme</h4>
                  <p className="text-xs text-slate-400 mt-1">Select your preferred terminal color scheme.</p>
                </div>
                <select 
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="bg-[#020817] border border-cyan-900/50 rounded-lg px-3 py-1.5 text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="system">System</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              onClick={handleSave}
              className="btn-fintech py-2 px-6 flex items-center justify-center gap-2 relative overflow-hidden"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Saved</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

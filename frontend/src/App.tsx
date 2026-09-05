import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Cpu, PieChart, Activity, Award, Info, Search, Bell, User, Briefcase, Menu, X, Check, LogOut, Settings as SettingsIcon, Plus } from 'lucide-react';
import { cn } from './utils/cn';
import FinanceBackground from './components/FinanceBackground';

// Pages placeholders
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import StockAnalysis from './pages/StockAnalysis';
import MLPrediction from './pages/MLPrediction';
import Optimizer from './pages/Optimizer';
import Backtesting from './pages/Backtesting';
import Performance from './pages/Performance';
import About from './pages/About';
import Profile from './pages/Profile';
import MyPortfolios from './pages/MyPortfolios';
import Settings from './pages/Settings';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  lastActivity?: string;
  terminalName?: string;
  accessLevel?: string;
  portfolios: any[];
  optimizerState: {
    amount: string;
    selectedStocks: string[];
    riskPreference: string;
    objective: string;
    resultsPortfolio: any;
  };
  settings: {
    theme: string;
    notifications: boolean;
  };
  notifications: any[];
}

const defaultUsers: UserProfile[] = [
  { 
    id: '1', 
    name: 'Default Operator', 
    email: 'operator@ai.portfolio', 
    lastActivity: 'Active Now',
    terminalName: 'SECURE_NODE_01',
    accessLevel: 'ADMIN',
    portfolios: [],
    optimizerState: { amount: '10000', selectedStocks: [], riskPreference: 'moderate', objective: 'sharpe', resultsPortfolio: null },
    settings: { theme: 'dark', notifications: true },
    notifications: [
      { id: 1, text: 'Portfolio optimization completed for Defensive Strategy.', read: false },
      { id: 2, text: 'ML prediction updated for top 50 assets.', read: false },
      { id: 3, text: 'Backtest completed: Strategy outperformed benchmark by 12%.', read: false },
      { id: 4, text: 'Market data synchronized successfully.', read: true },
    ]
  },
];

interface UserContextType {
  users: UserProfile[];
  currentUser: UserProfile;
  switchUser: (id: string) => void;
  addUser: (user: Omit<UserProfile, 'id' | 'portfolios' | 'optimizerState' | 'settings' | 'notifications'>) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  updateOptimizerState: (updates: any) => void;
  savePortfolio: (portfolio: any) => void;
  deletePortfolio: (id: string) => void;
  updateNotifications: (notifications: any[]) => void;
}

export const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('portfolio_current_user_id_v2') || '1';
  });
  
  // Local state to hold frontend-only optimizer state per user
  const [optimizerStates, setOptimizerStates] = useState<Record<string, any>>({});

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/users');
      if (res.ok) {
        const data = await res.json();
        const mappedUsers: UserProfile[] = data.map((u: any) => ({
          id: u.id.toString(),
          name: u.name,
          email: u.email,
          avatarUrl: u.avatar || '',
          terminalName: u.terminalName,
          lastActivity: u.last_activity,
          accessLevel: 'OPERATOR',
          portfolios: u.portfolios || [],
          settings: { theme: u.theme, notifications: u.notifications_enabled },
          notifications: (u.notifications || []).map((n: any) => ({
            id: n.id,
            text: n.text,
            read: n.is_read
          }))
        }));
        setUsers(mappedUsers);
        
        // ensure current user exists
        if (mappedUsers.length > 0 && !mappedUsers.find(mu => mu.id === currentUserId)) {
          setCurrentUserId(mappedUsers[0].id);
        }
      }
    } catch (e) {
      console.error('Error fetching users:', e);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    localStorage.setItem('portfolio_current_user_id_v2', currentUserId);
    
    // Apply theme globally
    const currentUser = users.find(u => u.id === currentUserId);
    if (currentUser) {
      const theme = currentUser.settings.theme;
      if (theme === 'light' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches)) {
        document.documentElement.classList.add('light-theme');
      } else {
        document.documentElement.classList.remove('light-theme');
      }
    }
  }, [currentUserId, users]);

  const switchUser = (id: string) => {
    if (users.find(u => u.id === id)) {
      setCurrentUserId(id);
    }
  };

  const addUser = async (userData: Omit<UserProfile, 'id' | 'portfolios' | 'optimizerState' | 'settings' | 'notifications'>) => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          avatar: userData.avatarUrl || null
        })
      });
      if (res.ok) {
        const newUser = await res.json();
        await fetchUsers();
        setCurrentUserId(newUser.id.toString());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateUser = async (updates: Partial<UserProfile>) => {
    try {
      const payload: any = {};
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.email !== undefined) payload.email = updates.email;
      if (updates.avatarUrl !== undefined) payload.avatar = updates.avatarUrl;
      if (updates.terminalName !== undefined) payload.terminalName = updates.terminalName;
      
      if (updates.settings) {
        if (updates.settings.theme !== undefined) payload.theme = updates.settings.theme;
        if (updates.settings.notifications !== undefined) payload.notifications_enabled = updates.settings.notifications;
      }
      
      const res = await fetch(`http://127.0.0.1:8000/api/users/${currentUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        await fetchUsers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateOptimizerState = (updates: any) => {
    setOptimizerStates(prev => ({
      ...prev,
      [currentUserId]: { ...(prev[currentUserId] || { amount: '10000', selectedStocks: [], riskPreference: 'moderate', objective: 'sharpe', resultsPortfolio: null }), ...updates }
    }));
  };

  const savePortfolio = async (portfolio: any) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/users/${currentUserId}/portfolios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: portfolio.name,
          amount: portfolio.amount,
          riskPreference: portfolio.riskPreference || 'moderate',
          objective: portfolio.objective || 'sharpe',
          expectedReturn: portfolio.expectedReturn,
          risk: portfolio.risk,
          sharpeRatio: portfolio.sharpeRatio,
          allocations: portfolio.allocations || {}
        })
      });
      if (res.ok) {
        await fetchUsers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deletePortfolio = async (id: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/portfolios/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchUsers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateNotifications = async (newNotifs: any[]) => {
    // In a full implementation, we'd sync which ones are read
    // For now, if all are read, we hit read_all endpoint
    const allRead = newNotifs.every(n => n.read);
    if (allRead) {
      try {
        await fetch(`http://127.0.0.1:8000/api/users/${currentUserId}/notifications/read_all`, {
          method: 'PUT'
        });
        await fetchUsers();
      } catch (e) {}
    } else {
      // Find one that was marked read
      const oldNotifs = (users.find(u => u.id === currentUserId)?.notifications || []);
      for (const n of newNotifs) {
        const oldN = oldNotifs.find((on: any) => on.id === n.id);
        if (n.read && oldN && !oldN.read) {
          try {
            await fetch(`http://127.0.0.1:8000/api/notifications/${n.id}/read`, { method: 'PUT' });
          } catch(e) {}
        }
      }
      await fetchUsers();
    }
  };

  const baseUser = users.find(u => u.id === currentUserId) || users[0] || {} as UserProfile;
  const currentUser = {
    ...baseUser,
    optimizerState: optimizerStates[currentUserId] || { amount: '10000', selectedStocks: [], riskPreference: 'moderate', objective: 'sharpe', resultsPortfolio: null }
  };

  return (
    <UserContext.Provider value={{ users, currentUser, switchUser, addUser, updateUser, updateOptimizerState, savePortfolio, deletePortfolio, updateNotifications }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}

function Sidebar({ mobileOpen, setMobileOpen }: { mobileOpen: boolean, setMobileOpen: (o: boolean) => void }) {
  const location = useLocation();
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Stock Analysis', path: '/stocks', icon: TrendingUp },
    { name: 'ML Prediction', path: '/ml-prediction', icon: Cpu },
    { name: 'Portfolio Optimizer', path: '/optimizer', icon: PieChart },
    { name: 'Backtesting', path: '/backtesting', icon: Activity },
    { name: 'Performance', path: '/performance', icon: Award },
    { name: 'About Project', path: '/about', icon: Info },
  ];

  return (
    <>
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-[#020817]/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-screen w-64 bg-[#01040A] border-r border-cyan-900/30 transition-transform duration-300 lg:translate-x-0 flex flex-col shadow-[4px_0_30px_rgba(0,255,255,0.03)]",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center gap-3 px-6 py-6 border-b border-cyan-900/40">
          <div className="bg-[#01040A] border border-cyan-500/50 p-2 shadow-[0_0_15px_rgba(0,240,255,0.4)] rounded-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Briefcase className="w-5 h-5 text-cyan-400 relative z-10" />
          </div>
          <span className="font-bold text-xl text-white tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">AI.PORTFOLIO</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path) || (location.pathname === '/' && item.path === '/dashboard');
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all duration-300 border relative group overflow-hidden",
                  isActive 
                    ? "bg-cyan-950/40 text-cyan-300 border-cyan-500 shadow-[0_0_15px_rgba(0,240,255,0.2)_inset,0_0_15px_rgba(0,240,255,0.2)] font-semibold" 
                    : "border-transparent text-slate-400 hover:text-cyan-100 hover:bg-cyan-950/20 hover:border-cyan-500/30 hover:shadow-[0_0_10px_rgba(0,240,255,0.1)_inset]"
                )}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_10px_#00ffff]"></div>}
                <item.icon className={cn("w-5 h-5 transition-all duration-300 relative z-10", isActive ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" : "text-slate-500 group-hover:text-cyan-300 group-hover:drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]")} />
                <span className="relative z-10">{item.name}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000 ease-in-out z-0"></div>
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-cyan-900/40">
          <div className="px-3 py-3 bg-[#020817]/80 rounded-lg border border-cyan-900/30 relative overflow-hidden group hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)] transition-all cursor-default">
            <div className="absolute top-0 right-0 p-2 opacity-30 group-hover:opacity-100 transition-opacity"><Activity className="w-4 h-4 text-cyan-400 animate-pulse-slow" /></div>
            <p className="text-[10px] font-bold text-cyan-500/70 uppercase tracking-widest mb-1">System Status</p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#00ff66] animate-pulse"></span>
              <p className="text-xs font-semibold text-slate-200">Terminal Online</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function CreateUserModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { addUser } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      addUser({ 
        name, 
        email, 
        avatarUrl, 
        lastActivity: 'Active Now',
        terminalName: 'SECURE_NODE_NEW',
        accessLevel: 'OPERATOR' 
      });
      setName('');
      setEmail('');
      setAvatarUrl('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#020817]/80 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-[#01040A] border border-cyan-500/30 rounded-xl shadow-[0_0_30px_rgba(0,255,255,0.1)] p-6">
        <h2 className="text-xl font-bold text-white mb-4 drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">Create New Operator</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cyan-100 mb-1">Full Name</label>
            <input 
              required
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-[#020817] border border-cyan-900/50 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" 
              placeholder="E.g. John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-100 mb-1">Email</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#020817] border border-cyan-900/50 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" 
              placeholder="john@ai.portfolio"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-100 mb-1">Avatar URL (Optional)</label>
            <input 
              type="url" 
              value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
              className="w-full bg-[#020817] border border-cyan-900/50 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" 
              placeholder="https://..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-[#020817] border border-cyan-900/50 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-2 px-4 bg-cyan-950/40 border border-cyan-500 text-cyan-300 font-semibold rounded-lg hover:shadow-[0_0_15px_rgba(0,255,255,0.2)_inset] transition-all"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Header({ setMobileOpen }: { setMobileOpen: (o: boolean) => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, users, switchUser, updateNotifications } = useUser();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSwitchUser, setShowSwitchUser] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  
  const [stocks, setStocks] = useState<any[]>([]);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const switchUserRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/stocks')
      .then(res => res.json())
      .then(data => setStocks(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setSearchQuery('');
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setShowNotifications(false);
      
      // We want to handle profile/switch nesting nicely.
      if (profileRef.current && !profileRef.current.contains(event.target as Node) && 
          (!switchUserRef.current || !switchUserRef.current.contains(event.target as Node))) {
        setShowProfileMenu(false);
        setShowSwitchUser(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pages = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Stock Analysis', path: '/stocks' },
    { name: 'ML Prediction', path: '/ml-prediction' },
    { name: 'Portfolio Optimizer', path: '/optimizer' },
    { name: 'Backtesting', path: '/backtesting' },
    { name: 'Performance', path: '/performance' },
    { name: 'About Project', path: '/about' },
    { name: 'My Portfolios', path: '/my-portfolios' },
    { name: 'Settings', path: '/settings' },
  ];

  const searchResults = [
    ...pages.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => ({ ...p, type: 'Page' })),
    ...stocks.filter(s => s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || s.name.toLowerCase().includes(searchQuery.toLowerCase())).map(s => ({ name: s.symbol, path: `/stocks/${s.symbol}`, type: 'Stock' }))
  ].slice(0, 8);
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    if (path.startsWith('/dashboard')) return 'Dashboard';
    if (path.startsWith('/stocks')) return 'Stock Analysis';
    if (path.startsWith('/ml-prediction')) return 'ML Prediction';
    if (path.startsWith('/optimizer')) return 'Portfolio Optimizer';
    if (path.startsWith('/backtesting')) return 'Backtesting';
    if (path.startsWith('/performance')) return 'Performance';
    if (path.startsWith('/about')) return 'About Project';
    if (path.startsWith('/profile')) return 'Profile';
    if (path.startsWith('/my-portfolios')) return 'My Portfolios';
    if (path.startsWith('/settings')) return 'Settings';
    return 'Dashboard';
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      navigate(searchResults[0].path);
      setSearchQuery('');
    }
  };

  const notifications = currentUser.notifications || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-[#01040A] border-r border-cyan-900/30 border-b border-cyan-900/40 sticky top-0 z-50 lg:pl-64 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 relative">
        <div className="absolute top-0 left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent shadow-[0_0_15px_rgba(0,255,255,0.8)]"></div>
        
        <div className="flex items-center gap-3">
          <button 
            className="lg:hidden p-2 text-cyan-300 hover:text-cyan-100 hover:bg-cyan-900/30 rounded-lg border border-transparent hover:border-cyan-500/30 transition-all"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div>
            <h1 className="text-xl font-bold text-white hidden sm:block drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">{getPageTitle()}</h1>
            <div className="text-sm text-slate-400 hidden sm:flex items-center gap-1 mt-0.5">
              <Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link>
              <span className="text-cyan-600">/</span>
              <span className="text-cyan-100 font-medium">{getPageTitle()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-5 relative z-10">
          <div className="relative hidden md:block group" ref={searchRef}>
            <Search className="w-4 h-4 text-cyan-500/70 absolute left-3 top-1/2 -translate-y-1/2 group-hover:text-cyan-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search ticker or command..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="pl-9 pr-4 py-2 bg-[#020817]/80 border border-cyan-900/50 rounded-lg text-sm text-cyan-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 w-64 transition-all shadow-[inset_0_0_10px_rgba(0,255,255,0.02)] group-hover:border-cyan-500/50 group-hover:shadow-[0_0_10px_rgba(0,255,255,0.1)_inset] placeholder:text-cyan-900/50 font-mono text-xs"
            />
            {searchQuery.length === 0 && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-3 bg-cyan-500/50 animate-pulse"></div>}

            {searchQuery.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-full bg-[#020817]/95 backdrop-blur-xl border border-cyan-500/30 rounded-lg overflow-hidden z-[100] shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_15px_rgba(0,255,255,0.1)]">
                {searchResults.length > 0 ? (
                  searchResults.map((res, i) => (
                    <div 
                      key={i} 
                      className="px-4 py-2 hover:bg-cyan-900/30 cursor-pointer text-sm border-b border-cyan-900/20 last:border-0 transition-colors flex justify-between items-center group/item"
                      onClick={() => {
                        navigate(res.path);
                        setSearchQuery('');
                      }}
                    >
                      <div className="font-medium text-cyan-100 group-hover/item:text-cyan-300">{res.name}</div>
                      <div className="text-[10px] uppercase tracking-wider text-cyan-600 border border-cyan-900/50 px-1.5 rounded">{res.type}</div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-slate-400 text-center font-mono text-xs">NO_MATCH_FOUND</div>
                )}
              </div>
            )}
          </div>
          
          <div className="relative" ref={notifRef}>
            <button 
              className="p-2 text-cyan-400/70 hover:text-cyan-300 hover:bg-cyan-900/30 rounded-lg relative border border-transparent hover:border-cyan-500/30 transition-all shadow-[0_0_10px_rgba(0,255,255,0)_inset] hover:shadow-[0_0_10px_rgba(0,255,255,0.1)_inset]"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-[#050B1A] shadow-[0_0_8px_rgba(255,0,60,0.8)] animate-pulse"></span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-[#020817]/95 backdrop-blur-xl rounded-lg overflow-hidden z-[100] border border-cyan-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_15px_rgba(0,255,255,0.1)]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-900/40 bg-[#01040A]">
                  <span className="font-semibold text-xs text-cyan-300 tracking-wider uppercase">System Logs</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={() => updateNotifications(notifications.map(n => ({...n, read: true})))}
                      className="text-[10px] text-cyan-500 hover:text-cyan-300 font-medium flex items-center gap-1 uppercase tracking-wider transition-colors"
                    >
                      <Check className="w-3 h-3" />
                      Ack All
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      onClick={() => updateNotifications(notifications.map(n => n.id === notif.id ? {...n, read: true} : n))}
                      className={cn("px-4 py-3 border-b border-cyan-900/20 last:border-0 text-sm flex items-start gap-3 transition-colors hover:bg-cyan-950/20 cursor-pointer", notif.read ? "text-slate-400" : "text-cyan-100 font-medium")}
                    >
                      <div className={cn("mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0", notif.read ? "bg-cyan-900/50" : "bg-cyan-400 shadow-[0_0_8px_#00ffff]")} />
                      <span className="font-mono text-xs leading-relaxed">{notif.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="relative" ref={profileRef}>
            <div 
              className="w-9 h-9 bg-[#020817] rounded-full flex items-center justify-center text-cyan-400 font-bold border border-cyan-500/40 cursor-pointer hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all relative overflow-hidden group"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowSwitchUser(false);
              }}
            >
              <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 relative z-10 group-hover:drop-shadow-[0_0_5px_#00ffff]" />
              )}
            </div>
            {showProfileMenu && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-[#020817]/95 backdrop-blur-xl rounded-lg overflow-hidden z-[100] border border-cyan-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_15px_rgba(0,255,255,0.1)]">
                <div className="px-4 py-3 border-b border-cyan-900/40 bg-[#01040A]">
                  <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                  <p className="text-xs text-cyan-500/70 font-mono truncate">{currentUser.email}</p>
                </div>
                <div className="py-1 bg-[#020817]/60">
                  <button onClick={() => { setShowProfileMenu(false); navigate('/profile'); }} className="w-full text-left px-4 py-2 text-xs font-mono tracking-widest text-cyan-100 hover:bg-cyan-900/40 transition-colors uppercase flex items-center gap-2"><User className="w-3 h-3"/> Profile</button>
                  <button onClick={() => { setShowProfileMenu(false); navigate('/my-portfolios'); }} className="w-full text-left px-4 py-2 text-xs font-mono tracking-widest text-cyan-100 hover:bg-cyan-900/40 transition-colors uppercase flex items-center gap-2"><Briefcase className="w-3 h-3"/> My Portfolios</button>
                  <button onClick={() => { setShowProfileMenu(false); navigate('/settings'); }} className="w-full text-left px-4 py-2 text-xs font-mono tracking-widest text-cyan-100 hover:bg-cyan-900/40 transition-colors uppercase flex items-center gap-2"><SettingsIcon className="w-3 h-3"/> Settings</button>
                  <div className="border-t border-cyan-900/30 my-1"></div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowSwitchUser(!showSwitchUser); }}
                    className="w-full text-left px-4 py-2 text-xs font-mono tracking-widest text-purple-400 hover:bg-purple-900/30 transition-colors uppercase flex items-center justify-between gap-2 drop-shadow-[0_0_2px_rgba(138,43,226,0.5)]"
                  >
                    <div className="flex items-center gap-2"><User className="w-3 h-3"/> Switch User</div>
                    <span className="text-xs">›</span>
                  </button>
                  <button 
                    onClick={() => {
                      setShowProfileMenu(false);
                      // Reset to default user or something similar for simple logout
                      switchUser('1');
                      navigate('/');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-mono tracking-widest text-red-500 hover:bg-red-900/30 hover:text-red-400 transition-colors uppercase flex items-center gap-2 drop-shadow-[0_0_5px_rgba(255,0,0,0.5)]"
                  >
                    <LogOut className="w-3 h-3"/> Logout
                  </button>
                </div>
              </div>
            )}
            
            {showSwitchUser && showProfileMenu && (
              <div 
                ref={switchUserRef}
                className="absolute top-full right-[230px] mt-2 w-64 bg-[#020817]/95 backdrop-blur-xl rounded-lg overflow-hidden z-[100] border border-purple-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_15px_rgba(138,43,226,0.1)]"
              >
                <div className="px-4 py-2 border-b border-purple-900/40 bg-[#01040A]">
                  <p className="text-xs font-bold text-purple-300 uppercase tracking-widest">Select Operator</p>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {users.map(u => (
                    <button 
                      key={u.id}
                      onClick={() => { switchUser(u.id); setShowProfileMenu(false); setShowSwitchUser(false); }}
                      className={cn("w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors hover:bg-purple-950/30 border-b border-purple-900/20 last:border-0", currentUser.id === u.id ? "bg-purple-900/20" : "")}
                    >
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border", currentUser.id === u.id ? "border-purple-400 text-purple-400 shadow-[0_0_8px_rgba(138,43,226,0.3)]" : "border-slate-700 text-slate-400")}>
                        {u.avatarUrl ? <img src={u.avatarUrl} alt="" className="w-full h-full rounded-full" /> : <User className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className={cn("font-semibold truncate", currentUser.id === u.id ? "text-purple-300" : "text-slate-300")}>{u.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{u.email}</div>
                      </div>
                      {currentUser.id === u.id && <Check className="w-4 h-4 text-purple-400" />}
                    </button>
                  ))}
                </div>
                <div className="border-t border-purple-900/40 p-2">
                  <button 
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowSwitchUser(false);
                      setShowCreateUser(true);
                    }}
                    className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider hover:bg-cyan-950/30 rounded transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Create New
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <CreateUserModal isOpen={showCreateUser} onClose={() => setShowCreateUser(false)} />
    </header>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === '/';

  if (isLanding) {
    return (
      <>
        <FinanceBackground />
        {children}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-200 flex flex-col relative z-0">
      <FinanceBackground />
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <Header setMobileOpen={setMobileOpen} />
      <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/stocks" element={<StockAnalysis />} />
            <Route path="/stocks/:symbol" element={<StockAnalysis />} />
            <Route path="/ml-prediction" element={<MLPrediction />} />
            <Route path="/optimizer" element={<Optimizer />} />
            <Route path="/backtesting" element={<Backtesting />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-portfolios" element={<MyPortfolios />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </UserProvider>
  );
}

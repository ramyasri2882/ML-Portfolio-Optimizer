import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Cpu, PieChart, Activity, Award, Info, Search, Bell, User, Briefcase, Menu, X, Check } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
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
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-screen w-64 bg-slate-950/60 backdrop-blur-2xl border-r border-indigo-900/50 transition-transform duration-300 lg:translate-x-0 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)]",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center gap-2 px-6 py-5 border-b border-indigo-900/40">
          <div className="bg-indigo-950/80 border border-indigo-500/50 p-2 shadow-[0_0_15px_rgba(99,102,241,0.3)] rounded-lg">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-white">AI Portfolio</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path) || (location.pathname === '/' && item.path === '/dashboard');
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 border-l-4",
                  isActive 
                    ? "bg-indigo-950/40 text-indigo-300 border-indigo-400 font-bold shadow-[inset_4px_0_15px_rgba(99,102,241,0.2),0_0_15px_rgba(99,102,241,0.1)]" 
                    : "text-slate-300 border-transparent hover:bg-slate-900/40 hover:text-primary-600 hover:translate-x-1"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary-600" : "text-slate-400")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-indigo-900/40">
          <div className="px-3 py-3 bg-slate-900/40 rounded-lg">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">System Status</p>
            <p className="text-sm font-medium text-white">Classical ML Portfolio</p>
          </div>
        </div>
      </aside>
    </>
  );
}

function Header({ setMobileOpen }: { setMobileOpen: (o: boolean) => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [stocks, setStocks] = useState<any[]>([]);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Portfolio analysis completed', read: false },
    { id: 2, text: 'Optimization ready', read: false },
    { id: 3, text: 'Backtest completed', read: false },
  ]);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/stocks')
      .then(res => res.json())
      .then(data => setStocks(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchQuery('');
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
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
    return 'Dashboard';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-slate-950/60 backdrop-blur-xl border-b border-indigo-900/50 sticky top-0 z-30 lg:pl-64 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <button 
            className="lg:hidden p-2 text-slate-300 hover:bg-slate-900/40 rounded-lg"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div>
            <h1 className="text-xl font-bold text-white hidden sm:block">{getPageTitle()}</h1>
            <div className="text-sm text-slate-400 hidden sm:flex items-center gap-1 mt-0.5">
              <Link to="/dashboard" className="hover:text-primary-600 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white font-medium">{getPageTitle()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative hidden md:block" ref={searchRef}>
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-900/40 border border-indigo-900/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64 transition-all"
            />
            {searchQuery.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-full bg-slate-900/40 backdrop-blur-md border border-indigo-900/40 rounded-lg shadow-lg overflow-hidden z-50">
                {searchResults.length > 0 ? (
                  searchResults.map((res, i) => (
                    <div 
                      key={i} 
                      className="px-4 py-2 hover:bg-slate-900/40 cursor-pointer text-sm border-b border-indigo-900/30 last:border-0"
                      onClick={() => {
                        navigate(res.path);
                        setSearchQuery('');
                      }}
                    >
                      <div className="font-medium text-white">{res.name}</div>
                      <div className="text-xs text-slate-400">{res.type}</div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-slate-400 text-center">No results found</div>
                )}
              </div>
            )}
          </div>
          
          <div className="relative" ref={notifRef}>
            <button 
              className="p-2 text-slate-300 hover:bg-slate-900/40 rounded-lg relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute top-full right-0 mt-1 w-72 bg-slate-900/40 backdrop-blur-md border border-indigo-900/40 rounded-lg shadow-lg overflow-hidden z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-indigo-900/30 bg-slate-900/40">
                  <span className="font-semibold text-sm text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}
                      className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map(notif => (
                    <div key={notif.id} className={cn("px-4 py-3 border-b border-indigo-900/30 last:border-0 text-sm flex items-start gap-3", notif.read ? "bg-slate-900/40 backdrop-blur-md text-slate-300" : "bg-slate-900/40/50 text-white font-medium")}>
                      <div className={cn("mt-1.5 w-2 h-2 rounded-full flex-shrink-0", notif.read ? "bg-transparent" : "bg-primary-500")} />
                      {notif.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="relative" ref={profileRef}>
            <div 
              className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold border border-primary-200 cursor-pointer"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <User className="w-4 h-4" />
            </div>
            {showProfileMenu && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-slate-900/40 backdrop-blur-md border border-indigo-900/40 rounded-lg shadow-lg overflow-hidden z-50">
                <div className="py-1">
                  <button className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-900/40 transition-colors">Profile</button>
                  <button className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-900/40 transition-colors">Settings</button>
                  <div className="border-t border-indigo-900/30 my-1"></div>
                  <button className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-slate-900/40 transition-colors">Logout</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
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
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

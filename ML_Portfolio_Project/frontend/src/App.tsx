import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Cpu, PieChart, Activity, Award, Info, Search, Bell, User, Briefcase, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from './utils/cn';

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
        "fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200 transition-transform duration-300 lg:translate-x-0 flex flex-col",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-200">
          <div className="bg-primary-600 p-2 rounded-lg">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-slate-900">AI Portfolio</span>
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
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary-50 text-primary-700" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary-600" : "text-slate-400")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-200">
          <div className="px-3 py-3 bg-slate-50 rounded-lg">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">System Status</p>
            <p className="text-sm font-medium text-slate-900">Classical ML Portfolio</p>
          </div>
        </div>
      </aside>
    </>
  );
}

function Header({ setMobileOpen }: { setMobileOpen: (o: boolean) => void }) {
  const location = useLocation();
  
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

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 lg:pl-64">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <button 
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div>
            <h1 className="text-xl font-bold text-slate-900 hidden sm:block">{getPageTitle()}</h1>
            <div className="text-sm text-slate-500 hidden sm:flex items-center gap-1 mt-0.5">
              <span>Home</span>
              <span>/</span>
              <span className="text-slate-900 font-medium">{getPageTitle()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64 transition-all"
            />
          </div>
          <button className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold border border-primary-200 cursor-pointer">
            <User className="w-4 h-4" />
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
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
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

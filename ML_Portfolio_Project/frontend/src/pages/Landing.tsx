import { Link } from 'react-router-dom';
import { ArrowRight, BrainCircuit, LineChart, ShieldCheck } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary-600 p-2 rounded-lg">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-2xl text-slate-900 tracking-tight">AI Portfolio Optimizer</span>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link to="/about" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">About</Link>
          <Link to="/dashboard" className="text-primary-600 font-medium hover:text-primary-700 transition-colors">Go to Dashboard →</Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-20 md:py-32 max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 font-medium text-sm mb-6 border border-primary-100">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
            Classical ML Financial Engine
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            AI-Powered <br className="hidden md:block"/> Portfolio Optimization
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Build a risk-aware investment portfolio using Machine Learning, historical market data, and classical portfolio optimization for Indian stocks.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/dashboard" 
              className="px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Launch Optimizer
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/about" 
              className="px-8 py-4 bg-white text-slate-700 border border-slate-200 font-semibold rounded-xl hover:bg-slate-50 transition-all w-full sm:w-auto justify-center text-center"
            >
              Explore Project
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white border-y border-slate-200 py-20 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            <Link to="/stocks" className="group p-8 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <LineChart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Market Intelligence</h3>
              <p className="text-slate-600 leading-relaxed">Deep analysis of NIFTY 50 stocks with historical performance, volatility, and interactive charting.</p>
            </Link>

            <Link to="/ml-prediction" className="group p-8 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">ML Return Prediction</h3>
              <p className="text-slate-600 leading-relaxed">Random Forest models trained on engineered features to predict expected stock returns with confidence scores.</p>
            </Link>

            <Link to="/optimizer" className="group p-8 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Risk-Aware Optimization</h3>
              <p className="text-slate-600 leading-relaxed">Classical Markowitz mean-variance optimization combined with ML signals to build efficient portfolios.</p>
            </Link>
          </div>
        </section>

        {/* Pipeline Section */}
        <section className="py-20 px-6 max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">System Architecture Pipeline</h2>
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 text-sm md:text-base font-medium">
            {['Market Data', 'Data Processing', 'Feature Engineering', 'ML Prediction', 'Risk Analysis', 'Portfolio Optimization', 'Backtesting'].map((step, index, arr) => (
              <div key={step} className="flex items-center gap-2 md:gap-4">
                <div className="px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-lg text-slate-800">
                  {step}
                </div>
                {index < arr.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 px-6 text-center">
        <p className="text-slate-500 text-sm">Academic Project • Classical ML Portfolio System • Not Financial Advice</p>
      </footer>
    </div>
  );
}

import { Database, Activity, Target, Layers, ArrowRight, ShieldCheck, BrainCircuit, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="text-center space-y-4 pt-4">
        <h2 className="text-3xl font-extrabold text-white">About the Project</h2>
        <p className="text-lg text-slate-300 leading-relaxed">
          This project uses Machine Learning and classical portfolio optimization to construct a risk-aware investment portfolio from historical Indian stock market data.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/40 text-slate-200 text-xs font-semibold uppercase tracking-wider">
          Academic Project
        </div>
      </div>

      <div className="bg-[#030B1C]/60 backdrop-blur-md p-8 rounded-2xl border border-cyan-900/40 shadow-sm">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Layers className="w-6 h-6 text-cyan-400" />
          System Architecture
        </h3>
        
        <div className="relative">
          {/* Vertical line connecting nodes on desktop */}
          <div className="hidden sm:block absolute left-6 top-10 bottom-10 w-0.5 bg-slate-800/40 z-0"></div>
          
          <div className="space-y-6 relative z-10">
            {[
              { id: 1, title: 'Data Collection & Processing', icon: Database, color: 'text-blue-600', bg: 'bg-blue-950/40 border border-blue-500/30', border: 'border-blue-200', desc: 'Sourcing historical price and volume data for NIFTY 50 constituents, cleaning missing values, and adjusting for corporate actions.' },
              { id: 2, title: 'Feature Engineering', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-950/40 border border-emerald-500/30', border: 'border-emerald-200', desc: 'Calculating technical indicators (RSI, MACD, Bollinger Bands) and statistical moments (Rolling Volatility, Skewness, Kurtosis) as model inputs.' },
              { id: 3, title: 'Machine Learning (Return Prediction)', icon: BrainCircuit, color: 'text-purple-600', bg: 'bg-purple-950/40 border border-purple-500/30', border: 'border-purple-200', desc: 'Training Random Forest Regressors to forecast 30-day expected returns. Evaluating via RMSE, MAE, and out-of-sample R² scores.' },
              { id: 4, title: 'Risk Analysis & Optimization', icon: ShieldCheck, color: 'text-rose-600', bg: 'bg-rose-950/40 border border-rose-500/30', border: 'border-rose-200', desc: 'Computing covariance matrices and applying classical Markowitz Mean-Variance Optimization to find the Efficient Frontier.' },
              { id: 5, title: 'Backtesting & Evaluation', icon: Target, color: 'text-cyan-400', bg: 'bg-cyan-900/50', border: 'border-primary-200', desc: 'Simulating portfolio performance over historical periods out-of-sample, benchmarking against NIFTY 50 and Equal-Weight portfolios.' },
            ].map((step) => (
              <div key={step.id} className="flex gap-4 sm:gap-6">
                <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center border-2 bg-[#030B1C]/60 backdrop-blur-md ${step.border} z-10 relative shadow-sm`}>
                  <step.icon className={`w-5 h-5 ${step.color}`} />
                </div>
                <div className="bg-[#030B1C]/60 border border-cyan-900/40 rounded-xl p-5 flex-1 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-white mb-1">{step.title}</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#030B1C]/60 backdrop-blur-md p-6 rounded-xl border border-cyan-900/40 shadow-sm">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-slate-400" />
            Technologies Used
          </h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Backend & ML (Python)</h4>
              <div className="flex flex-wrap gap-2">
                {['Pandas', 'NumPy', 'Scikit-learn', 'SciPy', 'FastAPI', 'yfinance'].map(tech => (
                  <span key={tech} className="px-2.5 py-1 bg-slate-800/40 text-slate-200 text-xs font-semibold rounded-md border border-cyan-900/40">{tech}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Frontend & UI</h4>
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Tailwind CSS', 'Recharts', 'Lucide Icons', 'Vite'].map(tech => (
                  <span key={tech} className="px-2.5 py-1 bg-cyan-950/40 text-cyan-400 text-xs font-semibold rounded-md border border-primary-200">{tech}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-cyan-900/50 shadow-sm text-white flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-3">Disclaimer</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              This application is developed strictly for academic and educational purposes. The predictions, allocations, and analysis provided do not constitute financial advice, investment recommendations, or an offer to buy/sell securities.
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              Historical performance does not guarantee future returns. Always consult with a qualified financial advisor before making investment decisions.
            </p>
          </div>
          <div className="mt-6">
            <Link 
              to="/dashboard" 
              className="inline-flex items-center gap-2 text-sm font-bold text-primary-400 hover:text-primary-300 transition-colors"
            >
              Return to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="bg-[#0f172a] border border-[#1e293b] p-8 rounded-2xl mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">Data & ML Methodology</h3>
          <ul className="list-disc list-inside text-slate-300 space-y-3 leading-relaxed">
            <li><strong className="text-white">Historical Dataset (2016–2025):</strong> The core historical dataset is strictly used for ML model training and backtesting.</li>
            <li><strong className="text-white">COVID-19 Period Retained:</strong> The extreme volatility period of 2020 represents real market stress and is deliberately preserved so the ML model can learn high-volatility regimes.</li>
            <li><strong className="text-white">Live Market Data:</strong> Real-time and current market data is dynamically injected for accurate stock pricing and serves as the latest input features for the prediction pipeline.</li>
            <li><strong className="text-white">ML Forecasting:</strong> The model predicts a defined future return horizon (e.g., 30-Day Expected Return) using historical pattern recognition applied to live input variables, rather than guessing future absolute prices.</li>
            <li><strong className="text-white">Backtesting Integrity:</strong> Strategy evaluation strictly utilizes historical data to simulate realistic past performance, avoiding any leakage of current prices into historical tests.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

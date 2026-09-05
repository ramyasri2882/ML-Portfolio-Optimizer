import os

filepath = r'C:\Users\ramya_mdoa1y2\Downloads\ML_Portfolio_Project\frontend\src\pages\Optimizer.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import { useState, useEffect } from 'react';", "import { useState, useEffect, useRef } from 'react';")
content = content.replace("import { Settings, Play, Loader2, ArrowRight, Download, BarChart3, Activity } from 'lucide-react';", "import { Settings, Play, Loader2, ArrowRight, Download, BarChart3, Activity, ChevronDown } from 'lucide-react';")

state_additions = """
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectAll = () => {
    if (selectedStocks.length === stocks.length) {
      setSelectedStocks([]);
    } else {
      setSelectedStocks(stocks.map(s => s.symbol));
    }
  };
"""

content = content.replace("const [objective, setObjective] = useState('sharpe');", "const [objective, setObjective] = useState('sharpe');\n" + state_additions)

old_ui = """          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="block text-sm font-bold text-slate-200">Asset Universe</label>
              <span className="text-xs text-slate-400">{selectedStocks.length}/{stocks.length} selected</span>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
              {stocks.map(stock => (
                <label 
                  key={stock.symbol} 
                  className={cn(
                    "flex items-center p-2 rounded-lg border cursor-pointer transition-colors text-sm",
                    selectedStocks.includes(stock.symbol) 
                      ? "bg-indigo-950/50 border-cyan-500/50 text-cyan-300 shadow-[0_0_10px_rgba(99,102,241,0.2)]" 
                      : "bg-[#030B1C]/60 backdrop-blur-md border-cyan-900/40 text-slate-300 hover:bg-[#030B1C]/60"
                  )}
                >
                  <input 
                    type="checkbox" 
                    className="sr-only"
                    checked={selectedStocks.includes(stock.symbol)}
                    onChange={() => toggleStock(stock.symbol)}
                  />
                  <div className={cn(
                    "w-4 h-4 rounded-sm border mr-2 flex items-center justify-center",
                    selectedStocks.includes(stock.symbol) ? "bg-cyan-950/400 border-primary-500" : "border-slate-300"
                  )}>
                    {selectedStocks.includes(stock.symbol) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  {stock.symbol}
                </label>
              ))}
            </div>
          </div>"""

new_ui = """          <div className="space-y-3 relative" ref={dropdownRef}>
            <label className="block text-sm font-bold text-slate-200">Asset Universe</label>
            
            <button 
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 glass-panel rounded-lg border border-cyan-900/40 hover:border-cyan-500/50 hover:shadow-[0_0_10px_rgba(0,255,255,0.1)_inset] transition-all bg-[#030B1C]/80 focus:outline-none"
            >
              <div className="flex flex-col items-start">
                <span className="text-sm text-slate-200 font-medium">
                  {selectedStocks.length === 0 ? "[ Select assets... ]" : 
                   selectedStocks.length === 1 ? selectedStocks[0] : 
                   `${selectedStocks.length} assets selected`}
                </span>
                <span className="text-[10px] text-cyan-500 font-mono">
                  {selectedStocks.length}/{stocks.length} selected
                </span>
              </div>
              <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform duration-300", isDropdownOpen && "rotate-180 text-cyan-400")} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute z-50 w-full mt-2 bg-[#020817]/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_15px_rgba(0,255,255,0.1)] overflow-hidden flex flex-col max-h-64 animate-in fade-in slide-in-from-top-2 duration-200">
                
                {/* Select All Option */}
                <label className="flex items-center p-3 border-b border-cyan-900/50 hover:bg-[#030B1C] cursor-pointer transition-colors group sticky top-0 bg-[#020817]/95 backdrop-blur-md z-10">
                  <input 
                    type="checkbox" 
                    className="sr-only"
                    checked={selectedStocks.length === stocks.length}
                    ref={input => {
                      if (input) {
                        input.indeterminate = selectedStocks.length > 0 && selectedStocks.length < stocks.length;
                      }
                    }}
                    onChange={handleSelectAll}
                  />
                  <div className={cn(
                    "w-4 h-4 rounded-sm border mr-3 flex items-center justify-center transition-all group-hover:border-cyan-400",
                    selectedStocks.length === stocks.length ? "bg-purple-600 border-purple-500 shadow-[0_0_8px_rgba(138,43,226,0.5)]" : 
                    selectedStocks.length > 0 ? "bg-purple-900/50 border-purple-500/50" : "border-cyan-900/50"
                  )}>
                    {selectedStocks.length === stocks.length && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    {selectedStocks.length > 0 && selectedStocks.length < stocks.length && <div className="w-2 h-0.5 bg-purple-400 rounded-full"></div>}
                  </div>
                  <span className="font-bold text-slate-200 group-hover:text-cyan-300">Select All</span>
                </label>
                
                {/* Stock List */}
                <div className="overflow-y-auto p-1 flex-1 custom-scrollbar">
                  {stocks.map(stock => (
                    <label 
                      key={stock.symbol} 
                      className={cn(
                        "flex items-center p-2 rounded-lg cursor-pointer transition-all text-sm mb-1 group",
                        selectedStocks.includes(stock.symbol) 
                          ? "bg-indigo-950/30 text-cyan-300" 
                          : "text-slate-400 hover:bg-[#030B1C]/80 hover:text-slate-200"
                      )}
                    >
                      <input 
                        type="checkbox" 
                        className="sr-only"
                        checked={selectedStocks.includes(stock.symbol)}
                        onChange={() => toggleStock(stock.symbol)}
                      />
                      <div className={cn(
                        "w-4 h-4 rounded-sm border mr-3 flex items-center justify-center transition-all group-hover:border-cyan-500/50",
                        selectedStocks.includes(stock.symbol) ? "bg-cyan-900 border-cyan-500 shadow-[0_0_8px_rgba(0,255,255,0.3)]" : "border-cyan-900/50"
                      )}>
                        {selectedStocks.includes(stock.symbol) && <svg className="w-3 h-3 text-cyan-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className="font-medium">{stock.symbol}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>"""

content = content.replace(old_ui, new_ui)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated successfully")

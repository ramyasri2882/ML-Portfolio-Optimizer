import os
import re

directory = r'C:\Users\ramya_mdoa1y2\Downloads\ML_Portfolio_Project\frontend\src\pages'

# Specific long class strings for buttons/links that act like buttons
replacements = {
    # Landing page buttons
    'px-8 py-4 bg-[#020617] border border-cyan-500/50 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] font-semibold rounded-xl hover:bg-cyan-700 shadow-lg shadow-cyan-500/30 transition-all flex items-center gap-2 w-full sm:w-auto justify-center': 'btn-fintech px-8 py-4 flex items-center gap-2 w-full sm:w-auto justify-center',
    
    'px-8 py-4 bg-[#050B1A]/60 backdrop-blur-md text-slate-200 border border-cyan-900/40 font-semibold rounded-xl hover:bg-[#050B1A]/60 transition-all w-full sm:w-auto justify-center text-center': 'btn-fintech px-8 py-4 w-full sm:w-auto justify-center text-center',

    # Optimizer calculate button
    'w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 transition-all': 'w-full py-3 btn-fintech shadow-lg',
    
    'px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors': 'btn-fintech px-4 py-2 text-sm',
    'px-4 py-2 bg-slate-700 text-white rounded-lg text-sm font-medium': 'btn-fintech px-4 py-2 text-sm border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.2)_inset]',
}

for filename in os.listdir(directory):
    if filename.endswith('.tsx'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as file:
            content = file.read()
            
        new_content = content
        for old, new in replacements.items():
            new_content = new_content.replace(old, new)
            
        # Regex for generic submit/action buttons
        new_content = re.sub(
            r'className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"',
            r'className="w-full py-2 px-4 btn-fintech"',
            new_content
        )
        new_content = re.sub(
            r'className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"',
            r'className="w-full py-2 px-4 btn-fintech"',
            new_content
        )
        new_content = re.sub(
            r'className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"',
            r'className="px-4 py-2 btn-fintech flex items-center gap-2"',
            new_content
        )
        
        # Change chart grid colors inline for Recharts where stroke="#334155" (slate-700)
        new_content = new_content.replace('stroke="#334155"', 'stroke="rgba(0, 255, 255, 0.1)"')
        new_content = new_content.replace('stroke="#1e293b"', 'stroke="rgba(0, 255, 255, 0.05)"')
        
        # Make line chart lines glow using drop-shadow filter inline if possible, or just change colors
        new_content = new_content.replace('stroke="#6366f1"', 'stroke="#00f0ff" filter="drop-shadow(0px 0px 4px rgba(0,240,255,0.5))"')
        new_content = new_content.replace('stroke="#10b981"', 'stroke="#00ff66" filter="drop-shadow(0px 0px 4px rgba(0,255,102,0.5))"')
        new_content = new_content.replace('stroke="#f43f5e"', 'stroke="#ff003c" filter="drop-shadow(0px 0px 4px rgba(255,0,60,0.5))"')
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print(f'Updated {filename}')

import os
import re

directory = r'C:\Users\ramya_mdoa1y2\Downloads\ML_Portfolio_Project\frontend\src\pages'

for filename in os.listdir(directory):
    if filename.endswith('.tsx'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        content = content.replace('stroke="#38bdf8"', 'stroke="#00f0ff" filter="drop-shadow(0px 0px 4px rgba(0,240,255,0.8))"')
        content = content.replace('stroke="#a855f7"', 'stroke="#8a2be2" filter="drop-shadow(0px 0px 4px rgba(138,43,226,0.8))"')
        content = content.replace('stroke="#fb7185"', 'stroke="#ff003c" filter="drop-shadow(0px 0px 4px rgba(255,0,60,0.8))"')
        content = content.replace('stopColor="#38bdf8"', 'stopColor="#00f0ff"')
        
        # In Backtesting
        content = content.replace('stroke="#10b981"', 'stroke="#00ff66" filter="drop-shadow(0px 0px 4px rgba(0,255,102,0.8))"')
        content = content.replace('stroke="#6366f1"', 'stroke="#00f0ff" filter="drop-shadow(0px 0px 4px rgba(0,240,255,0.8))"')
        content = content.replace('stroke="#94a3b8"', 'stroke="#ffd700" filter="drop-shadow(0px 0px 4px rgba(255,215,0,0.8))"')
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

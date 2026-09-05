import os

filepath = r'C:\Users\ramya_mdoa1y2\Downloads\ML_Portfolio_Project\frontend\src\pages\Backtesting.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('stroke="#475569"', 'stroke="#00f0ff" filter="drop-shadow(0px 0px 4px rgba(0,240,255,0.8))"')
content = content.replace('stroke="#3b82f6"', 'stroke="#00ff66" filter="drop-shadow(0px 0px 4px rgba(0,255,102,0.8))"')
content = content.replace('stroke="#8b5cf6"', 'stroke="#8a2be2" filter="drop-shadow(0px 0px 4px rgba(138,43,226,0.8))"')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

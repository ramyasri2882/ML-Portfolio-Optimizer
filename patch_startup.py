import re

with open("backend/main.py", "r", encoding="utf-8") as f:
    content = f.read()

startup_code = """
import threading
import time
import pandas as pd
import numpy as np

def update_db_in_background():
    db = database.SessionLocal()
    try:
        stocks = db.query(model.Stock).all()
        today_str = datetime.today().strftime('%Y-%m-%d')
        for s in stocks:
            # Check latest date
            latest = db.query(model.HistoricalData).filter(model.HistoricalData.symbol == s.symbol).order_by(model.HistoricalData.date.desc()).first()
            if not latest or latest.date < today_str:
                start_date = latest.date if latest else '2016-01-01'
                
                # Fetch missing data
                ticker = yf.Ticker(f"{s.symbol}.NS")
                hist = ticker.history(start=start_date, end=today_str)
                if hist.empty:
                    continue
                
                hist['return_val'] = hist['Close'].pct_change() * 100
                hist['volatility'] = hist['return_val'].rolling(window=20).std() * np.sqrt(252)
                hist = hist.dropna()
                
                # Filter to strictly > start_date if latest exists
                if latest:
                    hist = hist[hist.index > pd.to_datetime(start_date)]
                
                if hist.empty:
                    continue
                    
                hist_records = []
                for index, row in hist.iterrows():
                    hist_records.append(model.HistoricalData(
                        symbol=s.symbol,
                        date=index.strftime('%Y-%m-%d'),
                        price=float(row['Close']),
                        return_val=float(row['return_val']),
                        volatility=float(row['volatility'])
                    ))
                if hist_records:
                    db.bulk_save_objects(hist_records)
                    db.commit()
    except Exception as e:
        print(f"Background update failed: {e}")
    finally:
        db.close()

@app.on_event("startup")
def startup_event():
    thread = threading.Thread(target=update_db_in_background)
    thread.start()
"""

# Insert after app initialization
if "@app.on_event" not in content:
    content = content.replace('app = FastAPI(title="ML Portfolio Backend API", description="API for stock analysis, ML predictions, and portfolio optimization")',
                              'app = FastAPI(title="ML Portfolio Backend API", description="API for stock analysis, ML predictions, and portfolio optimization")\n' + startup_code)

with open("backend/main.py", "w", encoding="utf-8") as f:
    f.write(content)

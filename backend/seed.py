import datetime
from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal
import model
import yfinance as yf
import pandas as pd
import numpy as np
import time

Base.metadata.create_all(bind=engine)

STOCKS = [
  { 'symbol': 'RELIANCE', 'yf_symbol': 'RELIANCE.NS', 'name': 'Reliance Industries' },
  { 'symbol': 'TCS', 'yf_symbol': 'TCS.NS', 'name': 'Tata Consultancy Services' },
  { 'symbol': 'INFY', 'yf_symbol': 'INFY.NS', 'name': 'Infosys' },
  { 'symbol': 'HDFCBANK', 'yf_symbol': 'HDFCBANK.NS', 'name': 'HDFC Bank' },
  { 'symbol': 'ICICIBANK', 'yf_symbol': 'ICICIBANK.NS', 'name': 'ICICI Bank' },
  { 'symbol': 'SBIN', 'yf_symbol': 'SBIN.NS', 'name': 'State Bank of India' },
  { 'symbol': 'ITC', 'yf_symbol': 'ITC.NS', 'name': 'ITC Limited' },
  { 'symbol': 'SUNPHARMA', 'yf_symbol': 'SUNPHARMA.NS', 'name': 'Sun Pharmaceutical' },
  { 'symbol': 'MARUTI', 'yf_symbol': 'MARUTI.NS', 'name': 'Maruti Suzuki' },
  { 'symbol': 'HCLTECH', 'yf_symbol': 'HCLTECH.NS', 'name': 'HCL Technologies' },
]

def seed():
    db = SessionLocal()
    print("Clearing existing data...")
    db.query(model.MLPrediction).delete()
    db.query(model.HistoricalData).delete()
    db.query(model.Stock).delete()
    
    print("Fetching historical data from yfinance (2016 to today)...")
    
    start_date = '2016-01-01'
    end_date = datetime.date.today().strftime('%Y-%m-%d')
    
    for s in STOCKS:
        print(f"Processing {s['symbol']}...")
        ticker = yf.Ticker(s['yf_symbol'])
        hist = ticker.history(start=start_date, end=end_date)
        
        if hist.empty:
            print(f"Warning: No data for {s['symbol']}")
            continue
            
        # Calculate features
        hist['return_val'] = hist['Close'].pct_change() * 100
        hist['volatility'] = hist['return_val'].rolling(window=20).std() * np.sqrt(252)
        hist = hist.dropna()
        
        # Calculate overall stats for the Stock model
        latest_price = hist['Close'].iloc[-1]
        daily_return = hist['return_val'].iloc[-1]
        annual_return = hist['return_val'].mean() * 252
        volatility = hist['volatility'].iloc[-1]
        high52 = hist['Close'].rolling(window=252).max().iloc[-1]
        low52 = hist['Close'].rolling(window=252).min().iloc[-1]
        
        stock = model.Stock(
            symbol=s['symbol'],
            name=s['name'],
            price=float(latest_price),
            dailyReturn=float(daily_return),
            annualReturn=float(annual_return),
            volatility=float(volatility),
            high52=float(high52) if pd.notna(high52) else float(latest_price),
            low52=float(low52) if pd.notna(low52) else float(latest_price)
        )
        db.add(stock)
        
        # Add historical data (bulk insert for performance)
        hist_records = []
        for index, row in hist.iterrows():
            hist_records.append(model.HistoricalData(
                symbol=s['symbol'],
                date=index.strftime('%Y-%m-%d'),
                price=float(row['Close']),
                return_val=float(row['return_val']),
                volatility=float(row['volatility'])
            ))
        db.bulk_save_objects(hist_records)
        db.commit()
        time.sleep(1) # sleep to avoid rate limiting
        
    print("Database seeded successfully with historical data up to today!")

if __name__ == '__main__':
    seed()

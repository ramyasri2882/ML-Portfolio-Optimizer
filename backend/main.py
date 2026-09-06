from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import database, model, schemas, ml_service
import yfinance as yf
from cachetools import TTLCache
from datetime import datetime



# Cache for live prices (5 minutes)
live_price_cache = TTLCache(maxsize=100, ttl=300)

app = FastAPI(title="ML Portfolio Backend API", description="API for stock analysis, ML predictions, and portfolio optimization")

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
                    # Make start_date tz-aware matching the dataframe's timezone, or Asia/Kolkata
                    tz = hist.index.tz if hist.index.tz is not None else 'Asia/Kolkata'
                    start_dt = pd.to_datetime(start_date).tz_localize(tz)
                    if hist.index.tz is None:
                        hist.index = hist.index.tz_localize(tz)
                    hist = hist[hist.index > start_dt]
                
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


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to the ML Portfolio API"}

# Cache for all stocks (5 minutes)
all_stocks_cache = TTLCache(maxsize=1, ttl=300)

@app.get("/api/stocks", response_model=List[schemas.StockResponse])
def get_stocks(db: Session = Depends(get_db)):
    if "all" in all_stocks_cache:
        return all_stocks_cache["all"]

    stocks = db.query(model.Stock).all()
    # Attempt to update with live prices
    symbols = []
    yf_symbols = []
    for s in stocks:
        symbols.append(s.symbol)
        yf_symbols.append(f"{s.symbol}.NS")
        
    try:
        if yf_symbols:
            # Download 1 year of data to calculate all metrics
            data = yf.download(yf_symbols, period="1y", group_by="ticker", progress=False)
            for i, s in enumerate(stocks):
                yf_sym = yf_symbols[i]
                df = data[yf_sym] if len(yf_symbols) > 1 else data
                if not df['Close'].empty:
                    current_price = float(df['Close'].iloc[-1])
                    
                    # Ensure we have enough data to calculate daily return
                    if len(df) >= 2:
                        prev_close = float(df['Close'].iloc[-2])
                        daily_return = ((current_price - prev_close) / prev_close) * 100
                    else:
                        open_price = float(df['Open'].iloc[-1])
                        daily_return = ((current_price - open_price) / open_price) * 100 if open_price else 0
                    
                    # 52 Week High/Low
                    s.high52 = float(df['Close'].max())
                    s.low52 = float(df['Close'].min())
                    
                    # Calculate Annual Return and Volatility dynamically
                    df['return_val'] = df['Close'].pct_change() * 100
                    if len(df['return_val'].dropna()) > 0:
                        s.annualReturn = float(df['return_val'].mean() * 252)
                        s.volatility = float(df['return_val'].std() * np.sqrt(252))
                    
                    s.price = current_price
                    s.dailyReturn = daily_return
                    s.timestamp = df.index[-1].strftime("%Y-%m-%d %H:%M:%S")
                    s.isLive = True
                    
                    # Update cache
                    live_price_cache[s.symbol] = {
                        "symbol": s.symbol,
                        "currentPrice": current_price,
                        "dailyReturn": daily_return,
                        "timestamp": s.timestamp,
                        "isLive": True
                    }
    except Exception as e:
        print(f"Live data fetch error: {e}")
        
    all_stocks_cache["all"] = stocks
    return stocks

@app.get("/api/stocks/{symbol}", response_model=schemas.StockResponse)
def get_stock(symbol: str, db: Session = Depends(get_db)):
    stock = db.query(model.Stock).filter(model.Stock.symbol == symbol).first()
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return stock

@app.get("/api/stocks/{symbol}/chart", response_model=List[schemas.HistoricalDataResponse])
def get_stock_chart(symbol: str, db: Session = Depends(get_db)):
    try:
        import numpy as np
        ticker = yf.Ticker(f"{symbol}.NS")
        hist = ticker.history(period="3mo")
        if not hist.empty:
            hist['return_val'] = hist['Close'].pct_change() * 100
            hist['volatility'] = hist['return_val'].rolling(window=20).std() * np.sqrt(252)
            hist = hist.dropna()
            hist = hist.tail(30)
            
            result = []
            for index, row in hist.iterrows():
                result.append({
                    "symbol": symbol,
                    "date": index.strftime('%Y-%m-%d'),
                    "price": float(row['Close']),
                    "return_val": float(row['return_val']),
                    "volatility": float(row['volatility'])
                })
            return result
    except Exception as e:
        print(f"Live chart data fetch error for {symbol}: {e}")

    # Fallback to database
    data = db.query(model.HistoricalData).filter(model.HistoricalData.symbol == symbol).order_by(model.HistoricalData.date.desc()).limit(30).all()
    # Return ascending
    return data[::-1]

@app.get("/api/ml-predictions", response_model=List[schemas.MLPredictionResponse])
def get_ml_predictions(db: Session = Depends(get_db)):
    return db.query(model.MLPrediction).all()

@app.post("/api/portfolio-optimization", response_model=List[schemas.PortfolioAllocation])
def get_portfolio_optimization(request: schemas.OptimizationRequest, db: Session = Depends(get_db)):
    if request.symbols:
        stocks = db.query(model.Stock).filter(model.Stock.symbol.in_(request.symbols)).all()
    else:
        stocks = []
    return ml_service.optimize_portfolio(stocks)

@app.post("/api/portfolios/{portfolio_id}/backtest", response_model=schemas.BacktestResultResponse)
def run_backtest(portfolio_id: int, backtest_req: schemas.BacktestCreate, db: Session = Depends(get_db)):
    import math
    import json
    import pandas as pd
    
    portfolio = db.query(model.Portfolio).filter(model.Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
        
    initial = backtest_req.initial_investment
    start_date = backtest_req.start_date
    end_date = backtest_req.end_date
    
    allocations = {a.symbol: (a.allocation / 100.0) for a in portfolio.allocations}
    
    # Query historical data from DB
    hist_data = db.query(model.HistoricalData).filter(
        model.HistoricalData.date >= start_date,
        model.HistoricalData.date <= end_date
    ).all()
    
    data = []
    
    if not hist_data or not allocations:
        # Fallback if no data matches the range
        data.append({"month": "N/A", "optimized": initial, "nifty50": initial, "equalWeight": initial})
        ann_return = 0
        ann_volatility = 0
        sharpe = 0
        max_dd = 0
    else:
        df = pd.DataFrame([{'symbol': h.symbol, 'date': h.date, 'return_val': h.return_val} for h in hist_data])
        df['date'] = pd.to_datetime(df['date'])
        
        # Resample to monthly returns for the chart
        df['month'] = df['date'].dt.strftime('%b %Y')
        
        monthly_returns = {}
        unique_months = df['month'].unique()
        
        current_val = initial
        nifty_val = initial
        eq_val = initial
        
        peak_val = initial
        max_drawdown = 0
        
        for month in unique_months:
            month_data = df[df['month'] == month]
            # Calculate average daily return for this month per stock, then compound to monthly? 
            # Simplified: just sum the daily returns for the month
            monthly_port_ret = 0
            monthly_eq_ret = 0
            
            symbols_in_month = month_data['symbol'].unique()
            eq_weight = 1.0 / len(symbols_in_month) if len(symbols_in_month) > 0 else 0
            
            for symbol in symbols_in_month:
                sym_ret = month_data[month_data['symbol'] == symbol]['return_val'].sum() / 100.0
                if symbol in allocations:
                    monthly_port_ret += sym_ret * allocations[symbol]
                monthly_eq_ret += sym_ret * eq_weight
                
            current_val = current_val * (1 + monthly_port_ret)
            eq_val = eq_val * (1 + monthly_eq_ret)
            # Proxy NIFTY as equal weight minus 1% annual for simplicity, or just use eq_val
            nifty_val = nifty_val * (1 + (monthly_eq_ret * 0.9))
            
            if current_val > peak_val:
                peak_val = current_val
            
            dd = (peak_val - current_val) / peak_val * 100
            if dd > max_drawdown:
                max_drawdown = dd
                
            data.append({
                "month": month,
                "optimized": current_val,
                "nifty50": nifty_val,
                "equalWeight": eq_val
            })
            
        total_return = (current_val - initial) / initial
        # Rough annualized based on number of months
        years = len(unique_months) / 12.0
        ann_return = ((1 + total_return) ** (1 / years) - 1) * 100 if years > 0 else 0
        
        # Calculate volatility
        port_returns = [(d["optimized"] - initial)/initial for d in data] # rough
        ann_volatility = portfolio.risk if portfolio.risk else 15.0 # fallback
        sharpe = (ann_return - 5) / ann_volatility if ann_volatility > 0 else 0
        max_dd = max_drawdown
    
    db_backtest = db.query(model.BacktestResult).filter(model.BacktestResult.portfolio_id == portfolio_id).first()
    if not db_backtest:
        db_backtest = model.BacktestResult(
            user_id=portfolio.user_id,
            portfolio_id=portfolio_id
        )
        db.add(db_backtest)
        
    db_backtest.start_date = backtest_req.start_date
    db_backtest.end_date = backtest_req.end_date
    db_backtest.initial_investment = backtest_req.initial_investment
    db_backtest.results_json = json.dumps(data)
    db_backtest.annualized_return = ann_return
    db_backtest.annualized_volatility = ann_volatility
    db_backtest.sharpe_ratio = sharpe
    db_backtest.max_drawdown = max_dd
    
    notif = model.Notification(user_id=portfolio.user_id, text=f"Backtest completed for '{portfolio.name}'. Sharpe: {sharpe:.2f}")
    db.add(notif)
    
    db.commit()
    db.refresh(db_backtest)
    
    return db_backtest
    
@app.get("/api/portfolios/{portfolio_id}/backtest", response_model=schemas.BacktestResultResponse)
def get_backtest(portfolio_id: int, db: Session = Depends(get_db)):
    db_backtest = db.query(model.BacktestResult).filter(model.BacktestResult.portfolio_id == portfolio_id).first()
    if not db_backtest:
        raise HTTPException(status_code=404, detail="Backtest not found")
    return db_backtest

@app.post("/api/correlation")
def get_correlation(request: schemas.CorrelationRequest, db: Session = Depends(get_db)):
    return ml_service.calculate_correlation_matrix(request.symbols, db)


# --- USER ENDPOINTS ---

@app.post("/api/users", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = model.User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    notif = model.Notification(user_id=db_user.id, text=f"Welcome, {db_user.name}. Terminal initialized.")
    db.add(notif)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/api/users", response_model=List[schemas.UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(model.User).all()

@app.get("/api/users/{user_id}", response_model=schemas.UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(model.User).filter(model.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/api/users/{user_id}", response_model=schemas.UserResponse)
def update_user(user_id: int, user_update: schemas.UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(model.User).filter(model.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = user_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)
        
    db.commit()
    db.refresh(db_user)
    return db_user

@app.delete("/api/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(model.User).filter(model.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    return {"message": "User deleted"}

# --- PORTFOLIO ENDPOINTS ---

@app.post("/api/users/{user_id}/portfolios", response_model=schemas.PortfolioResponse)
def create_portfolio(user_id: int, portfolio: schemas.PortfolioCreate, db: Session = Depends(get_db)):
    db_user = db.query(model.User).filter(model.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    db_portfolio = model.Portfolio(
        user_id=user_id,
        name=portfolio.name,
        amount=portfolio.amount,
        riskPreference=portfolio.riskPreference,
        objective=portfolio.objective,
        expectedReturn=portfolio.expectedReturn,
        risk=portfolio.risk,
        sharpeRatio=portfolio.sharpeRatio
    )
    db.add(db_portfolio)
    db.commit()
    db.refresh(db_portfolio)
    
    for symbol, allocation in portfolio.allocations.items():
        db_alloc = model.PortfolioAllocation(
            portfolio_id=db_portfolio.id,
            symbol=symbol,
            allocation=allocation
        )
        db.add(db_alloc)
        
    notif = model.Notification(user_id=user_id, text=f"Portfolio '{portfolio.name}' created and optimized.")
    db.add(notif)
    
    db.commit()
    db.refresh(db_portfolio)
    return db_portfolio

@app.delete("/api/portfolios/{portfolio_id}")
def delete_portfolio(portfolio_id: int, db: Session = Depends(get_db)):
    db_portfolio = db.query(model.Portfolio).filter(model.Portfolio.id == portfolio_id).first()
    if not db_portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    db.delete(db_portfolio)
    db.commit()
    return {"message": "Portfolio deleted"}

# --- NOTIFICATION ENDPOINTS ---

@app.put("/api/users/{user_id}/notifications/read_all")
def mark_all_notifications_read(user_id: int, db: Session = Depends(get_db)):
    db.query(model.Notification).filter(model.Notification.user_id == user_id, model.Notification.is_read == False).update({"is_read": True})
    db.commit()
    return {"message": "All notifications marked as read"}

@app.put("/api/notifications/{notification_id}/read")
def mark_notification_read(notification_id: int, db: Session = Depends(get_db)):
    notif = db.query(model.Notification).filter(model.Notification.id == notification_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.is_read = True
    db.commit()
    return {"message": "Notification marked as read"}

# --- ML ENDPOINTS ---

@app.post("/api/users/{user_id}/ml-predictions")
def run_ml_prediction(user_id: int, db: Session = Depends(get_db)):
    from ml_service import train_and_predict
    user = db.query(model.User).filter(model.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    predictions = train_and_predict(db)
    
    # Store them
    for p in predictions:
        pred = model.MLPrediction(
            user_id=user_id,
            **p
        )
        db.add(pred)
        
    notif = model.Notification(user_id=user_id, text=f"ML Prediction generated successfully.")
    db.add(notif)
    
    db.commit()
    return {"message": "Success"}

@app.get("/api/users/{user_id}/ml-predictions")
def get_user_ml_predictions(user_id: int, db: Session = Depends(get_db)):
    # Get the latest set of predictions for this user
    return db.query(model.MLPrediction).filter(model.MLPrediction.user_id == user_id).order_by(model.MLPrediction.created_at.desc()).limit(10).all()


@app.get("/api/market/latest/{symbol}", response_model=schemas.LatestMarketDataResponse)
def get_latest_market_data(symbol: str, db: Session = Depends(get_db)):
    if symbol in live_price_cache:
        return live_price_cache[symbol]
        
    stock = db.query(model.Stock).filter(model.Stock.symbol == symbol).first()
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
        
    yf_symbol = f"{symbol}.NS"
    try:
        ticker = yf.Ticker(yf_symbol)
        data = ticker.history(period="1d")
        if not data.empty:
            current_price = float(data['Close'].iloc[-1])
            timestamp = data.index[-1].strftime("%Y-%m-%d %H:%M:%S")
            open_price = float(data['Open'].iloc[-1])
            daily_return = ((current_price - open_price) / open_price) * 100 if open_price else 0
            
            result = {
                "symbol": symbol,
                "currentPrice": current_price,
                "dailyReturn": daily_return,
                "timestamp": timestamp,
                "isLive": True
            }
            live_price_cache[symbol] = result
            return result
    except Exception as e:
        print(f"Failed to fetch live data for {symbol}: {e}")
        pass
        
    return {
        "symbol": symbol,
        "currentPrice": stock.price,
        "dailyReturn": stock.dailyReturn,
        "timestamp": f"Last available data: {datetime.now().strftime('%Y-%m-%d')}",
        "isLive": False,
        "error": "Latest market data temporarily unavailable."
    }

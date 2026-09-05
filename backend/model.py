from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    avatar = Column(String, nullable=True)
    terminalName = Column(String, default="SECURE_NODE_01")
    theme = Column(String, default="dark")
    notifications_enabled = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    last_activity = Column(String, default="ONLINE")

    portfolios = relationship("Portfolio", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    backtests = relationship("BacktestResult", back_populates="user", cascade="all, delete-orphan")

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    text = Column(String)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")

class Portfolio(Base):
    __tablename__ = "portfolios"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    amount = Column(String)
    riskPreference = Column(String)
    objective = Column(String)
    expectedReturn = Column(Float)
    risk = Column(Float)
    sharpeRatio = Column(Float)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="portfolios")
    allocations = relationship("PortfolioAllocation", back_populates="portfolio", cascade="all, delete-orphan")
    backtest = relationship("BacktestResult", back_populates="portfolio", uselist=False, cascade="all, delete-orphan")

class PortfolioAllocation(Base):
    __tablename__ = "portfolio_allocations"
    id = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id"))
    symbol = Column(String)
    allocation = Column(Float)

    portfolio = relationship("Portfolio", back_populates="allocations")

class BacktestResult(Base):
    __tablename__ = "backtest_results"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    portfolio_id = Column(Integer, ForeignKey("portfolios.id"))
    start_date = Column(String)
    end_date = Column(String)
    initial_investment = Column(Float)
    results_json = Column(String) # Serialized JSON string of the chart data
    annualized_return = Column(Float, nullable=True)
    annualized_volatility = Column(Float, nullable=True)
    sharpe_ratio = Column(Float, nullable=True)
    max_drawdown = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="backtests")
    portfolio = relationship("Portfolio", back_populates="backtest")

class Stock(Base):
    __tablename__ = "stocks"
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, unique=True, index=True)
    name = Column(String)
    price = Column(Float)
    dailyReturn = Column(Float)
    annualReturn = Column(Float)
    volatility = Column(Float)
    high52 = Column(Float)
    low52 = Column(Float)

class HistoricalData(Base):
    __tablename__ = "historical_data"
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True)
    date = Column(String)
    price = Column(Float)
    return_val = Column(Float)
    volatility = Column(Float)

class MLPrediction(Base):
    __tablename__ = "ml_predictions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True) # allow null for seed
    symbol = Column(String, index=True) # removed unique=True
    name = Column(String)
    predictedReturn = Column(Float)
    signal = Column(String)
    confidence = Column(Integer)
    actualReturn = Column(Float)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

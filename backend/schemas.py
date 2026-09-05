from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional, Dict
from datetime import datetime

class StockResponse(BaseModel):
    symbol: str
    name: str
    price: float
    dailyReturn: float
    annualReturn: float
    volatility: float
    high52: float
    low52: float
    timestamp: str = "Historical"
    isLive: bool = False
    model_config = ConfigDict(from_attributes=True)

class HistoricalDataResponse(BaseModel):
    date: str
    price: float
    return_val: float
    volatility: float
    model_config = ConfigDict(from_attributes=True)

class MLPredictionResponse(BaseModel):
    symbol: str
    name: str
    predictedReturn: float
    signal: str
    confidence: int
    actualReturn: Optional[float] = None
    model_config = ConfigDict(from_attributes=True)

class PortfolioAllocation(BaseModel):
    symbol: str
    name: str
    allocation: float
    expectedReturn: float
    risk: float
    color: str

class BacktestDataPoint(BaseModel):
    month: str
    optimized: float
    nifty50: float
    equalWeight: float

class CorrelationRequest(BaseModel):
    symbols: List[str]

# New Schemas

class NotificationResponse(BaseModel):
    id: int
    text: str
    is_read: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class PortfolioAllocationResponse(BaseModel):
    symbol: str
    allocation: float
    model_config = ConfigDict(from_attributes=True)

class BacktestResultResponse(BaseModel):
    id: int
    portfolio_id: int
    start_date: str
    end_date: str
    initial_investment: float
    results_json: str
    annualized_return: Optional[float]
    annualized_volatility: Optional[float]
    sharpe_ratio: Optional[float]
    max_drawdown: Optional[float]
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class PortfolioResponse(BaseModel):
    id: int
    name: str
    amount: str
    riskPreference: str
    objective: str
    expectedReturn: float
    risk: float
    sharpeRatio: float
    created_at: datetime
    allocations: List[PortfolioAllocationResponse] = []
    backtest: Optional[BacktestResultResponse] = None
    model_config = ConfigDict(from_attributes=True)

class UserCreate(BaseModel):
    name: str
    email: str
    avatar: Optional[str] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    avatar: Optional[str] = None
    terminalName: Optional[str] = None
    theme: Optional[str] = None
    notifications_enabled: Optional[bool] = None

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    avatar: Optional[str]
    terminalName: str
    theme: str
    notifications_enabled: bool
    created_at: datetime
    last_activity: str
    portfolios: List[PortfolioResponse] = []
    notifications: List[NotificationResponse] = []
    model_config = ConfigDict(from_attributes=True)

class PortfolioCreate(BaseModel):
    name: str
    amount: str
    riskPreference: str
    objective: str
    expectedReturn: float
    risk: float
    sharpeRatio: float
    allocations: Dict[str, float]

class BacktestCreate(BaseModel):
    portfolio_id: int
    start_date: str
    end_date: str
    initial_investment: float

class LatestMarketDataResponse(BaseModel):
    symbol: str
    currentPrice: float
    dailyReturn: float
    timestamp: str
    isLive: bool
    error: Optional[str] = None

class OptimizationRequest(BaseModel):
    symbols: List[str]

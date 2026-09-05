export const STOCKS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2950.45, dailyReturn: 1.2, annualReturn: 18.5, volatility: 15.2, high52: 3000, low52: 2200 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3980.20, dailyReturn: -0.5, annualReturn: 12.1, volatility: 14.8, high52: 4200, low52: 3100 },
  { symbol: 'INFY', name: 'Infosys', price: 1650.75, dailyReturn: 0.8, annualReturn: 14.3, volatility: 18.5, high52: 1750, low52: 1250 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1450.30, dailyReturn: 0.2, annualReturn: 8.5, volatility: 16.4, high52: 1750, low52: 1350 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1050.60, dailyReturn: 1.5, annualReturn: 22.4, volatility: 17.2, high52: 1100, low52: 800 },
  { symbol: 'SBIN', name: 'State Bank of India', price: 750.40, dailyReturn: -0.2, annualReturn: 28.6, volatility: 22.1, high52: 780, low52: 500 },
  { symbol: 'ITC', name: 'ITC Limited', price: 420.15, dailyReturn: 0.1, annualReturn: 15.2, volatility: 12.5, high52: 500, low52: 380 },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical', price: 1550.80, dailyReturn: 2.1, annualReturn: 35.4, volatility: 19.8, high52: 1600, low52: 950 },
  { symbol: 'MARUTI', name: 'Maruti Suzuki', price: 11200.50, dailyReturn: -1.2, annualReturn: 42.1, volatility: 21.5, high52: 11500, low52: 8000 },
  { symbol: 'HCLTECH', name: 'HCL Technologies', price: 1580.90, dailyReturn: 0.6, annualReturn: 19.8, volatility: 16.9, high52: 1700, low52: 1050 },
];

export const ML_PREDICTIONS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', predictedReturn: 1.20, signal: 'BUY', confidence: 78 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', predictedReturn: 0.85, signal: 'BUY', confidence: 72 },
  { symbol: 'INFY', name: 'Infosys', predictedReturn: -0.20, signal: 'HOLD', confidence: 61 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', predictedReturn: 1.50, signal: 'BUY', confidence: 82 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', predictedReturn: 0.50, signal: 'HOLD', confidence: 55 },
  { symbol: 'SBIN', name: 'State Bank of India', predictedReturn: -0.80, signal: 'SELL', confidence: 68 },
  { symbol: 'ITC', name: 'ITC Limited', predictedReturn: 0.30, signal: 'HOLD', confidence: 52 },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical', predictedReturn: 1.80, signal: 'BUY', confidence: 85 },
  { symbol: 'MARUTI', name: 'Maruti Suzuki', predictedReturn: -1.50, signal: 'SELL', confidence: 75 },
  { symbol: 'HCLTECH', name: 'HCL Technologies', predictedReturn: 0.90, signal: 'BUY', confidence: 69 },
];

export const OPTIMIZED_PORTFOLIO = [
  { symbol: 'HDFCBANK', name: 'HDFC Bank', allocation: 18, expectedReturn: 15.2, risk: 11.3, color: '#0ea5e9' },
  { symbol: 'RELIANCE', name: 'Reliance Industries', allocation: 15, expectedReturn: 14.7, risk: 12.1, color: '#3b82f6' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', allocation: 14, expectedReturn: 18.5, risk: 14.2, color: '#6366f1' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', allocation: 12, expectedReturn: 12.1, risk: 10.5, color: '#8b5cf6' },
  { symbol: 'INFY', name: 'Infosys', allocation: 10, expectedReturn: 13.8, risk: 13.1, color: '#a855f7' },
  { symbol: 'ITC', name: 'ITC Limited', allocation: 9, expectedReturn: 10.5, risk: 8.5, color: '#d946ef' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical', allocation: 8, expectedReturn: 22.4, risk: 16.8, color: '#ec4899' },
  { symbol: 'HCLTECH', name: 'HCL Technologies', allocation: 7, expectedReturn: 15.6, risk: 12.9, color: '#f43f5e' },
  { symbol: 'SBIN', name: 'State Bank of India', allocation: 4, expectedReturn: 19.2, risk: 18.5, color: '#f97316' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki', allocation: 3, expectedReturn: 25.4, risk: 21.2, color: '#eab308' },
];

export const BACKTEST_DATA = Array.from({ length: 12 }, (_, i) => {
  const month = new Date(2023, i, 1).toLocaleString('default', { month: 'short' });
  return {
    month,
    optimized: 100000 * Math.pow(1.015, i) * (1 + (Math.random() * 0.04 - 0.01)),
    nifty50: 100000 * Math.pow(1.01, i) * (1 + (Math.random() * 0.05 - 0.02)),
    equalWeight: 100000 * Math.pow(1.012, i) * (1 + (Math.random() * 0.045 - 0.015)),
  };
});

export const STOCK_CHART_DATA = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (30 - i));
  return {
    date: date.toISOString().split('T')[0],
    price: 100 + Math.random() * 20 + i * 0.5,
    return: (Math.random() * 4) - 2,
    volatility: 12 + Math.random() * 5,
  };
});

export const ML_ACTUAL_VS_PREDICTED = ML_PREDICTIONS.map(p => ({
  symbol: p.symbol,
  predicted: p.predictedReturn,
  actual: p.predictedReturn + (Math.random() * 1 - 0.5),
}));

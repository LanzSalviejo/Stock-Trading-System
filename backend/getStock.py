import yfinance as yf
from enum import Enum
import requests
import time
import random
import pandas as pd
from datetime import datetime, timedelta
import mock_data

# Set this to False to use real API data with fallback to mock data
# Set to True to exclusively use mock data
USE_MOCK_DATA = True

session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Cache-Control': 'max-age=0'
})

preset_popular_symbols = {
    'AAPL': -1,
    'MSFT': -1, 
    'GOOG': -1,
    'AMZN': -1,
    'TSLA': -1,
    'META': -1,
    'NFLX': -1,
    'NVDA': -1,
    'AMD': -1,
    'SPY': -1,
}

class Period(Enum):
    DEFAULT         =   None
    ONE_DAY         =   '1d'
    FIVE_DAYS       =   '5d'
    ONE_MONTH       =   '1mo'
    THREE_MONTHS    =   '3mo'
    SIX_MONTHS      =   '6mo'
    ONE_YEAR        =   '1y'
    TWO_YEARS       =   '2y'
    FIVE_YEARS      =   '5y'
    TEN_YEARS       =   '10y'
    YEAR_TO_DATE    =   'ytd'
    MAX             =   'max'

class Interval(Enum):
    DEFAULT         = None
    ONE_MINUTE      = '1m'
    TWO_MINUTES     = '2m'
    FIVE_MINUTES    = '5m'
    FIFTEEN_MINUTES = '15m'
    THIRTY_MINUTES  = '30m'
    SIXTY_MINUTES   = '60m'
    NINETY_MINUTES  = '90m'
    ONE_HOUR        = '1h'
    ONE_DAY         = '1d'
    FIVE_DAY        = '5d'
    ONE_WEEK        = '1wk'
    ONE_MONTH       = '1mo'
    THREE_MONTHS    = '3mo'

def retry_with_backoff(func, max_retries=3, initial_backoff=1):
    """Retry a function with exponential backoff."""
    retries = 0
    while retries < max_retries:
        try:
            return func()
        except Exception as e:
            wait_time = initial_backoff * (2 ** retries) + random.uniform(0, 1)
            print(f"Retrying after {wait_time:.2f} seconds due to error: {str(e)}")
            time.sleep(wait_time)
            retries += 1
    
    # If we've exhausted retries, try one last time and let any exception propagate
    return func()

def get_stockPrice(symbol):
    """Get current stock price with retries and fallback."""
    if USE_MOCK_DATA:
        return mock_data.get_mock_price(symbol)
    
    try:
        def fetch_price():
            ticker = yf.Ticker(symbol)
            
            try:
                quote = ticker.history(period='1d')
                if not quote.empty:
                    return float(quote['Close'].iloc[-1])
            except:
                pass
                
            try:
                info = ticker.info
                for field in ['currentPrice', 'regularMarketPrice', 'previousClose', 'open']:
                    if field in info and info[field] is not None:
                        return float(info[field])
            except:
                pass
                
            raise Exception(f"No price data found for {symbol}")
        
        price = retry_with_backoff(fetch_price)
        return price
    except Exception as e:
        print(f"All retries failed for {symbol}: {str(e)}")
        # Fall back to mock data
        return mock_data.get_mock_price(symbol)

def get_popularStocks():
    """Get popular stock prices with improved resiliency."""
    if USE_MOCK_DATA:
        return mock_data.get_mock_popular_stocks()
    
    try:
        popular_symbols = preset_popular_symbols.copy()
        
        batch_size = 2
        for i in range(0, len(popular_symbols.keys()), batch_size):
            batch = list(popular_symbols.keys())[i:i+batch_size]
            for symbol in batch:
                try:
                    price = get_stockPrice(symbol)
                    popular_symbols[symbol] = price
                except Exception as e:
                    print(f"Error processing {symbol}: {str(e)}")
                    popular_symbols[symbol] = mock_data.get_mock_price(symbol)
            
            if i + batch_size < len(popular_symbols.keys()):
                time.sleep(0.5)
        
        return popular_symbols
    except Exception as e:
        print(f"Error in get_popularStocks: {str(e)}")
        # Fall back to mock data
        return mock_data.get_mock_popular_stocks()

def getBy_PeriodInterval(symbol, period=None, interval=None):
    """Get historical stock data with improved resiliency."""
    if USE_MOCK_DATA:
        return mock_data.get_mock_stock_data(symbol, period, interval)
    
    try:
        def fetch_history():
            ticker = yf.Ticker(symbol)
            
            period_value = period.value if period is not None else '1d'
            interval_value = interval.value if interval is not None else '30m'
            
            history = ticker.history(period=period_value, interval=interval_value)
            
            if history.empty:
                raise Exception(f"No data found for {symbol} with period={period_value}, interval={interval_value}")
            
            return history
        
        history = retry_with_backoff(fetch_history)
        
        if history.empty:
            print(f"Empty history for {symbol}")
            return mock_data.get_mock_stock_data(symbol, period, interval)
        
        required_columns = ['Open', 'High', 'Low', 'Close', 'Volume']
        for col in required_columns:
            if col not in history.columns:
                print(f"Missing column {col} in history for {symbol}")
                return mock_data.get_mock_stock_data(symbol, period, interval)
        
        result = {
            'dates': history.index.strftime('%Y-%m-%d %H:%M:%S').tolist(),
            'open': history['Open'].tolist(),
            'high': history['High'].tolist(),
            'low': history['Low'].tolist(),
            'close': history['Close'].tolist(),
            'volume': history['Volume'].astype(int).tolist()
        }
        
        return result
    except Exception as e:
        print(f"Error getting stock data for {symbol}: {str(e)}")
        # Fall back to mock data
        return mock_data.get_mock_stock_data(symbol, period, interval)
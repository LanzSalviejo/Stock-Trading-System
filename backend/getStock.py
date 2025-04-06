import yfinance as yf
from enum import Enum

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

# Returns:
#           int on success
#           -1 on failure
def get_stockPrice(symbol):
    stock = yf.Ticker(symbol)

    stock_info = stock.info

    current_price = stock_info.get('currentPrice', None)

    if current_price:
        return current_price
    else:
        return -1

def get_popularStocks():
    popular_symbols = preset_popular_symbols
    for symbol in popular_symbols.keys:
        popular_symbols[symbol] = getBy_PeriodInterval(symbol)
        # Available data in popular_symbols[symbol]:
        #       .history(period='1d')
        #       []
        #
    return popular_symbols

def getBy_PeriodInterval(symbol, period=None, interval=None):
    if period is not None and interval is not None:
        return yf.ticker(symbol).history(period = period.value, interval = interval.value)
    
    if period is not None:
        return yf.ticker(symbol).history(period = period.value)
    
    if interval is not None:
        return yf.ticker(symbol).history(interval = interval.value)
    
    return yf.ticker(symbol).history()





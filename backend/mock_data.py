"""
Mock data provider for stock information when Yahoo Finance API fails.
This ensures the application functions even when the external API is unavailable.
"""
import random
import datetime

MOCK_PRICES = {
    'AAPL': 184.32,
    'MSFT': 425.22,
    'GOOG': 172.44,
    'AMZN': 182.87,
    'TSLA': 175.28,
    'META': 495.81,
    'NFLX': 617.32,
    'NVDA': 880.20,
    'AMD': 169.15,
    'SPY': 517.36,
}

def get_mock_price(symbol):
    """Return a mock price for a symbol with some random variation."""
    base_price = MOCK_PRICES.get(symbol, 100.0)  # Default to 100 if symbol not found
    variation = random.uniform(-0.02, 0.02)
    return round(base_price * (1 + variation), 2)

def generate_mock_history(symbol, days=30, interval_minutes=30):
    """Generate mock historical data for a stock."""
    base_price = MOCK_PRICES.get(symbol, 100.0)
    
    time_step = datetime.timedelta(minutes=interval_minutes)
    
    start_date = datetime.datetime.now() - datetime.timedelta(days=days)
    
    points_per_day = 1440 // interval_minutes  # 1440 minutes in a day
    total_points = days * points_per_day
    
    dates = []
    opens = []
    highs = []
    lows = []
    closes = []
    volumes = []
    
    current_price = base_price
    current_time = start_date
    
    trend = random.choice([-1, 1])
    trend_change_prob = 0.1  # Probability of trend changing at each point
    
    for _ in range(total_points):
        if random.random() < trend_change_prob:
            trend = -trend
            
        hour = current_time.hour
        is_market_hours = 9 <= hour <= 16  # 9am to 4pm
        
        volatility = 0.005 if is_market_hours else 0.002
        volume_factor = 1.5 if is_market_hours else 0.5
        
        price_change = current_price * volatility * trend * random.uniform(0.2, 1.0)
        
        open_price = current_price
        close_price = current_price + price_change
        high_price = max(open_price, close_price) + abs(price_change) * random.uniform(0, 0.5)
        low_price = min(open_price, close_price) - abs(price_change) * random.uniform(0, 0.5)
        
        base_volume = random.randint(500000, 2000000)
        volume = int(base_volume * volume_factor * (1 + abs(price_change)/current_price*10))
        
        dates.append(current_time.strftime('%Y-%m-%d %H:%M:%S'))
        opens.append(round(open_price, 2))
        highs.append(round(high_price, 2))
        lows.append(round(low_price, 2))
        closes.append(round(close_price, 2))
        volumes.append(volume)
        
        current_price = close_price
        current_time += time_step
    
    return {
        'dates': dates,
        'open': opens,
        'high': highs,
        'low': lows,
        'close': closes,
        'volume': volumes
    }

def get_mock_popular_stocks():
    """Return mock prices for popular stocks."""
    result = {}
    for symbol in MOCK_PRICES.keys():
        result[symbol] = get_mock_price(symbol)
    return result

# Get mock stock data for a specific period and interval
def get_mock_stock_data(symbol, period=None, interval=None):
    """Generate mock stock data based on period and interval."""
    # Convert period to days
    days_mapping = {
        'ONE_DAY': 1,
        'FIVE_DAYS': 5,
        'ONE_MONTH': 30,
        'THREE_MONTHS': 90,
        'SIX_MONTHS': 180,
        'ONE_YEAR': 365,
        'TWO_YEARS': 730,
        'FIVE_YEARS': 1825,
        'MAX': 1825
    }
    
    # Convert interval to minutes
    interval_mapping = {
        'ONE_MINUTE': 1,
        'TWO_MINUTES': 2,
        'FIVE_MINUTES': 5,
        'FIFTEEN_MINUTES': 15,
        'THIRTY_MINUTES': 30,
        'SIXTY_MINUTES': 60,
        'NINETY_MINUTES': 90,
        'ONE_HOUR': 60,
        'ONE_DAY': 1440,
        'FIVE_DAY': 7200,
        'ONE_WEEK': 10080,
        'ONE_MONTH': 43200
    }
    
    # Default values
    days = 30
    interval_minutes = 30
    
    # Update if period/interval provided
    if period and period.name in days_mapping:
        days = days_mapping[period.name]
    
    if interval and interval.name in interval_mapping:
        interval_minutes = interval_mapping[interval.name]
    
    return generate_mock_history(symbol, days, interval_minutes)
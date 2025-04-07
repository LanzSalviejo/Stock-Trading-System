import React, { useState, useEffect, useCallback } from 'react';
import { getPopularStocks, getStockData } from '../../services/api';
import { StockChart } from './StockChart';
import { SearchIcon, RefreshCw, TrendingUp, AlertTriangle } from 'lucide-react';

const CACHE_DURATION = 5 * 60 * 1000;

export const StockExplorer = () => {
  const [popularStocks, setPopularStocks] = useState({});
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [loadingChart, setLoadingChart] = useState(false);
  const [error, setError] = useState('');
  const [customSymbol, setCustomSymbol] = useState('');
  const [timeframe, setTimeframe] = useState('ONE_DAY');
  const [interval, setInterval] = useState('THIRTY_MINUTES');
  
  const [stockCache, setStockCache] = useState({
    popular: { data: null, timestamp: 0 },
    chart: {}
  });

  const timeframes = [
    { value: 'ONE_DAY', label: '1 Day' },
    { value: 'FIVE_DAYS', label: '5 Days' },
    { value: 'ONE_MONTH', label: '1 Month' },
    { value: 'THREE_MONTHS', label: '3 Months' },
    { value: 'SIX_MONTHS', label: '6 Months' },
    { value: 'ONE_YEAR', label: '1 Year' },
    { value: 'MAX', label: 'Max' }
  ];

  const intervals = [
    { value: 'FIVE_MINUTES', label: '5 Min' },
    { value: 'FIFTEEN_MINUTES', label: '15 Min' },
    { value: 'THIRTY_MINUTES', label: '30 Min' },
    { value: 'ONE_HOUR', label: '1 Hour' },
    { value: 'ONE_DAY', label: '1 Day' },
    { value: 'ONE_WEEK', label: '1 Week' }
  ];

  const fetchPopularStocks = useCallback(async (forceRefresh = false) => {
    setError('');
    
    // Check cache first unless force refresh is requested
    const now = Date.now();
    if (
      !forceRefresh && 
      stockCache.popular.data && 
      (now - stockCache.popular.timestamp) < CACHE_DURATION
    ) {
      setPopularStocks(stockCache.popular.data);
      setLoadingPopular(false);
      return;
    }
    
    setLoadingPopular(true);
    
    try {
      const data = await getPopularStocks();
      if (data.status === 'success') {
        setPopularStocks(data.stocks);
        // Update cache
        setStockCache(prev => ({
          ...prev,
          popular: {
            data: data.stocks,
            timestamp: now
          }
        }));
      } else {
        setError(data.message || 'Failed to fetch popular stocks');
      }
    } catch (err) {
      setError('Network error occurred while fetching popular stocks');
      console.error(err);
    } finally {
      setLoadingPopular(false);
    }
  }, [stockCache]);

  const fetchStockData = useCallback(async (symbol, period, interval) => {
    setLoadingChart(true);
    setError('');
    
    // Generate cache key
    const cacheKey = `${symbol}-${period}-${interval}`;
    
    // Check cache first
    const now = Date.now();
    if (
      stockCache.chart[cacheKey] && 
      (now - stockCache.chart[cacheKey].timestamp) < CACHE_DURATION
    ) {
      setStockData(stockCache.chart[cacheKey].data);
      setLoadingChart(false);
      return;
    }
    
    try {
      const data = await getStockData(symbol, period, interval);
      if (data.status === 'success') {
        setStockData(data.stockData);
        // Update cache
        setStockCache(prev => ({
          ...prev,
          chart: {
            ...prev.chart,
            [cacheKey]: {
              data: data.stockData,
              timestamp: now
            }
          }
        }));
      } else {
        setError(data.message || 'Failed to fetch stock data');
        setStockData(null);
      }
    } catch (err) {
      setError('Network error occurred while fetching stock data');
      setStockData(null);
      console.error(err);
    } finally {
      setLoadingChart(false);
    }
  }, [stockCache]);

  useEffect(() => {
    fetchPopularStocks();
  }, [fetchPopularStocks]);

  useEffect(() => {
    if (selectedStock) {
      fetchStockData(selectedStock, timeframe, interval);
    }
  }, [selectedStock, timeframe, interval, fetchStockData]);

  const handlePopularStockClick = (symbol) => {
    setSelectedStock(symbol);
    setCustomSymbol(symbol);
  };

  const handleCustomSearch = (e) => {
    e.preventDefault();
    if (customSymbol.trim()) {
      setSelectedStock(customSymbol.trim().toUpperCase());
    }
  };

  const handleRefresh = () => {
    // Force refresh from API by ignoring cache
    fetchPopularStocks(true);
    
    // If a stock is selected, also refresh its data
    if (selectedStock) {
      fetchStockData(selectedStock, timeframe, interval);
    }
  };

  const renderPopularStocks = () => {
    if (loadingPopular) {
      return (
        <div className="text-center py-4">
          <RefreshCw className="h-5 w-5 inline animate-spin" />
          <p className="mt-2">Loading popular stocks...</p>
        </div>
      );
    }

    if (error && Object.keys(popularStocks).length === 0) {
      return (
        <div className="text-danger py-4">
          <AlertTriangle className="h-4 w-4 inline mr-1" />
          {error}
          <div className="mt-2">
            <button onClick={() => fetchPopularStocks(true)} className="btn btn-secondary btn-sm">
              <RefreshCw className="h-4 w-4 mr-1" />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    // We'll show default data if we're experiencing errors
    const stocksToShow = Object.keys(popularStocks).length > 0 ? popularStocks : {
      'AAPL': 'N/A',
      'MSFT': 'N/A',
      'GOOG': 'N/A',
      'AMZN': 'N/A',
      'TSLA': 'N/A'
    };

    return (
      <div className="popular-stocks-grid">
        {Object.entries(stocksToShow).map(([symbol, price]) => (
          <div 
            key={symbol}
            className={`popular-stock-item ${selectedStock === symbol ? 'selected' : ''}`}
            onClick={() => handlePopularStockClick(symbol)}
          >
            <div className="stock-symbol">{symbol}</div>
            <div className={`stock-price ${price && price > 0 ? 'text-success' : 'text-secondary'}`}>
              {price && price > 0 ? `$${price.toFixed(2)}` : 'N/A'}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center">
        <h2 className="card-title">Stock Explorer</h2>
        <button 
          onClick={handleRefresh} 
          className="btn btn-secondary btn-sm"
          title="Refresh stocks"
          disabled={loadingPopular}
        >
          <RefreshCw className={`h-4 w-4 ${loadingPopular ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stock Search */}
      <div className="stock-search mb-4">
        <form onSubmit={handleCustomSearch} className="flex">
          <input
            type="text"
            placeholder="Enter stock symbol (e.g., AAPL)"
            value={customSymbol}
            onChange={(e) => setCustomSymbol(e.target.value)}
            className="trade-input"
          />
          <button type="submit" className="btn btn-primary ml-2">
            <SearchIcon className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Popular Stocks */}
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">
          <TrendingUp className="h-4 w-4 inline mr-1" />
          Popular Stocks
        </h3>
        {renderPopularStocks()}
      </div>

      {/* Stock Chart */}
      {selectedStock && (
        <div className="stock-chart-container">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {selectedStock} Chart
            </h3>
            <div className="chart-controls">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="chart-select mr-2"
              >
                {timeframes.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <select
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                className="chart-select"
              >
                {intervals.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {loadingChart ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 inline animate-spin" />
              <p className="mt-2">Loading chart data...</p>
            </div>
          ) : stockData ? (
            <StockChart data={stockData} symbol={selectedStock} />
          ) : (
            <div className="text-center py-8 text-danger">
              <AlertTriangle className="h-8 w-8 inline" />
              <p className="mt-2">{error || `No data available for ${selectedStock}`}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
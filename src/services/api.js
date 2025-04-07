const API_URL = 'http://localhost:5000/api';

export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  return response.json();
};

export const verifyToken = async (token) => {
  const response = await fetch(`${API_URL}/verify-token`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Token verification failed');
  }
  
  return response.json();
};

export const getPopularStocks = async () => {
  try {
    const maxRetries = 3;
    let retryCount = 0;
    let lastError;
    
    while (retryCount < maxRetries) {
      try {
        const response = await fetch(`${API_URL}/get_popular_stocks`);
        
        if (!response.ok) {
          throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.status !== 'success') {
          throw new Error(data.message || 'Failed to fetch popular stocks');
        }
        
        return data;
      } catch (error) {
        retryCount++;
        lastError = error;
        
        if (retryCount < maxRetries) {
          // Wait with exponential backoff
          const waitTime = Math.pow(2, retryCount) * 300;
          console.log(`Retry ${retryCount}/${maxRetries} after ${waitTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }
    
    console.error('All retries failed:', lastError);
    throw lastError;
  } catch (error) {
    console.error('Error fetching popular stocks:', error);
    // Return a formatted error object that the components can handle
    return {
      status: 'failure',
      message: error.message || 'Network error occurred',
      stocks: {} // Return empty stocks object for the UI to handle
    };
  }
};

export const getStockData = async (symbol, period = null, interval = null) => {
  try {
    const maxRetries = 3;
    let retryCount = 0;
    let lastError;
    
    while (retryCount < maxRetries) {
      try {
        const response = await fetch(`${API_URL}/get_stock`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            symbol,
            period,
            interval
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.status !== 'success') {
          throw new Error(data.message || 'Failed to fetch stock data');
        }
        
        return data;
      } catch (error) {
        retryCount++;
        lastError = error;
        
        if (retryCount < maxRetries) {
          // Wait with exponential backoff
          const waitTime = Math.pow(2, retryCount) * 300;
          console.log(`Retry ${retryCount}/${maxRetries} after ${waitTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }
    
    console.error('All retries failed:', lastError);
    throw lastError;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    // Return a formatted error object that the components can handle
    return {
      status: 'failure',
      message: error.message || 'Network error occurred',
      stockData: null
    };
  }
};

// Helper function to handle API errors
export const handleApiError = (error) => {
  console.error('API Error:', error);
  return {
    error: true,
    message: error.message || 'An unexpected error occurred',
  };
};
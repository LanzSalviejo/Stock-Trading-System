import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/auth/LoginForm.jsx';
import { DashboardLayout } from './components/layout/DashboardLayout.jsx';
import { PortfolioSummary } from './components/dashboard/PortfolioSummary.jsx';
import { StockHoldings } from './components/dashboard/StockHoldings.jsx';
import { AdminPanel } from './components/role-specific/AdminPanel.jsx';
import { ManagerPanel } from './components/role-specific/ManagerPanel.jsx';
import { TraderPanel } from './components/role-specific/TraderPanel.jsx';
import { StockExplorer } from './components/stocks/StockExplorer.jsx';
import { verifyToken } from './services/api.js';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        try {
          const userData = JSON.parse(storedData);
          setIsLoggedIn(true);
          setUserRole(userData.role);
          setUserId(userData.userId);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('userData');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (data) => {
    setIsLoggedIn(true);
    setUserRole(data.role);
    setUserId(data.userId);
  };

  const handleLogout = () => {
    // Simply remove stored data and reset state
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserRole('');
    setUserId(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <DashboardLayout userRole={userRole} onLogout={handleLogout}>
      <main className="container py-8">
        {/* Portfolio Summary Section */}
        <PortfolioSummary />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column: Stock Holdings and Stock Explorer */}
          <div className="lg:col-span-2">
            <StockHoldings />
            <div className="mt-6">
              <StockExplorer />
            </div>
          </div>

          {/* Right Column: Role-Specific Panel */}
          <div className="lg:col-span-1">
            {userRole === 'administrator' && <AdminPanel />}
            {userRole === 'manager' && <ManagerPanel />}
            {userRole === 'trader' && <TraderPanel userId={userId} />}
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default App;
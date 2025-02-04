import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/auth/LoginForm.jsx';
import { DashboardLayout } from './components/layout/DashboardLayout.jsx';
import { PortfolioSummary } from './components/dashboard/PortfolioSummary.jsx';
import { StockHoldings } from './components/dashboard/StockHoldings.jsx';
import { AdminPanel } from './components/role-specific/AdminPanel.jsx';
import { ManagerPanel } from './components/role-specific/ManagerPanel.jsx';
import { TraderPanel } from './components/role-specific/TraderPanel.jsx';
import { verifyToken, logout } from './services/api.js';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const data = await verifyToken(token);
          setIsLoggedIn(true);
          setUserRole(data.role);
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (data) => {
    setIsLoggedIn(true);
    setUserRole(data.role);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await logout(token);
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserRole('');
      }
    }
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
          {/* Stock Holdings Table */}
          <div className="lg:col-span-2">
            <StockHoldings />
          </div>

          {/* Role-Specific Panel */}
          <div className="lg:col-span-1">
            {userRole === 'administrator' && <AdminPanel />}
            {userRole === 'manager' && <ManagerPanel />}
            {userRole === 'trader' && <TraderPanel />}
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default App;
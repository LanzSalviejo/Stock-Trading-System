import React, { useState } from 'react';
import { Lock, User, ChevronRight, UserPlus } from 'lucide-react';
import { CreateAccountForm } from './CreateAccountForm';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token (if you implement JWT)
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        
        // Store user data including userId
        localStorage.setItem('userData', JSON.stringify({
          role: data.role,
          userId: data.userId
        }));
        
        onLogin(data);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (showCreateAccount) {
    return <CreateAccountForm onBack={() => setShowCreateAccount(false)} />;
  }

  return (
    <div className="login-form">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Stock Trading System</h1>
          <p className="text-secondary">Please login to continue</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <User className="input-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <Lock className="input-icon" />
            <input
              type="password"
              className="form-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-danger">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? 'Logging in...' : 'Login'}
            {!isLoading && <ChevronRight className="h-4 w-4 ml-2" />}
          </button>
        </form>
        <div className="form-footer">
          <button 
            onClick={() => setShowCreateAccount(true)}
            className="btn btn-link"
          >
            Create New Account <UserPlus className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export { LoginForm };
import React, { useState } from 'react';
import { Lock, User, ChevronRight, UserPlus } from 'lucide-react';

const CreateAccountForm = ({ onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userRole, setUserRole] = useState(1); // default to trader (1)
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/create_account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username, 
          password, 
          userRole: parseInt(userRole) 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Account created successfully! You can now log in.');
        // Reset form
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setUserRole(1);
      } else {
        setError(data.error || 'Account creation failed');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-form">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Create New Account</h1>
          <p className="text-secondary">Enter details for new user</p>
        </div>
        {success && (
          <div className="alert-success">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <User className="input-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
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
              required
            />
          </div>
          <div className="form-group">
            <Lock className="input-icon" />
            <input
              type="password"
              className="form-input"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">User Role:</label>
            <div className="role-selector">
              <label className={`role-option ${userRole === 1 ? 'role-selected' : ''}`}>
                <input
                  type="radio"
                  name="userRole"
                  value={1}
                  checked={userRole === 1}
                  onChange={(e) => setUserRole(Number(e.target.value))}
                />
                <span>Trader</span>
              </label>
              <label className={`role-option ${userRole === 2 ? 'role-selected' : ''}`}>
                <input
                  type="radio"
                  name="userRole"
                  value={2}
                  checked={userRole === 2}
                  onChange={(e) => setUserRole(Number(e.target.value))}
                />
                <span>Manager</span>
              </label>
            </div>
          </div>
          {error && <p className="text-danger">{error}</p>}
          <div className="button-group">
            <button
              type="button"
              onClick={onBack}
              className="btn btn-secondary"
            >
              Back to Login
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? 'Creating...' : 'Create Account'}
              {!isLoading && <UserPlus className="h-4 w-4 ml-2" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { CreateAccountForm };
import React from 'react';

const Navbar = ({ userRole, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">Stock Trading System</div>
        <div className="navbar-user">
          <span className="text-secondary">
            Logged in as: <span className="font-medium capitalize">{userRole}</span>
          </span>
          <button
            onClick={onLogout}
            className="btn btn-danger"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export { Navbar };
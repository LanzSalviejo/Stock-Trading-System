import React from 'react';

const PortfolioSummary = () => {
  return (
    <div className="dashboard-grid">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Portfolio Value</h2>
        </div>
        <div className="value-large text-success">$124,500</div>
        <p className="text-secondary">+2.3% today</p>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Active Positions</h2>
        </div>
        <div className="value-large">12</div>
        <p className="text-secondary">Across 8 companies</p>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Today's P/L</h2>
        </div>
        <div className="value-large text-success">+$2,840</div>
        <p className="text-secondary">Based on closing prices</p>
      </div>
    </div>
  );
};

export { PortfolioSummary };
import React from 'react';

const ManagerPanel = () => {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Team Performance</h2>
        </div>
        <div className="team-performance">
          <div className="team-item">
            <div className="team-stats">
              <span className="user-name">Team 1</span>
              <span className="performance-up">+12.3% MTD</span>
            </div>
          </div>
          <div className="team-item">
            <div className="team-stats">
              <span className="user-name">Team 2</span>
              <span className="performance-down">-2.1% MTD</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export { ManagerPanel };
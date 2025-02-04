import React from 'react';

const AdminPanel = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">User Management</h2>
      </div>
      <div className="user-list">
        <div className="user-item">
          <div className="user-info">
            <span className="user-name">John Doe</span>
            <span className="user-role">Trader</span>
          </div>
          <button className="btn btn-primary">Edit</button>
        </div>
        <div className="user-item">
          <div className="user-info">
            <span className="user-name">Jane Smith</span>
            <span className="user-role">Manager</span>
          </div>
          <button className="btn btn-primary">Edit</button>
        </div>
        <button className="btn btn-primary">Add New User</button>
      </div>
    </div>
  );
};

export { AdminPanel };
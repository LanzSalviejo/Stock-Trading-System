import React from 'react';
import { Navbar } from './Navbar'; 

const DashboardLayout = ({ children, userRole, onLogout }) => {
  return (
    <div className="min-h-screen">
      <Navbar userRole={userRole} onLogout={onLogout} />
      <div className="container">
        {children}
      </div>
    </div>
  );
};

export { DashboardLayout };
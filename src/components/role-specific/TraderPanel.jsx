import React, { useState, useEffect } from 'react';
import { TransactionPanel } from '../transactions/TransactionPanel';

const TraderPanel = () => {
  const [userId, setUserId] = useState(null);
  
  useEffect(() => {
    // Get userId from login response stored in localStorage
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      try {
        const userData = JSON.parse(storedData);
        if (userData && userData.userId) {
          setUserId(userData.userId);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);
  
  if (!userId) {
    return <div>Loading user information...</div>;
  }
  
  return (
    <>
      <div className="card mb-6">
        <div className="card-header">
          <h2 className="card-title">Quick Trade</h2>
        </div>
        <form className="trade-form">
          <input
            type="text"
            className="trade-input"
            placeholder="Symbol"
          />
          <input
            type="number"
            className="trade-input"
            placeholder="Quantity"
          />
          <div className="trade-actions">
            <button
              type="button"
              className="btn btn-success"
            >
              Buy
            </button>
            <button
              type="button"
              className="btn btn-danger"
            >
              Sell
            </button>
          </div>
        </form>
      </div>
      
      <TransactionPanel userId={userId} />
    </>
  );
};
  
export { TraderPanel };
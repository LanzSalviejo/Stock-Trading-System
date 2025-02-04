import React from 'react';

const TraderPanel = () => {
    return (
      <div className="card">
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
    );
  };
  
  export { TraderPanel };
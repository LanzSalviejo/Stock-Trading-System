import React from 'react';
import { RefreshCcw } from 'lucide-react';

const TransactionList = ({ transactions, loading, error, onRefresh }) => {
  if (loading) {
    return <div className="text-center py-4">Loading transactions...</div>;
  }

  if (error) {
    return (
      <div className="text-danger py-4">
        <p>{error}</p>
        <button 
          onClick={onRefresh} 
          className="btn btn-secondary mt-2"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-4 text-secondary">
        <p>No transactions found</p>
        <button 
          onClick={onRefresh} 
          className="btn btn-secondary mt-2"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <div className="flex justify-between items-center mb-4">
        <h3>Your Transaction History</h3>
        <button 
          onClick={onRefresh} 
          className="btn btn-secondary"
          title="Refresh transactions"
        >
          <RefreshCcw className="h-4 w-4" />
        </button>
      </div>
      
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Stock</th>
              <th>Date</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.transactionid}>
                <td>{transaction.transactionid}</td>
                <td>{transaction.stocksymbol}</td>
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td>${parseFloat(transaction.price).toFixed(2)}</td>
                <td>{transaction.quantity}</td>
                <td>
                  ${(
                    parseFloat(transaction.price) * parseInt(transaction.quantity)
                  ).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { TransactionList };
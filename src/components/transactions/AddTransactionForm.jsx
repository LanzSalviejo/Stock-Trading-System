import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';

const AddTransactionForm = ({ userId, onTransactionAdded }) => {
  const [formData, setFormData] = useState({
    transactionid: '',
    userid: userId,
    stocksymbol: '',
    date: new Date().toISOString().split('T')[0],
    price: '',
    quantity: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/add_transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Transaction added successfully!');
        // Reset form fields except userId
        setFormData({
          transactionid: '',
          userid: userId,
          stocksymbol: '',
          date: new Date().toISOString().split('T')[0],
          price: '',
          quantity: ''
        });
        
        if (onTransactionAdded) {
          onTransactionAdded();
        }
      } else {
        setError(data.message || 'Failed to add transaction');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error adding transaction:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="transaction-form-container">
      {success && (
        <div className="alert-success">
          {success}
        </div>
      )}
      
      {error && (
        <div className="text-danger mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-group">
          <label htmlFor="transactionid" className="form-label">Transaction ID</label>
          <input
            id="transactionid"
            name="transactionid"
            type="text"
            className="transaction-input"
            placeholder="Enter unique transaction ID"
            value={formData.transactionid}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="stocksymbol" className="form-label">Stock Symbol</label>
          <input
            id="stocksymbol"
            name="stocksymbol"
            type="text"
            className="transaction-input"
            placeholder="E.g., AAPL, MSFT"
            value={formData.stocksymbol}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="date" className="form-label">Transaction Date</label>
          <input
            id="date"
            name="date"
            type="date"
            className="transaction-input"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="price" className="form-label">Price Per Share</label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            className="transaction-input"
            placeholder="Enter price per share"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="quantity" className="form-label">Quantity</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            step="1"
            min="1"
            className="transaction-input"
            placeholder="Enter number of shares"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>
        
        <button 
          type="submit"
          disabled={isLoading}
          className="btn btn-primary"
        >
          {isLoading ? 'Adding Transaction...' : 'Add Transaction'}
          {!isLoading && <DollarSign className="h-4 w-4 ml-2" />}
        </button>
      </form>
    </div>
  );
};

export { AddTransactionForm };
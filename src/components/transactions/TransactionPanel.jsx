import React, { useState, useEffect } from 'react';
import { PlusCircle, ListOrdered } from 'lucide-react';
import { AddTransactionForm } from './AddTransactionForm';
import { TransactionList } from './TransactionList';

const TransactionPanel = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('add');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:5000/api/get_transactions?userid=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      
      const data = await response.json();
      if (data.status === 'success') {
        setTransactions(data.transactions || []);
      } else {
        throw new Error(data.message || 'Unknown error');
      }
    } catch (err) {
      setError(err.message || 'Error loading transactions');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'view') {
      fetchTransactions();
    }
  }, [activeTab, userId]);

  const handleTransactionAdded = () => {
    // After adding a transaction, refresh the list
    if (activeTab === 'view') {
      fetchTransactions();
    } else {
      setActiveTab('view');
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Transactions</h2>
      </div>
      
      <div className="transaction-tabs">
        <div 
          className={`transaction-tab ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          <PlusCircle className="h-4 w-4 inline mr-1" />
          Add Transaction
        </div>
        <div 
          className={`transaction-tab ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
        >
          <ListOrdered className="h-4 w-4 inline mr-1" />
          View Transactions
        </div>
      </div>
      
      {activeTab === 'add' && (
        <AddTransactionForm 
          userId={userId} 
          onTransactionAdded={handleTransactionAdded}
        />
      )}
      
      {activeTab === 'view' && (
        <TransactionList 
          transactions={transactions}
          loading={loading}
          error={error}
          onRefresh={fetchTransactions}
        />
      )}
    </div>
  );
};

export { TransactionPanel };
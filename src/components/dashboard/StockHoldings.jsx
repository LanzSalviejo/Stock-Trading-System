import React from "react";

const StockHoldings = () => {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Current Holdings</h2>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Shares</th>
                <th>Avg Price</th>
                <th>Current</th>
                <th>P/L</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>AAPL</td>
                <td>100</td>
                <td>$150.25</td>
                <td>$155.50</td>
                <td className="text-success">+$525.00</td>
              </tr>
              <tr>
                <td>MSFT</td>
                <td>50</td>
                <td>$280.00</td>
                <td>$275.50</td>
                <td className="text-danger">-$225.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

export { StockHoldings };
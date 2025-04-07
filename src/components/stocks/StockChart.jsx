import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const StockChart = ({ data, symbol }) => {
  const chartData = data.dates.map((date, index) => {
    return {
      date: new Date(date).toLocaleString(),
      open: data.open[index],
      high: data.high[index],
      low: data.low[index],
      close: data.close[index],
      volume: data.volume[index]
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-date">{label}</p>
          <p className="tooltip-open">Open: ${payload[0].payload.open.toFixed(2)}</p>
          <p className="tooltip-high">High: ${payload[0].payload.high.toFixed(2)}</p>
          <p className="tooltip-low">Low: ${payload[0].payload.low.toFixed(2)}</p>
          <p className="tooltip-close">Close: ${payload[0].payload.close.toFixed(2)}</p>
          <p className="tooltip-volume">Volume: {payload[0].payload.volume.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="stock-chart">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(tick) => {
              const date = new Date(tick);
              return date.toLocaleDateString();
            }}
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fontSize: 12 }}
            tickFormatter={(tick) => `$${tick.toFixed(2)}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="close"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
            name="Price"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
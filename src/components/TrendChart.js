import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const generateData = (timeRange) => {
  if (timeRange === 'week') {
    return [
      { name: 'Mon', amount: 150 },
      { name: 'Tue', amount: 0 },
      { name: 'Wed', amount: 200 },
      { name: 'Thu', amount: 100 },
      { name: 'Fri', amount: 0 },
      { name: 'Sat', amount: 250 },
      { name: 'Sun', amount: 150 }
    ];
  } else if (timeRange === 'month') {
    return [
      { name: 'Week 1', amount: 450 },
      { name: 'Week 2', amount: 300 },
      { name: 'Week 3', amount: 650 },
      { name: 'Week 4', amount: 500 }
    ];
  } else {
    return [
      { name: 'Jan', amount: 1200 },
      { name: 'Feb', amount: 1100 },
      { name: 'Mar', amount: 1400 },
      { name: 'Apr', amount: 1300 },
      { name: 'May', amount: 1600 },
      { name: 'Jun', amount: 1450 },
      { name: 'Jul', amount: 1550 },
      { name: 'Aug', amount: 1700 },
      { name: 'Sep', amount: 1500 },
      { name: 'Oct', amount: 1650 },
      { name: 'Nov', amount: 1800 },
      { name: 'Dec', amount: 1900 }
    ];
  }
};

export default function TrendChart({ timeRange }) {
  const data = generateData(timeRange);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="name" stroke="#666" />
        <YAxis stroke="#666" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '8px'
          }}
        />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="#10b981"
          strokeWidth={3}
          dot={{ fill: '#10b981', r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

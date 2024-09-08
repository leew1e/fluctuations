import React from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow">
        <p className="text-sm">{`Time: ${label.toFixed(3)}`}</p>
        <p className="text-sm">{`${payload[0].name}: ${payload[0].value.toFixed(3)}`}</p>
      </div>
    );
  }
  return null;
};

const Graph = ({ title, dataKey, color, data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2 text-blue-500">{title}</h2>
      <ResponsiveContainer width="100%" height={window.innerHeight * 0.3}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="t"
            label={{
              value: "Time",
              position: "insideBottomRight",
              offset: -10,
            }}
            tickFormatter={(value) => value.toFixed(3)}
          />
          <YAxis
            label={{
              value: title.split(" ")[0],
              angle: -90,
              position: "insideLeft",
            }}
            tickFormatter={(value) => value.toFixed(3)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            name={title.split(" ")[0]}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Graph;
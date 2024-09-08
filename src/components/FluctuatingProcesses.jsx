import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Calculate using next starting values setting from control panel:
// x0 - initial position (m)
// v0 - initial velocity (m/s)
// m - mass (kg)
// c - spring constant (N/m)
// u - phase (rad)
// T - period (s)

// Need to calculate:
// k - frequency (Hz)
// x - current position (from t) (m)

const FluctuatingProcesses = () => {
  const [x0, setX0] = useState(1); // initial position (m)
  const [v0, setV0] = useState(0); // initial velocity (m/s)
  const [m, setM] = useState(1); // mass (kg)
  const [c, setC] = useState(1); // spring constant (N/m)
  const [u, setU] = useState(0); // phase (rad)
  const [T, setT] = useState(1); // period (s)
  const [isSimulating, setIsSimulating] = useState(false);
  const [time, setTime] = useState(0);
  const [data, setData] = useState([]);
  const [smoothMultiplier, setSmoothMultiplier] = useState(50);

  useEffect(() => {
    if (isSimulating) {
      const interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1 / smoothMultiplier;
          const k = (2 * Math.PI) / T; // frequency (Hz)
          const A = x0;
          const B = v0 / k;
          const xMax = Math.sqrt(A * A + B * B);
          const xNew = xMax * Math.sin(k * newTime + u);
          const vNew = -xMax * k * Math.cos(k * newTime + u);

          setData((prevData) => [
            ...prevData,
            { t: newTime, x: xNew, v: vNew },
          ]);
          return newTime;
        });
      }, 1000 / smoothMultiplier);

      return () => clearInterval(interval);
    }
  }, [isSimulating, x0, v0, m, c, u, T, smoothMultiplier]);

  const handleSimulation = () => {
    setIsSimulating(!isSimulating);
  };

  const handleRestartSimulation = () => {
    setIsSimulating(false);
    setTime(0);
    setData([]);
  };

  const renderOscillationSimulation = () => {
    const position = data.length > 0 ? data[data.length - 1].x : 0;
    const maxAmplitude = x0 * 2;
    const circleSize = 16; // 4rem = 16px
    const circlePosition = ((position + x0) / maxAmplitude) * 100;
    const clampedPosition = Math.max(0, Math.min(100, circlePosition));

    return (
      <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden mx-auto w-full">
        <div
          className="absolute top-0 bottom-0 w-4 h-4 bg-blue-500 rounded-full transform -translate-y-1/2"
          style={{
            left: `calc(${clampedPosition}% - ${circleSize / 2}px)`,
            top: "50%",
          }}
        ></div>
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 text-xs text-gray-600 ml-2">
          {-x0.toFixed(2)}
        </div>
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-xs text-gray-600 mr-2">
          {x0.toFixed(2)}
        </div>
      </div>
    );
  };

  const renderGraph = (title, dataKey, color) => {
    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-white p-2 border border-gray-300 rounded shadow">
            <p className="text-sm">{`Time: ${label.toFixed(2)}`}</p>
            <p className="text-sm">{`${
              title.split(" ")[0]
            }: ${payload[0].value.toFixed(2)}`}</p>
          </div>
        );
      }
      return null;
    };

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
              tickFormatter={(value) => value.toFixed(2)}
            />
            <YAxis
              label={{
                value: title.split(" ")[0],
                angle: -90,
                position: "insideLeft",
              }}
              tickFormatter={(value) => value.toFixed(2)}
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

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 w-full">
      <h1 className="text-3xl font-bold mb-6 text-blue-500">Fluctuations</h1>
      <div className="flex flex-row gap-6">
        {/* Left side: Graphs and Simulation */}
        <div className="w-5/6 space-y-6">
          {/* Graphs */}
          <div className="flex flex-col gap-6">
            {renderGraph("Velocity vs Time", "v", "#8884d8")}
            {renderGraph("Position vs Time", "x", "#00ff00")}
          </div>

          {/* Fluctuation Simulation */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2 text-blue-500">
              Fluctuation Simulation
            </h2>
            {renderOscillationSimulation()}
          </div>
        </div>

        {/* Right side: Control Panel */}
        <div className="w-1/6">
          <div className="bg-white p-4 rounded-lg shadow-md h-full">
            <h2 className="text-lg font-semibold mb-4 text-blue-500">
              Control Panel
            </h2>
            <div className="space-y-4 flex flex-col h-[calc(100%-4rem)]">
              <div className="flex-grow space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    x0 (m)
                  </label>
                  <input
                    type="number"
                    value={x0}
                    onChange={(e) => setX0(parseFloat(e.target.value))}
                    step="0.1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 py-1 px-2 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    v0 (m/s)
                  </label>
                  <input
                    type="number"
                    value={v0}
                    onChange={(e) => setV0(parseFloat(e.target.value))}
                    step="0.1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 py-1 px-2 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mass (kg)
                  </label>
                  <input
                    type="number"
                    value={m}
                    onChange={(e) => setM(parseFloat(e.target.value))}
                    step="0.1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 py-1 px-2 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    c (N/m)
                  </label>
                  <input
                    type="number"
                    value={c}
                    onChange={(e) => setC(parseFloat(e.target.value))}
                    step="0.1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 py-1 px-2 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    u (rad)
                  </label>
                  <input
                    type="number"
                    value={u}
                    onChange={(e) => setU(parseFloat(e.target.value))}
                    step="0.1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 py-1 px-2 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    T (s)
                  </label>
                  <input
                    type="number"
                    value={T}
                    onChange={(e) => setT(parseFloat(e.target.value))}
                    step="0.1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 py-1 px-2 bg-gray-50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Smooth Multiplier
                  </label>
                  <input
                    type="number"
                    value={smoothMultiplier}
                    onChange={(e) =>
                      setSmoothMultiplier(parseInt(e.target.value))
                    }
                    step="0.1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 py-1 px-2 bg-gray-50"
                  />
                </div>
                <button
                  onClick={handleRestartSimulation}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                >
                  Restart
                </button>
                <button
                  onClick={handleSimulation}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                >
                  {isSimulating ? "Stop" : "Start"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FluctuatingProcesses;

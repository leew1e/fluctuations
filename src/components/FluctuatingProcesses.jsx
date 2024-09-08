import React, { useState, useEffect, useMemo } from "react";
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

const FluctuatingProcesses = () => {
  const [x0, setX0] = useState(1);
  const [v0, setV0] = useState(0);
  const [m, setM] = useState(1);
  const [c, setC] = useState(1);
  const [u, setU] = useState(0);
  const [T, setT] = useState(1);
  const [data, setData] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [smoothMultiplier, setSmoothMultiplier] = useState(100);
  const [simulationBound, setSimulationBound] = useState(20);

  const k = useMemo(() => (2 * Math.PI) / T, [T]);
  const a = useMemo(() => x0, [x0]);
  const b = useMemo(() => v0 / k, [v0, k]);
  const xMax = useMemo(() => Math.sqrt(a * a + b * b), [a, b]);

  useEffect(() => {
    const newData = [];
    for (
      let t = 0;
      t <= simulationBound;
      t += simulationBound / smoothMultiplier
    ) {
      const x = a * Math.cos(k * t + u) + b * Math.sin(k * t + u);
      const v = k * (-a * Math.sin(k * t + u) + b * Math.cos(k * t + u));
      newData.push({ t, x, v });
    }
    setData(newData);
    setCurrentIndex(0);
  }, [x0, v0, m, c, u, T, simulationBound, smoothMultiplier, k, a, b]);

  useEffect(() => {
    if (isSimulating) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
      }, 1000 / smoothMultiplier);

      return () => clearInterval(interval);
    }
  }, [isSimulating, data, smoothMultiplier]);

  const handleSimulation = () => {
    setIsSimulating(!isSimulating);
  };

  const handleRestartSimulation = () => {
    setIsSimulating(false);
    setCurrentIndex(0);
  };

  const renderOscillationSimulation = () => {
    const position = data[currentIndex]?.x || 0;
    const circleSize = 16;
    const circlePosition = ((position + x0) / xMax / 2) * 100;
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
          {-xMax.toFixed(3)}
        </div>
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-xs text-gray-600 mr-2">
          {xMax.toFixed(3)}
        </div>
      </div>
    );
  };

  const renderGraph = (title, dataKey, color) => {
    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-white p-2 border border-gray-300 rounded shadow">
            <p className="text-sm">{`Time: ${label.toFixed(3)}`}</p>
            <p className="text-sm">{`${
              title.split(" ")[0]
            }: ${payload[0].value.toFixed(3)}`}</p>
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

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 w-full">
      <h1 className="text-3xl font-bold mb-6 text-blue-500">Fluctuations</h1>
      <div className="flex flex-row gap-6">
        <div className="w-5/6 space-y-6">
          <div className="flex flex-col gap-6">
            {renderGraph("X (t)", "x", "#8884d8")}
            {renderGraph("V (t)", "v", "#00ff00")}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2 text-blue-500">
              Fluctuation Simulation
            </h2>
            {renderOscillationSimulation()}
          </div>
        </div>
        <div className="w-1/6">
          <div className="bg-white p-4 rounded-lg shadow-md h-full">
            <h2 className="text-lg font-semibold mb-4 text-blue-500">
              Control Panel
            </h2>
            <div className="space-y-4 flex flex-col h-[calc(100%-4rem)]">
              <div className="flex-grow space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    X0 (m)
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
                    V0 (m/s)
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
                    m (kg)
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
                    c (N/kg)
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
                    Period (s)
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
                    Simulation Bound (s)
                  </label>
                  <input
                    type="number"
                    value={simulationBound}
                    onChange={(e) =>
                      setSimulationBound(parseFloat(e.target.value))
                    }
                    step="0.1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 py-1 px-2 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Steps
                  </label>
                  <input
                    type="number"
                    value={smoothMultiplier}
                    onChange={(e) =>
                      setSmoothMultiplier(parseInt(e.target.value))
                    }
                    step="1"
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

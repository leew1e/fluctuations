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

const SMOOTH_MULTIPLIER = 30;

const FluctuatingProcesses = () => {
  const [amplitude, setAmplitude] = useState(1);
  const [frequency, setFrequency] = useState(1);
  const [phase, setPhase] = useState(0);
  const [damping, setDamping] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [time, setTime] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (isSimulating) {
      const interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1 / SMOOTH_MULTIPLIER;
          const omega = 2 * Math.PI * frequency;
          const x =
            amplitude *
            Math.exp(-damping * newTime) *
            Math.sin(omega * newTime + phase);
          const v =
            amplitude *
            Math.exp(-damping * newTime) *
            (omega * Math.cos(omega * newTime + phase) -
              damping * Math.sin(omega * newTime + phase));

          setData((prevData) => [...prevData, { t: newTime, x, v }]);
          return newTime;
        });
      }, 1000 / SMOOTH_MULTIPLIER);

      return () => clearInterval(interval);
    }
  }, [isSimulating, amplitude, frequency, phase, damping]);

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
    const maxAmplitude = amplitude * 2;
    const circleSize = 16; // 4rem = 16px
    const circlePosition = ((position + amplitude) / maxAmplitude) * 100;
    const clampedPosition = Math.max(0, Math.min(100, circlePosition));

    return (
      <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden mx-auto w-full">
        <div
          className="absolute top-0 bottom-0 w-4 h-4 bg-blue-500 rounded-full transform -translate-y-1/2"
          style={{
            left: `calc(${clampedPosition}% - ${circleSize / 2}px)`,
            top: "50%"
          }}
        ></div>
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 text-xs text-gray-600 ml-2">
          {-amplitude.toFixed(2)}
        </div>
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-xs text-gray-600 mr-2">
          {amplitude.toFixed(2)}
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
            <p className="text-sm">{`${title.split(" ")[0]}: ${payload[0].value.toFixed(2)}`}</p>
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
              label={{ value: "Time", position: "insideBottomRight", offset: -10 }}
              tickFormatter={(value) => value.toFixed(2)}
            />
            <YAxis
              label={{ value: title.split(" ")[0], angle: -90, position: "insideLeft" }}
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
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Fluctuations</h1>
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
                    Amplitude
                  </label>
                  <input
                    type="number"
                    value={amplitude}
                    onChange={(e) => setAmplitude(parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Frequency
                  </label>
                  <input
                    type="number"
                    value={frequency}
                    onChange={(e) => setFrequency(parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phase
                  </label>
                  <input
                    type="number"
                    value={phase}
                    onChange={(e) => setPhase(parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Damping
                  </label>
                  <input
                    type="number"
                    value={damping}
                    onChange={(e) => setDamping(parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={handleSimulation}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                >
                  {isSimulating ? "Stop" : "Start"}
                </button>
                <button
                  onClick={handleRestartSimulation}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                >
                  Restart
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

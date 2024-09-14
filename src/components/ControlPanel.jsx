import React from "react";

const ControlPanel = ({
  simulationParams,
  isSimulating,
  onParamChange,
  onSimulation,
  onRestart,
}) => {
  const { x0, v0, m, c, u, mu, simulationBound, smoothMultiplier, speedFactor } =
    simulationParams;

  return (
    <div className="w-1/6">
      <div className="bg-white p-4 rounded-lg shadow-md h-full">
        <h2 className="text-lg font-semibold mb-4 text-blue-500">
          Control Panel
        </h2>
        <div className="space-y-4 flex flex-col h-[calc(100%-4rem)]">
          <div className="flex-grow space-y-4">
            {[
              { label: "X0 (m)", value: x0, key: "x0" },
              { label: "V0 (m/s)", value: v0, key: "v0" },
              { label: "m (kg)", value: m, key: "m" },
              { label: "c (N/kg)", value: c, key: "c" },
              { label: "μ (N*s/m^2)", value: mu, key: "mu" },
              { label: "u (rad)", value: u, key: "u" },
            ].map(({ label, value, key }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700">
                  {label}
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) =>
                    onParamChange(key, parseFloat(e.target.value))
                  }
                  step="0.1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 py-1 px-2 bg-gray-50"
                />
              </div>
            ))}
          </div>
          <div className="border-t border-gray-300 my-4"></div>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Simulation Bound (s)
              </label>
              <input
                type="number"
                value={simulationBound}
                onChange={(e) =>
                  onParamChange("simulationBound", parseFloat(e.target.value))
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
                  onParamChange("smoothMultiplier", parseInt(e.target.value))
                }
                step="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 py-1 px-2 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Speed Factor (higher = slower)
              </label>
              <input
                type="number"
                value={speedFactor}
                onChange={(e) => onParamChange("speedFactor", e.target.value)}
                step="0.1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 py-1 px-2 bg-gray-50"
              />
            </div>
            <button
              onClick={onRestart}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
            >
              Restart
            </button>
            <button
              onClick={onSimulation}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
            >
              {isSimulating ? "Stop" : "Start"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;

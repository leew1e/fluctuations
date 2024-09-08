import React from "react";
import SimulationView from "./SimulationView";
import Graph from "./Graph";
import ControlPanel from "./ControlPanel";
import useSimulation from "../hooks/useSimulation";

const FluctuatingProcesses = () => {
  const {
    data,
    currentIndex,
    isSimulating,
    simulationParams,
    handleSimulation,
    handleRestartSimulation,
    handleParamChange,
  } = useSimulation();

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4 md:p-6 w-full">
      <h1 className="text-3xl font-bold mb-4 text-blue-500">Fluctuations</h1>
      <div className="flex flex-row gap-4">
        <div className="w-5/6 space-y-4">
          <div className="flex flex-col gap-4">
            <Graph title="X (t)" dataKey="x" color="#8884d8" data={data} />
            <Graph title="V (t)" dataKey="v" color="#00ff00" data={data} />
          </div>
          <SimulationView
            data={data}
            currentIndex={currentIndex}
            simulationParams={simulationParams}
          />
        </div>
        <ControlPanel
          simulationParams={simulationParams}
          isSimulating={isSimulating}
          onParamChange={handleParamChange}
          onSimulation={handleSimulation}
          onRestart={handleRestartSimulation}
        />
      </div>
    </div>
  );
};

export default FluctuatingProcesses;

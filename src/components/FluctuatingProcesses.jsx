import React from 'react';
import SimulationView from './SimulationView';
import Graph from './Graph';
import ControlPanel from './ControlPanel';
import useSimulation from '../hooks/useSimulation';

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
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 w-full">
      <h1 className="text-3xl font-bold mb-6 text-blue-500">Fluctuations</h1>
      <div className="flex flex-row gap-6">
        <div className="w-5/6 space-y-6">
          <div className="flex flex-col gap-6">
            <Graph title="X (t)" dataKey="x" color="#8884d8" data={data} />
            <Graph title="V (t)" dataKey="v" color="#00ff00" data={data} />
          </div>
          <SimulationView data={data} currentIndex={currentIndex} simulationParams={simulationParams} />
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

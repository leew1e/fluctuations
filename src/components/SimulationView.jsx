import React from "react";

const CIRCLE_SIZE = 8;

const SimulationView = ({ data, currentIndex, simulationParams }) => {
  const { xMax } = simulationParams;
  const position = data[currentIndex]?.x || 0;
  const velocity = data[currentIndex]?.v || 0;
  // Update the position calculation
  const circlePosition = ((position + xMax) / (2 * xMax)) * 100;
  const clampedPosition = Math.max(0, Math.min(100, circlePosition));

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2 text-blue-500">
        Fluctuation Simulation (X: {position.toFixed(3)}, V:{" "}
        {velocity.toFixed(3)})
      </h2>
      <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden mx-auto w-full">
        <div
          className="absolute top-0 bottom-0 w-4 h-4 bg-blue-500 rounded-full transform -translate-y-1/2 cursor-pointer"
          style={{
            left: `calc(${clampedPosition}% - ${CIRCLE_SIZE}px)`,
            top: "50%",
          }}
        />
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 text-xs text-gray-600 ml-2">
          {-xMax.toFixed(3)}
        </div>
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-xs text-gray-600 mr-2">
          {xMax.toFixed(3)}
        </div>
      </div>
    </div>
  );
};

export default SimulationView;

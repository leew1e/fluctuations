import { useState, useEffect, useMemo } from "react";

const useSimulation = () => {
  const [simulationParams, setSimulationParams] = useState({
    x0: 1,
    v0: 0,
    m: 1,
    c: 1,
    u: 0,
    simulationBound: 20,
    smoothMultiplier: 100,
    speedFactor: 1,
  });

  const [data, setData] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { x0, v0, m, c, u, simulationBound, smoothMultiplier, speedFactor } =
    simulationParams;

  const k = useMemo(() => Math.sqrt(c / m), [c, m]);
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
  }, [x0, v0, u, simulationBound, smoothMultiplier, k, a, b]);

  useEffect(() => {
    if (isSimulating) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
      }, (1000 / smoothMultiplier) * speedFactor);

      return () => clearInterval(interval);
    }
  }, [isSimulating, data, smoothMultiplier, speedFactor]);

  const handleSimulation = () => {
    setIsSimulating(!isSimulating);
  };

  const handleRestartSimulation = () => {
    setIsSimulating(false);
    setCurrentIndex(0);
  };

  const handleParamChange = (key, value) => {
    setSimulationParams((prev) => ({ ...prev, [key]: value }));
  };

  return {
    data,
    currentIndex,
    isSimulating,
    simulationParams: { ...simulationParams, xMax },
    handleSimulation,
    handleRestartSimulation,
    handleParamChange,
  };
};

export default useSimulation;

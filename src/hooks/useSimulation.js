import { useState, useEffect, useMemo } from "react";

const FLUCTUATIONS_TYPE = {
  UNDAMPED: 'undamped',
  UNDERDAMPED: 'underdamped',
  OVERDAMPED: 'overdamped',
  CRITICALLY_DAMPED: 'critically_damped'
};

const useSimulation = () => {
  const [simulationParams, setSimulationParams] = useState({
    x0: 1,
    v0: 0,
    m: 1,
    c: 1,
    mu: 0,
    u: 0,
    simulationBound: 20,
    smoothMultiplier: 100,
    speedFactor: 1,
  });

  const [data, setData] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { x0, v0, m, c, mu, u, simulationBound, smoothMultiplier, speedFactor } =
    simulationParams;

  const k = useMemo(() => Math.sqrt(c / m), [c, m]);
  const b = useMemo(() => mu / (2 * m), [mu, m]);

  const fluctuationType = useMemo(() => {
    if (mu === 0) return FLUCTUATIONS_TYPE.UNDAMPED;
    if (b < k) return FLUCTUATIONS_TYPE.UNDERDAMPED;
    if (b > k) return FLUCTUATIONS_TYPE.OVERDAMPED;
    return FLUCTUATIONS_TYPE.CRITICALLY_DAMPED;
  }, [b, k, mu]);

  const xMax = useMemo(() => Math.sqrt(x0 * x0 + (v0 / k) * (v0 / k)), [x0, v0, k]);

  useEffect(() => {
    const newData = [];
    for (let t = 0; t <= simulationBound; t += simulationBound / smoothMultiplier) {
      let x, v;
      switch (fluctuationType) {
        case FLUCTUATIONS_TYPE.UNDAMPED:
          x = x0 * Math.cos(k * t + u) + (v0 / k) * Math.sin(k * t + u);
          v = -k * x0 * Math.sin(k * t + u) + v0 * Math.cos(k * t + u);
          break;
        case FLUCTUATIONS_TYPE.UNDERDAMPED:
          const k1 = Math.sqrt(k * k - b * b);
          const A = x0;
          const B = (v0 + b * x0) / k1;
          x = Math.exp(-b * t) * (A * Math.cos(k1 * t + u) + B * Math.sin(k1 * t + u));
          v = Math.exp(-b * t) * (
            (-b * A - k1 * B) * Math.cos(k1 * t + u) +
            (-b * B + k1 * A) * Math.sin(k1 * t + u)
          );
          break;
        case FLUCTUATIONS_TYPE.OVERDAMPED:
          const n = Math.sqrt(b * b - k * k);
          const c1 = (x0 * (b + n) - v0) / (2 * n);
          const c2 = (x0 * (b - n) + v0) / (2 * n);
          x = Math.exp(-b * t) * (c1 * Math.exp(n * t) + c2 * Math.exp(-n * t));
          v = Math.exp(-b * t) * ((n - b) * c1 * Math.exp(n * t) + (-n - b) * c2 * Math.exp(-n * t));
          break;
        case FLUCTUATIONS_TYPE.CRITICALLY_DAMPED:
          const c1_crit = x0;
          const c2_crit = v0 + b * x0;
          x = Math.exp(-b * t) * (c1_crit + c2_crit * t);
          v = Math.exp(-b * t) * (c2_crit - b * (c1_crit + c2_crit * t));
          break;
      }
      newData.push({ t, x, v });
    }
    setData(newData);
    setCurrentIndex(0);
  }, [x0, v0, u, m, c, mu, simulationBound, smoothMultiplier, fluctuationType, k, b]);

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

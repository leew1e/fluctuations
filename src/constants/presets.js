export const PRESETS = {
  undamped: {
    name: "Undamped",
    params: {
      x0: 1,
      v0: 0,
      m: 1,
      c: 1,
      mu: 0,
      u: 0,
    },
  },
  weakDamping: {
    name: "Weak damping",
    params: {
      x0: 1,
      v0: 0,
      m: 1,
      c: 1,
      mu: 0.1,
      u: 0,
    },
  },
  strongDamping: {
    name: "Strong damping",
    params: {
      x0: 1,
      v0: 0,
      m: 1,
      c: 1,
      mu: 4,
      u: 0,
    },
  },
  criticalDamping: {
    name: "Critical damping",
    params: {
      x0: 1,
      v0: 0,
      m: 1,
      c: 1,
      mu: 2,
      u: 0,
    },
  },
  highFrequency: {
    name: "High frequency",
    params: {
      x0: 1,
      v0: 0,
      m: 1,
      c: 10,
      mu: 0.5,
      u: 0,
    },
  },
  lowFrequency: {
    name: "Low frequency",
    params: {
      x0: 1,
      v0: 0,
      m: 10,
      c: 1,
      mu: 0.5,
      u: 0,
    },
  },
  highInitialVelocity: {
    name: "High initial velocity",
    params: {
      x0: 0,
      v0: 5,
      m: 1,
      c: 1,
      mu: 0.1,
      u: 0,
    },
  },
  shiftedInitialPhase: {
    name: "Shifted initial phase",
    params: {
      x0: 1,
      v0: 0,
      m: 1,
      c: 1,
      mu: 0.1,
      u: Math.PI / 2,
    },
  },
};
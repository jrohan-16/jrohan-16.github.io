/*************************************************************
 * script.js
 * -----------------------------------------------------------
 * Main logic for the Ratio Visualization App
 *************************************************************/

// ========== DOM Elements ==========
const numeratorSlider = document.getElementById("numeratorSlider");
const denominatorSlider = document.getElementById("denominatorSlider");

const numeratorValueLabel = document.getElementById("numeratorValue");
const denominatorValueLabel = document.getElementById("denominatorValue");
const currentRatioLabel = document.getElementById("currentRatioValue");

const oldRatioValueLabel = document.getElementById("oldRatioValue");
const newRatioValueLabel = document.getElementById("newRatioValue");

const setOldRatioBtn = document.getElementById("setOldRatioBtn");
const setNewRatioBtn = document.getElementById("setNewRatioBtn");

// ========== State Variables ==========
// We'll store oldRatio and newRatio for the slope/waterfall charts.
let oldRatio = null;
let newRatio = null;

// ========== Initialization on Page Load ==========
window.onload = () => {
  // Create initial charts
  createContourPlot();
  createSurfacePlot();
  createGaugeChart(1.0);    // default ratio
  createSlopeChart(1.0, 1.0);
  createWaterfallChart(1.0, 1.0);

  // Set default slider states and update
  updateCurrentRatio();
};

// ========== Slider Event Listeners ==========
numeratorSlider.addEventListener("input", updateCurrentRatio);
denominatorSlider.addEventListener("input", updateCurrentRatio);

// ========== Button Event Listeners ==========
setOldRatioBtn.addEventListener("click", () => {
  const currRatio = getCurrentRatio();
  oldRatio = currRatio;
  oldRatioValueLabel.textContent = currRatio.toFixed(2);
  refreshSlopeAndWaterfall();
});

setNewRatioBtn.addEventListener("click", () => {
  const currRatio = getCurrentRatio();
  newRatio = currRatio;
  newRatioValueLabel.textContent = currRatio.toFixed(2);
  refreshSlopeAndWaterfall();
});

// ========== Core Functions ==========

// 1) Get current ratio from sliders
function getCurrentRatio() {
  const num = parseInt(numeratorSlider.value, 10);
  const den = parseInt(denominatorSlider.value, 10);
  return num / den;
}

// 2) Update the displayed ratio and dependent visuals
function updateCurrentRatio() {
  const num = parseInt(numeratorSlider.value, 10);
  const den = parseInt(denominatorSlider.value, 10);
  const ratio = num / den;

  numeratorValueLabel.textContent = num;
  denominatorValueLabel.textContent = den;
  currentRatioLabel.textContent = ratio.toFixed(2);

  // Update Gauge
  updateGaugeChart(ratio);

  // Update Contour marker
  updateContourMarker(num, den);

  // Optionally update the 3D surface with a marker (not shown in this example)
  // For advanced usage, you could add a scatter3d trace.

  // If old and new ratio are set, refresh slope/waterfall
  refreshSlopeAndWaterfall();
}

// 3) Refresh slope and waterfall if oldRatio/newRatio are defined
function refreshSlopeAndWaterfall() {
  if (oldRatio !== null && newRatio !== null) {
    updateSlopeChart(oldRatio, newRatio);
    updateWaterfallChart(oldRatio, newRatio);
  }
}

// ========== Contour Plot ==========

// Create a 2D contour plot of ratio = x / y
function createContourPlot() {
  const step = 5;
  const xVals = [];
  for (let x = 1; x <= 100; x += step) {
    xVals.push(x);
  }
  const yVals = [];
  for (let y = 1; y <= 100; y += step) {
    yVals.push(y);
  }

  // Build Z matrix
  const zData = yVals.map(y => xVals.map(x => x / y));

  const contourTrace = {
    x: xVals,
    y: yVals,
    z: zData,
    type: 'contour',
    colorscale: 'Viridis',
    contours: {
      showlabels: true,
      labelfont: {
        size: 12,
        color: 'white'
      }
    }
  };

  // Marker trace for the current (numerator, denominator) point
  const markerTrace = {
    x: [],
    y: [],
    mode: 'markers',
    marker: { color: 'red', size: 8 },
    name: 'Current'
  };

  const layout = {
    title: 'Contour Plot',
    xaxis: { title: 'Numerator' },
    yaxis: { title: 'Denominator' }
  };

  Plotly.newPlot('contour-plot', [contourTrace, markerTrace], layout);
}

// Update marker position based on slider values
function updateContourMarker(num, den) {
  Plotly.update('contour-plot', {
    x: [[num]],
    y: [[den]]
  }, {}, 1); // trace index 1 (marker trace)
}

// ========== 3D Surface Plot ==========

function createSurfacePlot() {
  const step = 5;
  const xVals = [];
  for (let x = 1; x <= 100; x += step) {
    xVals.push(x);
  }
  const yVals = [];
  for (let y = 1; y <= 100; y += step) {
    yVals.push(y);
  }

  // Build Z matrix for x / y
  const zData = [];
  for (let i = 0; i < yVals.length; i++) {
    const row = [];
    for (let j = 0; j < xVals.length; j++) {
      row.push(xVals[j] / yVals[i]);
    }
    zData.push(row);
  }

  const surfaceTrace = {
    x: xVals,
    y: yVals,
    z: zData,
    type: 'surface',
    colorscale: 'Viridis'
  };

  const layout = {
    title: '3D Surface Plot',
    scene: {
      xaxis: { title: 'Numerator' },
      yaxis: { title: 'Denominator' },
      zaxis: { title: 'Ratio' }
    }
  };

  Plotly.newPlot('surface-plot', [surfaceTrace], layout);
}

// ========== Gauge Chart ==========

function createGaugeChart(initialValue) {
  const data = [{
    type: 'indicator',
    mode: 'gauge+number',
    value: initialValue,
    gauge: {
      axis: { range: [0, 2] },  // Adjust to a suitable range
      steps: [
        { range: [0, 0.5], color: 'lightgray' },
        { range: [0.5, 1], color: 'gray' },
        { range: [1, 2], color: 'darkgray' }
      ]
    }
  }];

  const layout = {
    title: 'Ratio Gauge',
    width: 400,
    height: 300
  };

  Plotly.newPlot('gauge-chart', data, layout);
}

function updateGaugeChart(newValue) {
  Plotly.update('gauge-chart', { value: [newValue] }, {}, 0);
}

// ========== Slope Chart ==========

function createSlopeChart(oldVal, newVal) {
  const data = [{
    x: ['Old', 'New'],
    y: [oldVal, newVal],
    mode: 'lines+markers',
    line: { shape: 'spline', color: 'blue' },
    marker: { size: 8 }
  }];

  const layout = {
    title: 'Slope Chart (Old vs. New)',
    yaxis: { title: 'Ratio' }
  };

  Plotly.newPlot('slope-chart', data, layout);
}

function updateSlopeChart(oldVal, newVal) {
  Plotly.react('slope-chart', [{
    x: ['Old', 'New'],
    y: [oldVal, newVal],
    mode: 'lines+markers',
    line: { shape: 'spline', color: 'blue' }
  }], {
    title: 'Slope Chart (Old vs. New)',
    yaxis: { title: 'Ratio' }
  });
}

// ========== Waterfall Chart ==========

function createWaterfallChart(oldVal, newVal) {
  // Start with a dummy approach: oldVal => newVal in one jump
  const data = [{
    type: 'waterfall',
    orientation: 'v',
    measure: ['absolute', 'absolute'],
    x: ['Old Ratio', 'New Ratio'],
    y: [oldVal, newVal],
    connector: { line: { color: 'gray' } }
  }];

  const layout = {
    title: 'Waterfall Chart',
    xaxis: { title: '' },
    yaxis: { title: 'Ratio' }
  };

  Plotly.newPlot('waterfall-chart', data, layout);
}

// Optionally break into two steps for better explanation
function updateWaterfallChart(oldVal, newVal) {
  // A simple one-step jump:
  Plotly.react('waterfall-chart', [{
    type: 'waterfall',
    orientation: 'v',
    measure: ['absolute', 'absolute'],
    x: ['Old Ratio', 'New Ratio'],
    y: [oldVal, newVal],
    connector: { line: { color: 'gray' } }
  }], {
    title: 'Waterfall Chart',
    xaxis: { title: '' },
    yaxis: { title: 'Ratio' }
  });
}

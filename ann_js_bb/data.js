// Sample cycling time series data for ANN training
// Features: [previous_speed, gradient, wind_speed, temperature]
// Target: next_speed

const cyclingData = {
    // Normalized input features: [prevSpeed, gradient, windSpeed, temperature]
    // Values normalized to 0-1 range
    inputs: [
        // Day 1-30: Morning rides
        [0.5, 0.3, 0.2, 0.6], [0.52, 0.32, 0.21, 0.61], [0.54, 0.28, 0.23, 0.58],
        [0.55, 0.35, 0.19, 0.62], [0.53, 0.25, 0.24, 0.55], [0.51, 0.38, 0.18, 0.65],
        [0.56, 0.22, 0.26, 0.52], [0.58, 0.29, 0.21, 0.59], [0.54, 0.33, 0.19, 0.63],
        [0.52, 0.27, 0.25, 0.56], [0.55, 0.31, 0.2, 0.6], [0.57, 0.24, 0.22, 0.54],
        [0.53, 0.36, 0.17, 0.66], [0.51, 0.26, 0.27, 0.53], [0.56, 0.3, 0.21, 0.61],
        [0.54, 0.28, 0.23, 0.57], [0.52, 0.34, 0.18, 0.64], [0.55, 0.25, 0.24, 0.55],
        [0.53, 0.32, 0.2, 0.62], [0.57, 0.27, 0.22, 0.58], [0.54, 0.31, 0.19, 0.63],
        [0.51, 0.29, 0.25, 0.56], [0.56, 0.33, 0.18, 0.65], [0.52, 0.26, 0.24, 0.54],
        [0.55, 0.3, 0.21, 0.6], [0.53, 0.35, 0.17, 0.67], [0.57, 0.24, 0.23, 0.52],
        [0.54, 0.28, 0.22, 0.59], [0.51, 0.32, 0.2, 0.64], [0.56, 0.27, 0.21, 0.58],
        
        // Day 31-60: Afternoon rides (different conditions)
        [0.6, 0.4, 0.3, 0.7], [0.62, 0.42, 0.28, 0.72], [0.58, 0.38, 0.32, 0.68],
        [0.63, 0.45, 0.25, 0.75], [0.59, 0.35, 0.34, 0.65], [0.61, 0.43, 0.27, 0.73],
        [0.57, 0.37, 0.31, 0.69], [0.64, 0.41, 0.29, 0.71], [0.6, 0.39, 0.28, 0.7],
        [0.62, 0.44, 0.26, 0.74], [0.58, 0.36, 0.33, 0.66], [0.65, 0.4, 0.3, 0.72],
        [0.59, 0.38, 0.31, 0.68], [0.63, 0.42, 0.27, 0.73], [0.61, 0.37, 0.32, 0.67],
        [0.57, 0.43, 0.25, 0.75], [0.64, 0.39, 0.29, 0.71], [0.6, 0.41, 0.28, 0.7],
        [0.62, 0.35, 0.33, 0.66], [0.58, 0.44, 0.26, 0.74], [0.65, 0.38, 0.3, 0.69],
        [0.61, 0.4, 0.27, 0.72], [0.59, 0.36, 0.32, 0.68], [0.63, 0.42, 0.25, 0.75],
        [0.6, 0.39, 0.29, 0.7], [0.57, 0.43, 0.26, 0.74], [0.64, 0.37, 0.31, 0.67],
        [0.62, 0.41, 0.28, 0.72], [0.58, 0.35, 0.33, 0.66], [0.65, 0.4, 0.27, 0.73],
        
        // Day 61-90: Evening rides (varying conditions)
        [0.45, 0.2, 0.15, 0.5], [0.47, 0.22, 0.13, 0.52], [0.43, 0.18, 0.17, 0.48],
        [0.48, 0.25, 0.12, 0.55], [0.44, 0.16, 0.18, 0.46], [0.46, 0.23, 0.14, 0.53],
        [0.42, 0.19, 0.16, 0.49], [0.49, 0.21, 0.15, 0.51], [0.45, 0.24, 0.13, 0.54],
        [0.47, 0.17, 0.17, 0.47], [0.43, 0.22, 0.14, 0.52], [0.5, 0.2, 0.16, 0.5],
        [0.46, 0.26, 0.12, 0.56], [0.44, 0.18, 0.15, 0.48], [0.48, 0.23, 0.14, 0.53],
        [0.45, 0.21, 0.13, 0.51], [0.47, 0.19, 0.16, 0.49], [0.43, 0.25, 0.12, 0.55],
        [0.46, 0.17, 0.17, 0.46], [0.44, 0.22, 0.14, 0.52], [0.49, 0.2, 0.15, 0.5],
        [0.45, 0.24, 0.13, 0.54], [0.47, 0.18, 0.16, 0.47], [0.43, 0.21, 0.14, 0.51],
        [0.48, 0.26, 0.11, 0.57], [0.46, 0.19, 0.15, 0.49], [0.44, 0.23, 0.13, 0.53],
        [0.5, 0.16, 0.17, 0.45], [0.47, 0.22, 0.14, 0.52], [0.45, 0.2, 0.15, 0.5],
    ],
    
    // Target: next speed (normalized)
    outputs: [
        // Day 1-30 targets
        0.54, 0.56, 0.55, 0.53, 0.57, 0.52, 0.58, 0.56, 0.54, 0.55,
        0.57, 0.53, 0.51, 0.58, 0.54, 0.56, 0.52, 0.55, 0.57, 0.53,
        0.56, 0.54, 0.58, 0.52, 0.55, 0.57, 0.51, 0.56, 0.54, 0.57,
        
        // Day 31-60 targets
        0.62, 0.64, 0.6, 0.61, 0.63, 0.59, 0.65, 0.62, 0.6, 0.64,
        0.58, 0.63, 0.61, 0.59, 0.65, 0.6, 0.62, 0.64, 0.58, 0.63,
        0.61, 0.59, 0.65, 0.6, 0.57, 0.64, 0.62, 0.58, 0.63, 0.61,
        
        // Day 61-90 targets
        0.46, 0.48, 0.44, 0.47, 0.45, 0.49, 0.43, 0.48, 0.46, 0.44,
        0.47, 0.45, 0.49, 0.46, 0.48, 0.44, 0.47, 0.45, 0.43, 0.46,
        0.48, 0.44, 0.47, 0.49, 0.45, 0.43, 0.48, 0.46, 0.44, 0.47,
    ]
};

// Function to get training data
function getTrainingData() {
    return {
        xs: tf.tensor2d(cyclingData.inputs),
        ys: tf.tensor2d(cyclingData.outputs, [cyclingData.outputs.length, 1])
    };
}

// Function to get test data (last 10 samples)
function getTestData() {
    const testInputs = cyclingData.inputs.slice(-10);
    const testOutputs = cyclingData.outputs.slice(-10);
    return {
        xs: tf.tensor2d(testInputs),
        ys: tf.tensor2d(testOutputs, [10, 1])
    };
}

// Function to create input for prediction
function createPredictionInput(prevSpeed, gradient, windSpeed, temperature) {
    return tf.tensor2d([[prevSpeed, gradient, windSpeed, temperature]]);
}

// Shuffle data for training
function shuffleData(xs, ys) {
    const indices = tf.linspace(0, xs.shape[0] - 1, xs.shape[0]);
    return tf.data.array({ xs, ys }).shuffle(xs.shape[0]);
}

// Split data into train and validation
function splitData(xs, ys, trainRatio = 0.8) {
    const trainSize = Math.floor(xs.shape[0] * trainRatio);
    const trainXs = xs.slice([0, 0], [trainSize, xs.shape[1]]);
    const trainYs = ys.slice([0, 0], [trainSize, ys.shape[1]]);
    const valXs = xs.slice([trainSize, 0], [xs.shape[0] - trainSize, xs.shape[1]]);
    const valYs = ys.slice([trainSize, 0], [ys.shape[0] - trainSize, ys.shape[1]]);
    return { trainXs, trainYs, valXs, valYs };
}

// Export functions for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getTrainingData, getTestData, createPredictionInput, shuffleData, splitData, cyclingData };
}

// Different ANN model architectures for comparison

class ANNModels {
    constructor() {
        this.models = {};
        this.results = {};
    }

    // Model 1: Simple ANN (1 Hidden Layer)
    createSimpleANN(inputShape, learningRate = 0.01) {
        const model = tf.sequential();
        
        // Input layer and hidden layer
        model.add(tf.layers.dense({
            units: 16,
            activation: 'relu',
            inputShape: inputShape,
            kernelInitializer: 'glorotNormal'
        }));
        
        // Output layer
        model.add(tf.layers.dense({
            units: 1,
            activation: 'linear'
        }));
        
        model.compile({
            optimizer: tf.train.adam(learningRate),
            loss: 'meanSquaredError',
            metrics: ['mae']
        });
        
        this.models.simple = model;
        return model;
    }

    // Model 2: Deep ANN (3 Hidden Layers)
    createDeepANN(inputShape, learningRate = 0.01) {
        const model = tf.sequential();
        
        // First hidden layer
        model.add(tf.layers.dense({
            units: 64,
            activation: 'relu',
            inputShape: inputShape,
            kernelInitializer: 'glorotNormal'
        }));
        
        // Second hidden layer
        model.add(tf.layers.dense({
            units: 32,
            activation: 'relu',
            kernelInitializer: 'glorotNormal'
        }));
        
        // Third hidden layer
        model.add(tf.layers.dense({
            units: 16,
            activation: 'relu',
            kernelInitializer: 'glorotNormal'
        }));
        
        // Output layer
        model.add(tf.layers.dense({
            units: 1,
            activation: 'linear'
        }));
        
        model.compile({
            optimizer: tf.train.adam(learningRate),
            loss: 'meanSquaredError',
            metrics: ['mae']
        });
        
        this.models.deep = model;
        return model;
    }

    // Model 3: LSTM (Recurrent Neural Network)
    createLSTM(inputShape, learningRate = 0.01) {
        const model = tf.sequential();
        
        // Reshape input for LSTM [samples, timesteps, features]
        const reshapedInput = [1, inputShape[0]];
        
        // LSTM layer
        model.add(tf.layers.lstm({
            units: 32,
            activation: 'relu',
            returnSequences: false,
            inputShape: reshapedInput
        }));
        
        // Dense layer
        model.add(tf.layers.dense({
            units: 16,
            activation: 'relu'
        }));
        
        // Output layer
        model.add(tf.layers.dense({
            units: 1,
            activation: 'linear'
        }));
        
        model.compile({
            optimizer: tf.train.adam(learningRate),
            loss: 'meanSquaredError',
            metrics: ['mae']
        });
        
        this.models.lstm = model;
        return model;
    }

    // Create model based on type
    createModel(type, inputShape, learningRate = 0.01) {
        switch(type) {
            case 'simple':
                return this.createSimpleANN(inputShape, learningRate);
            case 'deep':
                return this.createDeepANN(inputShape, learningRate);
            case 'lstm':
                return this.createLSTM(inputShape, learningRate);
            default:
                throw new Error(`Unknown model type: ${type}`);
        }
    }

    // Train model and return results
    async trainModel(model, trainXs, trainYs, valXs, valYs, epochs, onEpochEnd) {
        const startTime = performance.now();
        
        const history = await model.fit(trainXs, trainYs, {
            epochs: epochs,
            validationData: [valXs, valYs],
            batchSize: 8,
            shuffle: true,
            callbacks: {
                onEpochEnd: async (epoch, logs) => {
                    if (onEpochEnd) {
                        onEpochEnd(epoch, logs);
                    }
                    // Allow UI to update
                    await tf.nextFrame();
                }
            }
        });
        
        const trainingTime = performance.now() - startTime;
        
        return {
            history: history,
            trainingTime: trainingTime
        };
    }

    // Evaluate model
    async evaluateModel(model, testXs, testYs) {
        const predictions = model.predict(testXs);
        
        // Calculate MSE manually using tensor operations
        const mseTensor = testYs.sub(predictions).square().mean();
        const mseValue = await mseTensor.data();
        
        // Calculate R² Score manually
        const predArray = await predictions.array();
        const actualArray = await testYs.array();
        
        // Calculate mean of actual values
        const meanActual = actualArray.reduce((a, b) => a + b[0], 0) / actualArray.length;
        
        // Calculate SSres and SStot
        let ssRes = 0;
        let ssTot = 0;
        for (let i = 0; i < actualArray.length; i++) {
            ssRes += Math.pow(actualArray[i][0] - predArray[i][0], 2);
            ssTot += Math.pow(actualArray[i][0] - meanActual, 2);
        }
        
        const r2 = 1 - (ssRes / ssTot);
        
        // Clean up tensors
        mseTensor.dispose();
        predictions.dispose();
        
        return {
            mse: mseValue[0],
            r2: r2
        };
    }

    // Save results
    saveResults(modelType, mse, r2, trainingTime) {
        this.results[modelType] = {
            mse: mse,
            r2: r2,
            trainingTime: trainingTime
        };
    }

    // Get all results
    getResults() {
        return this.results;
    }

    // Clear all models
    clearModels() {
        Object.values(this.models).forEach(model => {
            if (model) {
                model.dispose();
            }
        });
        this.models = {};
    }

    // Predict with model
    async predict(model, input) {
        const prediction = model.predict(input);
        const value = await prediction.data();
        prediction.dispose();
        return value[0];
    }
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ANNModels;
}

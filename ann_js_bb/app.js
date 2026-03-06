// Main application logic for ANN Time Series Prediction

class App {
    constructor() {
        this.annModels = new ANNModels();
        this.currentModel = null;
        this.currentModelType = null;
        this.isTraining = false;
        this.chart = null;
        
        // DOM Elements
        this.modelSelect = document.getElementById('modelSelect');
        this.epochsInput = document.getElementById('epochs');
        this.learningRateInput = document.getElementById('learningRate');
        this.trainBtn = document.getElementById('trainBtn');
        this.predictBtn = document.getElementById('predictBtn');
        this.compareBtn = document.getElementById('compareBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.statusText = document.getElementById('statusText');
        this.progressFill = document.getElementById('progressFill');
        this.epochInfo = document.getElementById('epochInfo');
        this.resultsContent = document.getElementById('resultsContent');
        this.comparisonBody = document.getElementById('comparisonBody');
        this.canvas = document.getElementById('predictionChart');
        
        this.init();
    }
    
    init() {
        // Event listeners
        this.trainBtn.addEventListener('click', () => this.train());
        this.predictBtn.addEventListener('click', () => this.predict());
        this.compareBtn.addEventListener('click', () => this.compareModels());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        // Initialize chart
        this.initChart();
        
        // Update status
        this.updateStatus('Ready to train');
    }
    
    updateStatus(message) {
        this.statusText.textContent = message;
    }
    
    updateProgress(percent) {
        this.progressFill.style.width = `${percent}%`;
    }
    
    updateEpochInfo(epoch, loss, valLoss) {
        this.epochInfo.textContent = `Epoch: ${epoch + 1} | Loss: ${loss.toFixed(6)} | Val Loss: ${valLoss.toFixed(6)}`;
    }
    
    initChart() {
        this.ctx = this.canvas.getContext('2d');
        this.drawEmptyChart();
    }
    
    drawEmptyChart() {
        const ctx = this.ctx;
        const width = this.canvas.width = this.canvas.offsetWidth;
        const height = this.canvas.height = 300;
        
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);
        
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        
        // Draw grid
        for (let i = 0; i <= 10; i++) {
            const y = (height / 10) * i;
            ctx.beginPath();
            ctx.moveTo(50, y);
            ctx.lineTo(width - 20, y);
            ctx.stroke();
            
            const x = (width - 70) / 10 * i + 50;
            ctx.beginPath();
            ctx.moveTo(x, 20);
            ctx.lineTo(x, height - 30);
            ctx.stroke();
        }
        
        // Draw axes
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        
        // Y axis
        ctx.beginPath();
        ctx.moveTo(50, 20);
        ctx.lineTo(50, height - 30);
        ctx.stroke();
        
        // X axis
        ctx.beginPath();
        ctx.moveTo(50, height - 30);
        ctx.lineTo(width - 20, height - 30);
        ctx.stroke();
        
        // Labels
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Sample Index', width / 2, height - 5);
        
        ctx.save();
        ctx.translate(15, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Speed', 0, 0);
        ctx.restore();
        
        ctx.fillStyle = '#777';
        ctx.fillText('No data yet', width / 2, height / 2);
    }
    
    drawChart(actual, predicted) {
        const ctx = this.ctx;
        const width = this.canvas.width = this.canvas.offsetWidth;
        const height = 300;
        
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);
        
        const padding = { left: 50, right: 20, top: 20, bottom: 30 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;
        
        // Find min and max
        const allValues = [...actual, ...predicted];
        const minVal = Math.min(...allValues) - 0.05;
        const maxVal = Math.max(...allValues) + 0.05;
        const range = maxVal - minVal;
        
        // Draw grid
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 5; i++) {
            const y = padding.top + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(width - padding.right, y);
            ctx.stroke();
            
            const value = maxVal - (range / 5) * i;
            ctx.fillStyle = '#777';
            ctx.font = '10px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(value.toFixed(2), padding.left - 5, y + 3);
        }
        
        // Draw axes
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top);
        ctx.lineTo(padding.left, height - padding.bottom);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(padding.left, height - padding.bottom);
        ctx.lineTo(width - padding.right, height - padding.bottom);
        ctx.stroke();
        
        // Draw actual values
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        actual.forEach((val, i) => {
            const x = padding.left + (chartWidth / (actual.length - 1)) * i;
            const y = padding.top + chartHeight - ((val - minVal) / range) * chartHeight;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
        
        // Draw predicted values
        ctx.strokeStyle = '#f56565';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        predicted.forEach((val, i) => {
            const x = padding.left + (chartWidth / (predicted.length - 1)) * i;
            const y = padding.top + chartHeight - ((val - minVal) / range) * chartHeight;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
        
        // Draw legend
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(width - 150, 30);
        ctx.lineTo(width - 130, 30);
        ctx.stroke();
        ctx.fillStyle = '#333';
        ctx.fillText('Actual', width - 125, 33);
        
        ctx.strokeStyle = '#f56565';
        ctx.beginPath();
        ctx.moveTo(width - 80, 30);
        ctx.lineTo(width - 60, 30);
        ctx.stroke();
        ctx.fillStyle = '#333';
        ctx.fillText('Predicted', width - 55, 33);
        
        // Labels
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.fillText('Sample Index', width / 2, height - 5);
        
        ctx.save();
        ctx.translate(15, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Speed', 0, 0);
        ctx.restore();
    }
    
    async train() {
        if (this.isTraining) return;
        
        const modelType = this.modelSelect.value;
        const epochs = parseInt(this.epochsInput.value);
        const learningRate = parseFloat(this.learningRateInput.value);
        
        if (epochs < 1 || epochs > 1000) {
            this.updateStatus('Error: Epochs must be between 1 and 1000');
            return;
        }
        
        if (learningRate < 0.0001 || learningRate > 1) {
            this.updateStatus('Error: Learning rate must be between 0.0001 and 1');
            return;
        }
        
        this.isTraining = true;
        this.trainBtn.disabled = true;
        this.predictBtn.disabled = true;
        this.compareBtn.disabled = true;
        
        this.updateStatus(`Training ${modelType.toUpperCase()} model...`);
        
        try {
            // Get training data
            const { xs, ys } = getTrainingData();
            const { trainXs, trainYs, valXs, valYs } = splitData(xs, ys, 0.8);
            
            // Create new model
            this.currentModelType = modelType;
            this.currentModel = this.annModels.createModel(modelType, [4], learningRate);
            
            // Train model
            const result = await this.annModels.trainModel(
                this.currentModel,
                trainXs,
                trainYs,
                valXs,
                valYs,
                epochs,
                (epoch, logs) => {
                    const percent = ((epoch + 1) / epochs) * 100;
                    this.updateProgress(percent);
                    this.updateEpochInfo(epoch, logs.loss, logs.val_loss);
                }
            );
            
            // Evaluate model
            const testData = getTestData();
            const metrics = await this.annModels.evaluateModel(
                this.currentModel,
                testData.xs,
                testData.ys
            );
            
            // Save results
            this.annModels.saveResults(
                modelType,
                metrics.mse,
                metrics.r2,
                result.trainingTime
            );
            
            // Update UI
            this.updateStatus('Training completed!');
            this.predictBtn.disabled = false;
            this.compareBtn.disabled = false;
            
            // Display results
            this.displayResults(metrics, result.trainingTime);
            
            // Draw chart
            const predictions = this.currentModel.predict(testData.xs);
            const actualArray = await testData.ys.array();
            const predArray = await predictions.array();
            
            this.drawChart(
                actualArray.map(a => a[0]),
                predArray.map(p => p[0])
            );
            
            // Clean up
            xs.dispose();
            ys.dispose();
            trainXs.dispose();
            trainYs.dispose();
            valXs.dispose();
            valYs.dispose();
            testData.xs.dispose();
            testData.ys.dispose();
            predictions.dispose();
            
        } catch (error) {
            console.error('Training error:', error);
            this.updateStatus(`Error: ${error.message}`);
        }
        
        this.isTraining = false;
        this.trainBtn.disabled = false;
    }
    
    displayResults(metrics, trainingTime) {
        this.resultsContent.innerHTML = `
            <div class="result-card">
                <h3>${metrics.mse.toFixed(6)}</h3>
                <p>Mean Squared Error</p>
            </div>
            <div class="result-card">
                <h3>${metrics.r2.toFixed(4)}</h3>
                <p>R² Score</p>
            </div>
            <div class="result-card">
                <h3>${(trainingTime / 1000).toFixed(2)}s</h3>
                <p>Training Time</p>
            </div>
            <div class="result-card">
                <h3>${this.currentModelType.toUpperCase()}</h3>
                <p>Model Type</p>
            </div>
        `;
    }
    
    async predict() {
        if (!this.currentModel || this.isTraining) return;
        
        // Example prediction
        const testInput = createPredictionInput(0.55, 0.3, 0.2, 0.6);
        const prediction = await this.annModels.predict(this.currentModel, testInput);
        
        this.updateStatus(`Prediction: ${prediction.toFixed(4)} (input: prevSpeed=0.55, gradient=0.3, wind=0.2, temp=0.6)`);
        
        testInput.dispose();
    }
    
    async compareModels() {
        if (this.isTraining) return;
        
        this.isTraining = true;
        this.trainBtn.disabled = true;
        this.compareBtn.disabled = true;
        
        this.updateStatus('Training and comparing all models...');
        
        const epochs = parseInt(this.epochsInput.value);
        const learningRate = parseFloat(this.learningRateInput.value);
        const { xs, ys } = getTrainingData();
        const { trainXs, trainYs, valXs, valYs } = splitData(xs, ys, 0.8);
        
        const modelTypes = ['simple', 'deep', 'lstm'];
        
        for (const modelType of modelTypes) {
            this.updateStatus(`Training ${modelType.toUpperCase()} model...`);
            
            const model = this.annModels.createModel(modelType, [4], learningRate);
            
            await this.annModels.trainModel(
                model,
                trainXs,
                trainYs,
                valXs,
                valYs,
                epochs
            );
            
            const testData = getTestData();
            const metrics = await this.annModels.evaluateModel(model, testData.xs, testData.ys);
            
            // Get training time from results
            const results = this.annModels.getResults();
            const trainingTime = results[modelType] ? results[modelType].trainingTime : 0;
            
            this.annModels.saveResults(modelType, metrics.mse, metrics.r2, trainingTime);
            
            testData.xs.dispose();
            testData.ys.dispose();
        }
        
        // Display comparison table
        this.displayComparison();
        
        this.updateStatus('Comparison completed!');
        this.isTraining = false;
        this.trainBtn.disabled = false;
        this.compareBtn.disabled = false;
        
        // Clean up
        xs.dispose();
        ys.dispose();
        trainXs.dispose();
        trainYs.dispose();
        valXs.dispose();
        valYs.dispose();
    }
    
    displayComparison() {
        const results = this.annModels.getResults();
        
        this.comparisonBody.innerHTML = '';
        
        Object.entries(results).forEach(([modelType, metrics]) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${modelType.toUpperCase()}</strong></td>
                <td>${metrics.mse.toFixed(6)}</td>
                <td>${metrics.r2.toFixed(4)}</td>
                <td>${(metrics.trainingTime / 1000).toFixed(2)}s</td>
            `;
            this.comparisonBody.appendChild(row);
        });
    }
    
    reset() {
        // Clear models
        this.annModels.clearModels();
        
        // Reset UI
        this.currentModel = null;
        this.currentModelType = null;
        this.resultsContent.innerHTML = '<p>No results yet</p>';
        this.comparisonBody.innerHTML = '';
        this.predictBtn.disabled = true;
        this.compareBtn.disabled = false;
        
        this.updateStatus('Ready to train');
        this.progressFill.style.width = '0%';
        this.epochInfo.textContent = '';
        
        this.drawEmptyChart();
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

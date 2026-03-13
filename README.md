# ANN Time Series Prediction Project

A browser-based artificial neural network project for time series prediction, built with TensorFlow.js. This project compares 2-3 different neural network model architectures for predicting cycling speed based on various environmental factors.

## Features

- **Simple ANN**: A basic feedforward neural network with 1 hidden layer (16 units)
- **Deep ANN**: A deeper feedforward neural network with 3 hidden layers (64, 32, 16 units)
- **LSTM**: A recurrent neural network for sequence prediction

## Getting Started

1. Simply open `index.html` in a modern web browser
2. Select a model type from the dropdown
3. Configure training parameters (epochs, learning rate)
4. Click "Train Model" to start training
5. Use "Compare Models" to train and compare all three models

## How It Works

### Input Features
- Previous speed
- Gradient (terrain slope)
- Wind speed
- Temperature

### Output
- Predicted next speed

## Technologies Used

- **TensorFlow.js**: For building and training neural networks in the browser
- **Vanilla JavaScript**: For application logic
- **HTML5/CSS3**: For the user interface

## Model Comparison

| Model | Architecture | Best For |
|-------|-------------|----------|
| Simple ANN | 1 hidden layer (16 units) | Quick baseline, simple patterns |
| Deep ANN | 3 hidden layers (64→32→16) | Complex patterns, better accuracy |
| LSTM | 32 LSTM units + Dense | Sequential/time series data |

## Browser Requirements

- Chrome, Firefox, Edge, or Safari (latest versions)
- WebGL support required for TensorFlow.js

## Files

- `index.html` - Main application page
- `style.css` - Styling for the application
- `app.js` - Main application logic
- `data.js` - Training data and preprocessing
- `models.js` - Neural network model architectures

## License

MIT License

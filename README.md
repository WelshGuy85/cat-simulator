# CAT Simulator - Computer Adaptive Testing Tool

A comprehensive web-based simulator for Computer Adaptive Testing (CAT) designed for language assessment professionals and students.

## Features

- **Interactive CAT Simulation**: Run adaptive tests with customizable parameters
- **Multiple Estimation Methods**: MLE and WLE (Warm's Weighted Likelihood Estimation)
- **Flexible Stopping Rules**: Fixed-length or variable-length based on target SEM
- **Real-time Visualization**: Charts showing ability progression, SEM curves, and item paths
- **Comprehensive Analysis**: Aggregate statistics including correlation, RMSE, bias, and MAE
- **Data Export**: Download simulation results as CSV files
- **Built-in Help System**: Glossary, FAQ, and preset scenarios

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd my-cat-simulator
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to the provided local URL (typically `http://localhost:5173`)

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

## Usage

### Configuration

1. **Test Takers**: Enter ability values (comma-separated logits)
2. **Item Bank**: Enter item difficulties (comma-separated logits)
3. **Test Design**: Choose stopping rule and estimation method
4. **Run Simulation**: Click "Run Simulation" to start

### Results

- **Individual Results**: View detailed progression for each test taker
- **Aggregate Analysis**: See overall performance metrics and visualizations
- **Export Data**: Download results as CSV for further analysis

## Technical Details

- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts library
- **IRT Models**: 2PL (2-Parameter Logistic) model
- **Estimation**: Newton-Raphson optimization

## Educational Use

This simulator is designed for:
- Understanding CAT principles
- Exploring IRT concepts
- Comparing estimation methods
- Analyzing test design parameters
- Educational workshops and training

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## Support

For questions or support, please refer to the built-in help system or create an issue in the repository.
# Computerized Adaptive Testing (CAT) Simulator

A comprehensive web-based simulation platform for adaptive testing research, item response theory analysis, and test design optimization.

**Built and maintained by Dr. Nathaniel Owen, Oxford University Press**  
© 2025 Oxford University Press. All rights reserved.

## 🌟 Features

### Core Simulation Capabilities
- **Adaptive Testing Engine**: Full CAT simulation with Maximum Likelihood Estimation (MLE) and Weighted Likelihood Estimation (WLE)
- **Item Response Theory**: Built on 2PL IRT model with configurable discrimination parameters
- **Multiple Test Types**: Fixed-length and variable-length adaptive tests
- **Test Design**: Multi-section tests with discrete items and testlets
- **Content Controls**: Topic quotas, consecutive topic limits, and exposure controls

### Data Generation & Management
- **Test Taker Generation**: 7 statistical distributions (uniform, normal, skewed, triangular, bimodal, beta distributions)
- **Item Bank Generation**: From test design or standalone with configurable distributions
- **CSV Import/Export**: Full data import/export capabilities
- **Post-Simulation Rescaling**: Convert logit values to user-defined scales (USCALE, UIMEAN, UDECIM)

### Advanced Analytics
- **Individual Analysis**: Per-test-taker ability progression, standard error, and Fisher information
- **Aggregate Analysis**: Performance metrics, scatterplots, histograms, and tolerance bands
- **Bank Performance**: Item exposure analysis, topic distribution, and constraint violation tracking
- **Real-time Visualization**: Interactive charts with Recharts library

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/cat-simulator.git
cd cat-simulator

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production
```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 📖 User Guide

### 1. Test Taker Generation
Configure your test taker population:
- **Number of Test Takers**: Set the cohort size
- **Distribution**: Choose from 7 statistical distributions
- **Shape Parameters**: Adjust distribution characteristics
- **Decimal Places**: Control precision of generated values

### 2. Test Design
Design your adaptive test structure:
- **Test Type**: Fixed-length or variable-length
- **Sections**: Create multiple test sections with different configurations
- **Items per Section**: Specify item counts for each section
- **Testlets**: Option to group items into testlets (fixed-length only)
- **Topics**: Configure topic distribution for each section

### 3. Item Bank Configuration
Generate or import your item bank:
- **Generate from Test Design**: Create items based on your test structure
- **Standalone Generation**: Generate independent item banks
- **CSV Import**: Import existing item banks with required columns
- **Bank Multipliers**: Scale item bank size per section

### 4. Content & Exposure Controls
Set constraints for realistic test administration:
- **Topic Quotas**: Limit total items per topic across the test
- **Consecutive Topics**: Prevent too many items of the same topic in sequence
- **Exposure Caps**: Limit how often individual items can be used
- **Relaxation Order**: Define which constraints to relax if needed

### 5. Running Simulations
Execute your CAT simulation:
- **Start Simulation**: Click to run the adaptive testing process
- **Monitor Progress**: Watch real-time simulation progress
- **View Results**: Analyze individual and aggregate performance

### 6. Results Analysis

#### Individual Analysis
- **Ability Progression**: See how ability estimates change over time
- **Standard Error Progress**: Monitor measurement precision improvement
- **Fisher Information**: Track information contribution of each item
- **Item Administration**: View the sequence of administered items

#### Aggregate Analysis
- **Performance Metrics**: Bias, RMSE, MAE, and correlation statistics
- **Scatterplot**: True vs. estimated abilities with tolerance bands
- **Histograms**: Compare distributions of abilities and item difficulties
- **Export Data**: Download results as CSV files

#### Bank Performance
- **Item Exposure**: See how often each item was administered
- **Topic Analysis**: Summary of items by topic and group type
- **Performance by Difficulty**: Analysis across difficulty bands
- **Constraint Violations**: Detailed reporting of rule violations

## 🔧 Technical Details

### Architecture
- **Frontend**: React 18 with Vite build system
- **Styling**: Tailwind CSS for responsive design
- **Charts**: Recharts library for data visualization
- **State Management**: React hooks (useState, useMemo, useEffect)

### Key Algorithms
- **Ability Estimation**: MLE and WLE with Newton-Raphson optimization
- **Item Selection**: Maximum Fisher Information criterion
- **Stopping Criteria**: Standard Error threshold or maximum items
- **Testlet Administration**: All items in selected testlet administered together

### Data Formats

#### CSV Import Format
Required columns:
- `difficulty`: Item difficulty in logits
- `topic`: Topic classification (optional)
- `group_type`: "discrete" or "testlet" (optional)
- `testlet_id`: Testlet identifier (optional)
- `section_id`: Section identifier (optional)

#### Export Format
- **Test Taker Data**: ID, true ability, final estimate, standard error, progression
- **Item Bank Data**: ID, difficulty, topic, group type, exposure counts
- **Rescaled Values**: All values converted using USCALE/UIMEAN/UDECIM

## 🌐 GitHub Pages Deployment

### Step 1: Prepare Your Repository
1. Create a new GitHub repository named `cat-simulator`
2. Clone it locally: `git clone https://github.com/yourusername/cat-simulator.git`
3. Copy your project files into the repository

### Step 2: Configure Vite for GitHub Pages
Ensure your `vite.config.js` includes the correct base path:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/cat-simulator/'
})
```

### Step 3: Build and Deploy
```bash
# Build the application
npm run build

# Copy all contents of the dist/ folder to your GitHub repository
# Delete everything in the GitHub repo except .git folder
# Copy all files from dist/ into the GitHub repo root
```

### Step 4: Enable GitHub Pages
1. Go to your repository Settings
2. Scroll to "Pages" section
3. Set Source to "Deploy from a branch"
4. Select "main" branch and "/ (root)" folder
5. Click "Save"

### Step 5: Update After Changes
```bash
# Make your changes to the code
# Delete the dist folder to force a fresh build
rmdir /s /q dist  # Windows
rm -rf dist       # Mac/Linux

# Rebuild
npm run build

# Copy new dist/ contents to GitHub repository
# Commit and push changes
```

## 📊 Example Use Cases

### Educational Research
- Compare different CAT algorithms
- Analyze item bank performance
- Study measurement precision across ability ranges
- Evaluate content balancing strategies

### Test Development
- Design optimal item banks
- Test content constraints
- Validate exposure control mechanisms
- Optimize test length and precision trade-offs

### Psychometric Analysis
- Study bias and precision in ability estimation
- Analyze Fisher Information patterns
- Evaluate stopping criteria effectiveness
- Research testlet vs. discrete item administration

## 🛠️ Troubleshooting

### Common Issues

#### Build Problems
- **Cache issues**: Delete `dist` folder before rebuilding
- **Path errors**: Ensure `vite.config.js` has correct `base` path
- **Dependency issues**: Run `npm install` to update packages

#### GitHub Pages Issues
- **Blank page**: Check that all `dist/` files are in repository root
- **404 errors**: Verify `base: '/cat-simulator/'` in vite config
- **Old content**: Force rebuild by deleting `dist` folder

#### Simulation Issues
- **No results**: Check that item bank and test takers are generated
- **Infinite loops**: Verify stopping criteria are properly set
- **Memory issues**: Reduce number of test takers or items for large simulations

### Performance Tips
- Use smaller cohorts (50-100 test takers) for initial testing
- Limit item banks to 200-500 items for faster simulations
- Enable browser developer tools to monitor performance
- Consider using variable-length tests for efficiency

## 📚 References

- **Item Response Theory**: Embretson & Reise (2000)
- **Computerized Adaptive Testing**: Wainer (2000)
- **Fisher Information**: Samejima (1969)
- **Weighted Likelihood Estimation**: Warm (1989)

## 📄 License

This software is provided for educational and research purposes. All rights reserved by Oxford University Press.

## 🤝 Contributing

This is a research tool maintained by Oxford University Press. For questions or suggestions, please contact Dr. Nathaniel Owen.

## 📞 Support

For technical support or questions about the simulator:
- Check the troubleshooting section above
- Review the user guide for configuration options
- Ensure all dependencies are properly installed
- Verify GitHub Pages deployment steps

---

**Version**: 3.0  
**Last Updated**: January 2025  
**Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)

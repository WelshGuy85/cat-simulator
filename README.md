# cat-simulator
Educational CAT Simulator - Interactive tool for exploring Computer Adaptive Testing in language assessment. Features real-time simulations, IRT models, and comprehensive analytics for workshops and training.

# CAT Simulator – Workshop Edition

Welcome to the Computer Adaptive Testing (CAT) Simulator! This tool is designed for language assessment professionals and students to explore how adaptive testing works in practice.

---

## 📘 Introduction to CAT

Computer Adaptive Testing (CAT) dynamically adjusts the difficulty of test items based on the test taker's ability. It uses Item Response Theory (IRT) to estimate ability and select the most informative items. CAT is widely used in language testing for its efficiency, precision, and personalized assessment experience.

---

## 🖥️ System Requirements

- A modern web browser (Chrome, Firefox, Edge, Safari)
- JavaScript enabled
- No installation required – runs entirely in the browser

---

## 🚀 Getting Started

### 1. **Open the Simulator**
Launch the simulator in your browser (URL provided by the workshop facilitator).

### 2. **Load a Preset Scenario**
Click the **“Load Preset”** button and choose from example scenarios (e.g., Grammar Test, Vocabulary Test, Mixed Topics).

---

## 🧪 Running a Simulation

### Step 1: **Configure Test Takers**
- Enter ability values (e.g., `-1.2, 0.0, 1.5`) in the **Test Takers** input field.

### Step 2: **Configure Item Bank**
- Enter item difficulties (e.g., `-2.0, -1.0, 0.0, 1.0, 2.0`)
- Optionally tag items with topics (e.g., `0.0:Grammar`, `1.0:Vocabulary`)

### Step 3: **Set Parameters**
- Choose **Estimation Method**: MLE or WLE
- Choose **Stopping Rule**:
  - Fixed Length (e.g., 10 items)
  - Target SEM (e.g., 0.3)
- Set **Item Exposure Limit** (e.g., 20%)
- Enable **Content Balancing** if desired

### Step 4: **Run Simulation**
Click **“Run Simulation”** to begin. The simulator will:
- Select items adaptively
- Estimate ability after each item
- Track SEM and Fisher Information
- Respect exposure and topic constraints

---

## 📊 Interpreting Results

### Individual Results
- **Ability Progression**: Line chart of ability estimates
- **SEM Curve**: Standard error over time
- **Item Path**: Items administered and their topics

### Aggregate Results
- **Scatterplot**: True vs. Estimated abilities (with axis labels)
- **Metrics**: Correlation, RMSE, Bias, MAE
- **Item Exposure**: Frequency and topic distribution

---

## 📁 Exporting Data

Click **“Download CSV”** to export:
- Test taker responses
- Item parameters
- Ability estimates
- SEM and Fisher Information
- Topic tags and exposure counts

---

## 🧭 Tutorial Mode

Enable **Tutorial Mode** to activate:
- Tooltips explaining each input and output
- Step-by-step guidance through the simulation
- Definitions of key terms (e.g., SEM, Fisher Information)

---

## 🧠 Learning Goals

By the end of the workshop, you will be able to:
- Explain how CAT works and why it’s used
- Interpret SEM, Fisher Information, and ability estimates
- Design your own adaptive test with topic balancing and exposure control
- Compare adaptive vs. fixed-form test designs

---

For questions or feedback, contact your workshop facilitator.

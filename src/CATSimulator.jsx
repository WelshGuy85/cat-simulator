import React, { useState, useMemo } from 'react';
import { LineChart, Line, ScatterChart, Scatter, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const CATSimulator = () => {
    const [itemBank, setItemBank] = useState([
        { id: 1, difficulty: -2.0, discrimination: 1.0 },
        { id: 2, difficulty: -1.5, discrimination: 1.0 },
        { id: 3, difficulty: -1.0, discrimination: 1.0 },
        { id: 4, difficulty: -0.5, discrimination: 1.0 },
        { id: 5, difficulty: 0.0, discrimination: 1.0 },
        { id: 6, difficulty: 0.5, discrimination: 1.0 },
        { id: 7, difficulty: 1.0, discrimination: 1.0 },
        { id: 8, difficulty: 1.5, discrimination: 1.0 },
        { id: 9, difficulty: 2.0, discrimination: 1.0 },
        { id: 10, difficulty: 2.5, discrimination: 1.0 }
    ]);
    
    const [testTakers, setTestTakers] = useState([0.7]);
    const [testTakersInput, setTestTakersInput] = useState('0.7');
    const [itemBankInput, setItemBankInput] = useState('-2.0, -1.5, -1.0, -0.5, 0.0, 0.5, 1.0, 1.5, 2.0, 2.5');
    
    const [stoppingRule, setStoppingRule] = useState('fixed');
    const [fixedLength, setFixedLength] = useState(7);
    const [targetSEM, setTargetSEM] = useState(0.3);
    
    const [estimationMethod, setEstimationMethod] = useState('mle');
    
    const [results, setResults] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    
    const [activeTab, setActiveTab] = useState('config');
    const [selectedTestTaker, setSelectedTestTaker] = useState(0);

    const probability = (ability, difficulty, discrimination = 1.0) => {
        const z = discrimination * (ability - difficulty);
        return 1 / (1 + Math.exp(-z));
    };

    const fisherInformation = (ability, difficulty, discrimination = 1.0) => {
        const p = probability(ability, difficulty, discrimination);
        return discrimination * discrimination * p * (1 - p);
    };

    const simulateResponse = (trueAbility, difficulty, discrimination = 1.0) => {
        const p = probability(trueAbility, difficulty, discrimination);
        return Math.random() < p ? 1 : 0;
    };

    const estimateAbilityMLE = (responses, items) => {
        let theta = 0;
        const maxIterations = 20;
        const tolerance = 0.001;

        for (let iter = 0; iter < maxIterations; iter++) {
            let firstDerivative = 0;
            let secondDerivative = 0;

            for (let i = 0; i < responses.length; i++) {
                const item = items[i];
                const response = responses[i];
                const p = probability(theta, item.difficulty, item.discrimination);
                
                firstDerivative += item.discrimination * (response - p);
                secondDerivative -= item.discrimination * item.discrimination * p * (1 - p);
            }

            if (Math.abs(firstDerivative) < tolerance) break;
            if (secondDerivative === 0) break;

            theta = theta - firstDerivative / secondDerivative;
            theta = Math.max(-4, Math.min(4, theta));
        }

        let totalFisherInfo = 0;
        for (let i = 0; i < responses.length; i++) {
            const item = items[i];
            totalFisherInfo += fisherInformation(theta, item.difficulty, item.discrimination);
        }
        
        const standardError = totalFisherInfo > 0 ? Math.sqrt(1 / totalFisherInfo) : Infinity;

        return { estimate: theta, standardError, fisherInfo: totalFisherInfo };
    };

    const estimateAbilityWLE = (responses, items) => {
        let theta = 0;
        const maxIterations = 20;
        const tolerance = 0.001;

        for (let iter = 0; iter < maxIterations; iter++) {
            let firstDerivative = 0;
            let secondDerivative = 0;
            let thirdDerivative = 0;

            for (let i = 0; i < responses.length; i++) {
                const item = items[i];
                const response = responses[i];
                const a = item.discrimination;
                const p = probability(theta, item.difficulty, a);
                const q = 1 - p;
                
                firstDerivative += a * (response - p);
                secondDerivative -= a * a * p * q;
                thirdDerivative += a * a * a * p * q * (q - p);
            }

            const biasCorrection = thirdDerivative / (2 * secondDerivative * secondDerivative);
            
            if (Math.abs(firstDerivative) < tolerance) break;
            if (secondDerivative === 0) break;

            theta = theta - (firstDerivative / secondDerivative) - biasCorrection;
            theta = Math.max(-4, Math.min(4, theta));
        }

        let totalFisherInfo = 0;
        for (let i = 0; i < responses.length; i++) {
            const item = items[i];
            totalFisherInfo += fisherInformation(theta, item.difficulty, item.discrimination);
        }
        
        const standardError = totalFisherInfo > 0 ? Math.sqrt(1 / totalFisherInfo) : Infinity;

        return { estimate: theta, standardError, fisherInfo: totalFisherInfo };
    };

    const estimateAbility = (responses, items) => {
        return estimationMethod === 'wle' 
            ? estimateAbilityWLE(responses, items)
            : estimateAbilityMLE(responses, items);
    };

    const selectNextItem = (currentAbilityEstimate, usedItems) => {
        let bestItem = null;
        let maxFisherInfo = 0;

        for (const item of itemBank) {
            if (usedItems.includes(item.id)) continue;
            
            const info = fisherInformation(currentAbilityEstimate, item.difficulty, item.discrimination);
            if (info > maxFisherInfo) {
                maxFisherInfo = info;
                bestItem = item;
            }
        }

        return bestItem;
    };

    const simulateTestTaker = (trueAbility) => {
        const progression = [];
        const responses = [];
        const administeredItems = [];
        const usedItemIds = [];

        let currentEstimate = 0;
        let currentSE = Infinity;
        
        progression.push({
            step: 0,
            itemId: null,
            difficulty: null,
            response: null,
            abilityEstimate: 0,
            standardError: Infinity,
            fisherInfo: 0,
            cumulativeFisherInfo: 0
        });

        let continueTest = true;
        let step = 0;
        const maxItems = Math.min(fixedLength, itemBank.length);

        while (continueTest) {
            step++;
            
            const nextItem = selectNextItem(currentEstimate, usedItemIds);
            if (!nextItem) break;

            const response = simulateResponse(trueAbility, nextItem.difficulty, nextItem.discrimination);
            
            responses.push(response);
            administeredItems.push(nextItem);
            usedItemIds.push(nextItem.id);

            const result = estimateAbility(responses, administeredItems);
            currentEstimate = result.estimate;
            currentSE = result.standardError;

            const itemFisherInfo = fisherInformation(currentEstimate, nextItem.difficulty, nextItem.discrimination);

            progression.push({
                step,
                itemId: nextItem.id,
                difficulty: nextItem.difficulty,
                response,
                abilityEstimate: currentEstimate,
                standardError: currentSE,
                fisherInfo: itemFisherInfo,
                cumulativeFisherInfo: result.fisherInfo
            });

            if (stoppingRule === 'fixed') {
                continueTest = step < maxItems;
            } else if (stoppingRule === 'sem') {
                continueTest = currentSE > targetSEM && step < itemBank.length;
            }
        }

        return {
            trueAbility,
            finalEstimate: currentEstimate,
            finalSE: currentSE,
            itemsAdministered: step,
            progression
        };
    };

    const runSimulation = () => {
        setIsRunning(true);
        
        setTimeout(() => {
            const allResults = testTakers.map(ability => simulateTestTaker(ability));
            setResults(allResults);
            setIsRunning(false);
        }, 100);
    };

    const parseTestTakers = () => {
        try {
            const abilities = testTakersInput.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
            if (abilities.length > 0) {
                setTestTakers(abilities);
                setSelectedTestTaker(0);
            }
        } catch (e) {
            alert('Invalid test taker input format');
        }
    };

    const parseItemBank = () => {
        try {
            const difficulties = itemBankInput.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
            if (difficulties.length > 0) {
                const newBank = difficulties.map((diff, idx) => ({
                    id: idx + 1,
                    difficulty: diff,
                    discrimination: 1.0
                }));
                setItemBank(newBank);
            }
        } catch (e) {
            alert('Invalid item bank input format');
        }
    };

    const aggregateStats = useMemo(() => {
        if (!results || results.length === 0) return null;

        const errors = results.map(r => r.finalEstimate - r.trueAbility);
        const absErrors = errors.map(e => Math.abs(e));
        const sqErrors = errors.map(e => e * e);

        const bias = errors.reduce((a, b) => a + b, 0) / errors.length;
        const rmse = Math.sqrt(sqErrors.reduce((a, b) => a + b, 0) / sqErrors.length);
        const mae = absErrors.reduce((a, b) => a + b, 0) / absErrors.length;
        
        const meanTrue = results.reduce((a, b) => a + b.trueAbility, 0) / results.length;
        const meanEst = results.reduce((a, b) => a + b.finalEstimate, 0) / results.length;
        
        let num = 0, denTrue = 0, denEst = 0;
        for (const r of results) {
            num += (r.trueAbility - meanTrue) * (r.finalEstimate - meanEst);
            denTrue += (r.trueAbility - meanTrue) ** 2;
            denEst += (r.finalEstimate - meanEst) ** 2;
        }
        const correlation = num / Math.sqrt(denTrue * denEst);

        const avgItems = results.reduce((a, b) => a + b.itemsAdministered, 0) / results.length;
        const avgSE = results.reduce((a, b) => a + b.finalSE, 0) / results.length;

        return { bias, rmse, mae, correlation, avgItems, avgSE, errors };
    }, [results]);

    const exportResults = () => {
        if (!results) return;
        
        let csv = 'TestTakerID,TrueAbility,FinalEstimate,FinalSE,ItemsAdministered,Error\n';
        results.forEach((r, idx) => {
            csv += `${idx + 1},${r.trueAbility},${r.finalEstimate},${r.finalSE},${r.itemsAdministered},${r.finalEstimate - r.trueAbility}\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cat_simulation_results.csv';
        a.click();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h1 className="text-4xl font-bold text-blue-900 mb-2">
                        Computerized Adaptive Testing Simulator
                    </h1>
                    <p className="text-gray-600">
                        Interactive tool for understanding Fisher Information and CAT design
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-lg mb-6">
                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab('config')}
                            className={`px-6 py-3 font-medium ${activeTab === 'config' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                        >
                            Configuration
                        </button>
                        <button
                            onClick={() => setActiveTab('individual')}
                            className={`px-6 py-3 font-medium ${activeTab === 'individual' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                            disabled={!results}
                        >
                            Individual Results
                        </button>
                        <button
                            onClick={() => setActiveTab('aggregate')}
                            className={`px-6 py-3 font-medium ${activeTab === 'aggregate' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                            disabled={!results}
                        >
                            Aggregate Analysis
                        </button>
                    </div>
                </div>

                {activeTab === 'config' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-bold mb-4">Test Taker Configuration</h2>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    Test Taker Abilities (comma-separated logits)
                                </label>
                                <textarea
                                    value={testTakersInput}
                                    onChange={(e) => setTestTakersInput(e.target.value)}
                                    className="w-full border rounded p-2 h-24"
                                    placeholder="e.g., -1.5, -1.0, -0.5, 0.0, 0.5, 1.0, 1.5"
                                />
                                <button
                                    onClick={parseTestTakers}
                                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Load Test Takers ({testTakers.length} loaded)
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-bold mb-4">Item Bank Configuration</h2>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    Item Difficulties (comma-separated logits)
                                </label>
                                <textarea
                                    value={itemBankInput}
                                    onChange={(e) => setItemBankInput(e.target.value)}
                                    className="w-full border rounded p-2 h-24"
                                    placeholder="e.g., -2.0, -1.5, -1.0, -0.5, 0.0, 0.5, 1.0, 1.5, 2.0, 2.5"
                                />
                                <button
                                    onClick={parseItemBank}
                                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Load Item Bank ({itemBank.length} items loaded)
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-bold mb-4">Test Design</h2>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Stopping Rule</label>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="fixed"
                                            checked={stoppingRule === 'fixed'}
                                            onChange={(e) => setStoppingRule(e.target.value)}
                                            className="mr-2"
                                        />
                                        Fixed Length
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="sem"
                                            checked={stoppingRule === 'sem'}
                                            onChange={(e) => setStoppingRule(e.target.value)}
                                            className="mr-2"
                                        />
                                        Variable Length (Target SEM)
                                    </label>
                                </div>
                            </div>

                            {stoppingRule === 'fixed' && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">
                                        Number of Items: {fixedLength}
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max={itemBank.length}
                                        value={fixedLength}
                                        onChange={(e) => setFixedLength(parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                            )}

                            {stoppingRule === 'sem' && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">
                                        Target SEM: {targetSEM.toFixed(2)}
                                    </label>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="1.0"
                                        step="0.05"
                                        value={targetSEM}
                                        onChange={(e) => setTargetSEM(parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Estimation Method</label>
                                <select
                                    value={estimationMethod}
                                    onChange={(e) => setEstimationMethod(e.target.value)}
                                    className="w-full border rounded p-2"
                                >
                                    <option value="mle">Maximum Likelihood Estimation (MLE)</option>
                                    <option value="wle">Warm's Weighted Likelihood (WLE)</option>
                                </select>
                                <p className="text-sm text-gray-600 mt-1">
                                    {estimationMethod === 'wle' 
                                        ? 'WLE reduces bias in extreme scores (all correct/incorrect responses)'
                                        : 'MLE is the standard approach but may struggle with extreme scores'}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={runSimulation}
                            disabled={isRunning}
                            className="w-full px-6 py-3 bg-green-600 text-white text-xl font-bold rounded hover:bg-green-700 disabled:opacity-50"
                        >
                            {isRunning ? 'Running Simulation...' : 'Run Simulation'}
                        </button>
                    </div>
                )}

                {activeTab === 'individual' && results && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold">Individual Test Taker Results</h2>
                                <select
                                    value={selectedTestTaker}
                                    onChange={(e) => setSelectedTestTaker(parseInt(e.target.value))}
                                    className="border rounded p-2"
                                >
                                    {results.map((r, idx) => (
                                        <option key={idx} value={idx}>
                                            Test Taker {idx + 1} (θ = {r.trueAbility.toFixed(2)})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {(() => {
                                const ttResult = results[selectedTestTaker];
                                return (
                                    <>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                            <div className="bg-blue-50 p-4 rounded">
                                                <div className="text-sm text-gray-600">True Ability</div>
                                                <div className="text-2xl font-bold">{ttResult.trueAbility.toFixed(3)}</div>
                                            </div>
                                            <div className="bg-green-50 p-4 rounded">
                                                <div className="text-sm text-gray-600">Final Estimate</div>
                                                <div className="text-2xl font-bold">{ttResult.finalEstimate.toFixed(3)}</div>
                                            </div>
                                            <div className="bg-yellow-50 p-4 rounded">
                                                <div className="text-sm text-gray-600">Final SE</div>
                                                <div className="text-2xl font-bold">{ttResult.finalSE.toFixed(3)}</div>
                                            </div>
                                            <div className="bg-purple-50 p-4 rounded">
                                                <div className="text-sm text-gray-600">Items Used</div>
                                                <div className="text-2xl font-bold">{ttResult.itemsAdministered}</div>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold mb-2">Ability Estimation Progress</h3>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <LineChart data={ttResult.progression}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="step" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    <ReferenceLine y={ttResult.trueAbility} stroke="red" strokeDasharray="3 3" label="True" />
                                                    <Line type="monotone" dataKey="abilityEstimate" stroke="#2563eb" strokeWidth={2} name="Estimate" />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>

                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold mb-2">Standard Error Progress</h3>
                                            <ResponsiveContainer width="100%" height={250}>
                                                <LineChart data={ttResult.progression}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="step" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    {stoppingRule === 'sem' && (
                                                        <ReferenceLine y={targetSEM} stroke="green" strokeDasharray="3 3" label="Target" />
                                                    )}
                                                    <Line type="monotone" dataKey="standardError" stroke="#dc2626" strokeWidth={2} name="SE" />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Item-by-Item Details</h3>
                                            <div className="overflow-x-auto">
                                                <table className="w-full border-collapse border text-sm">
                                                    <thead className="bg-gray-100">
                                                        <tr>
                                                            <th className="border p-2">Step</th>
                                                            <th className="border p-2">Item</th>
                                                            <th className="border p-2">Difficulty</th>
                                                            <th className="border p-2">Response</th>
                                                            <th className="border p-2">Estimate</th>
                                                            <th className="border p-2">SE</th>
                                                            <th className="border p-2">Fisher Info</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {ttResult.progression.slice(1).map((step, idx) => (
                                                            <tr key={idx}>
                                                                <td className="border p-2 text-center">{step.step}</td>
                                                                <td className="border p-2 text-center">{step.itemId}</td>
                                                                <td className="border p-2 text-center">{step.difficulty.toFixed(2)}</td>
                                                                <td className="border p-2 text-center">
                                                                    {step.response === 1 ? '✓' : '✗'}
                                                                </td>
                                                                <td className="border p-2 text-center">{step.abilityEstimate.toFixed(3)}</td>
                                                                <td className="border p-2 text-center">{step.standardError.toFixed(3)}</td>
                                                                <td className="border p-2 text-center">{step.fisherInfo.toFixed(3)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                )}

                {activeTab === 'aggregate' && results && aggregateStats && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold">Aggregate Performance Analysis</h2>
                                <button
                                    onClick={exportResults}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Export CSV
                                </button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-blue-50 p-4 rounded">
                                    <div className="text-sm text-gray-600">Correlation</div>
                                    <div className="text-2xl font-bold">{aggregateStats.correlation.toFixed(3)}</div>
                                </div>
                                <div className="bg-green-50 p-4 rounded">
                                    <div className="text-sm text-gray-600">RMSE</div>
                                    <div className="text-2xl font-bold">{aggregateStats.rmse.toFixed(3)}</div>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded">
                                    <div className="text-sm text-gray-600">Bias</div>
                                    <div className="text-2xl font-bold">{aggregateStats.bias.toFixed(3)}</div>
                                </div>
                                <div className="bg-purple-50 p-4 rounded">
                                    <div className="text-sm text-gray-600">Mean Abs Error</div>
                                    <div className="text-2xl font-bold">{aggregateStats.mae.toFixed(3)}</div>
                                </div>
                                <div className="bg-pink-50 p-4 rounded">
                                    <div className="text-sm text-gray-600">Avg Items</div>
                                    <div className="text-2xl font-bold">{aggregateStats.avgItems.toFixed(1)}</div>
                                </div>
                                <div className="bg-indigo-50 p-4 rounded">
                                    <div className="text-sm text-gray-600">Avg SE</div>
                                    <div className="text-2xl font-bold">{aggregateStats.avgSE.toFixed(3)}</div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">True vs. Estimated Abilities</h3>
                                <ResponsiveContainer width="100%" height={400}>
                                    <ScatterChart>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="trueAbility" name="True Ability" />
                                        <YAxis dataKey="finalEstimate" name="Estimated Ability" />
                                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                        <Legend />
                                        <ReferenceLine stroke="red" strokeDasharray="3 3" segment={[{ x: -4, y: -4 }, { x: 4, y: 4 }]} />
                                        <Scatter name="Test Takers" data={results} fill="#2563eb" />
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">Error Distribution</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={aggregateStats.errors.map((e, i) => ({ id: i + 1, error: e }))}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="id" label={{ value: 'Test Taker', position: 'insideBottom', offset: -5 }} />
                                        <YAxis label={{ value: 'Error (Est - True)', angle: -90, position: 'insideLeft' }} />
                                        <Tooltip />
                                        <ReferenceLine y={0} stroke="black" />
                                        <Bar dataKey="error" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="bg-blue-50 p-4 rounded">
                                <h3 className="text-lg font-semibold mb-2">Interpretation Guide</h3>
                                <ul className="text-sm space-y-1">
                                    <li><strong>Correlation:</strong> How well estimated abilities match true abilities (1.0 = perfect)</li>
                                    <li><strong>RMSE:</strong> Root Mean Square Error - overall magnitude of errors</li>
                                    <li><strong>Bias:</strong> Systematic over/underestimation (0 = unbiased)</li>
                                    <li><strong>MAE:</strong> Mean Absolute Error - average error magnitude</li>
                                    <li><strong>Red diagonal line:</strong> Perfect estimation (estimate = true ability)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CATSimulator;

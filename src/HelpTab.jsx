import React, { useState } from 'react';

const HelpTab = () => {
    const [activeSection, setActiveSection] = useState('glossary');

    const glossary = [
        {
            term: "SEM (Standard Error of Measurement)",
            definition: "A measure of the precision of ability estimates. Lower SEM indicates more precise measurement. CAT typically targets SEM values between 0.2-0.4."
        },
        {
            term: "Fisher Information",
            definition: "A measure of how much information an item provides about a test taker's ability at a given ability level. Items with higher Fisher Information are more informative and preferred for selection."
        },
        {
            term: "MLE (Maximum Likelihood Estimation)",
            definition: "A statistical method for estimating ability based on response patterns. Standard approach but may struggle with extreme scores (all correct or all incorrect responses)."
        },
        {
            term: "WLE (Warm's Weighted Likelihood Estimation)",
            definition: "An improved version of MLE that reduces bias, especially for extreme scores. Recommended when test takers might have very high or very low abilities."
        },
        {
            term: "Item Response Theory (IRT)",
            definition: "A psychometric framework that models the relationship between test taker ability, item difficulty, and the probability of correct response."
        },
        {
            term: "Adaptive Testing",
            definition: "A testing method where the difficulty of items is adjusted based on the test taker's performance, providing more efficient and precise ability measurement."
        }
    ];

    const faq = [
        {
            question: "Why does SEM decrease during the test?",
            answer: "As more items are administered, the test has more information about the test taker's ability, leading to more precise estimates and lower standard error."
        },
        {
            question: "What's the difference between fixed-length and variable-length tests?",
            answer: "Fixed-length tests administer a predetermined number of items. Variable-length tests continue until a target precision (SEM) is reached, potentially saving time for some test takers."
        },
        {
            question: "How does the simulator select the next item?",
            answer: "The simulator uses Fisher Information to select the item that provides the most information about the test taker's current ability estimate."
        },
        {
            question: "What do the correlation and RMSE values mean?",
            answer: "Correlation measures how well estimated abilities match true abilities (1.0 = perfect). RMSE (Root Mean Square Error) measures the overall magnitude of estimation errors."
        }
    ];

    const presets = [
        {
            name: "Grammar Test",
            description: "Focus on grammatical structures",
            testTakers: "-1.5, -0.5, 0.5, 1.5",
            items: "-2.0, -1.0, 0.0, 1.0, 2.0"
        },
        {
            name: "Vocabulary Test",
            description: "Word knowledge assessment",
            testTakers: "-2.0, -1.0, 0.0, 1.0, 2.0",
            items: "-2.5, -1.5, -0.5, 0.5, 1.5, 2.5"
        },
        {
            name: "Mixed Topics",
            description: "Combined grammar, vocabulary, and reading",
            testTakers: "-1.0, 0.0, 1.0",
            items: "-2.0, -1.0, 0.0, 1.0, 2.0, 3.0"
        }
    ];

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Help & Tutorial</h2>
            
            <div className="flex border-b mb-6">
                <button
                    onClick={() => setActiveSection('glossary')}
                    className={`px-4 py-2 font-medium ${activeSection === 'glossary' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                >
                    Glossary
                </button>
                <button
                    onClick={() => setActiveSection('faq')}
                    className={`px-4 py-2 font-medium ${activeSection === 'faq' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                >
                    FAQ
                </button>
                <button
                    onClick={() => setActiveSection('presets')}
                    className={`px-4 py-2 font-medium ${activeSection === 'presets' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                >
                    Preset Scenarios
                </button>
            </div>

            {activeSection === 'glossary' && (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold mb-4">Key Terms</h3>
                    {glossary.map((item, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4">
                            <h4 className="font-semibold text-blue-900">{item.term}</h4>
                            <p className="text-gray-700 mt-1">{item.definition}</p>
                        </div>
                    ))}
                </div>
            )}

            {activeSection === 'faq' && (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
                    {faq.map((item, index) => (
                        <div key={index} className="border rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">{item.question}</h4>
                            <p className="text-gray-700">{item.answer}</p>
                        </div>
                    ))}
                </div>
            )}

            {activeSection === 'presets' && (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold mb-4">Preset Scenarios</h3>
                    <p className="text-gray-600 mb-4">Copy these values into the configuration tabs to get started quickly:</p>
                    {presets.map((preset, index) => (
                        <div key={index} className="border rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">{preset.name}</h4>
                            <p className="text-gray-700 mb-3">{preset.description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <strong>Test Takers:</strong>
                                    <div className="bg-gray-100 p-2 rounded font-mono">{preset.testTakers}</div>
                                </div>
                                <div>
                                    <strong>Item Bank:</strong>
                                    <div className="bg-gray-100 p-2 rounded font-mono">{preset.items}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HelpTab;

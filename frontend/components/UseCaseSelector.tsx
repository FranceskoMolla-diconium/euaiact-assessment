
import React, { useState } from 'react';
import type { UseCase } from '../types';
import { optimizeUseCaseDescription } from '../services/openaiService';
import { PencilSquareIcon, SparklesIcon, ArrowPathIcon } from './Icons';

interface UseCaseSelectorProps {
  useCases: UseCase[];
  onSelect: (useCase: UseCase) => void;
}

const CustomUseCaseInput: React.FC<{ onSelect: (useCase: UseCase) => void; }> = ({ onSelect }) => {
    const [currentText, setCurrentText] = useState('');
    const [originalText, setOriginalText] = useState('');
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [isOptimized, setIsOptimized] = useState(false);
    
    const handleOptimize = async () => {
        if (!currentText.trim()) return;
        setIsOptimizing(true);
        setOriginalText(currentText);
        try {
            const optimized = await optimizeUseCaseDescription(currentText);
            setCurrentText(optimized);
            setIsOptimized(true);
        } catch (error) {
            console.error("Failed to optimize:", error);
            // Optionally, show an error to the user
        } finally {
            setIsOptimizing(false);
        }
    };

    const handleRevert = () => {
        setCurrentText(originalText);
        setIsOptimized(false);
    };

    const handleAnalyze = () => {
        if (!currentText.trim()) return;
        const customUseCase: UseCase = {
            id: Date.now(),
            title: "Custom Use Case",
            description: currentText,
            category: 'User-Defined',
            icon: PencilSquareIcon,
        };
        onSelect(customUseCase);
    };

    return (
        <div className="mt-8 bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h3 className="text-lg font-bold text-white">Or Describe Your Own Use Case</h3>
            <p className="text-sm text-slate-400 mt-1 mb-4">Provide a detailed description of the AI system you want to analyze.</p>
            <textarea
                value={currentText}
                onChange={(e) => setCurrentText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 h-36 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                placeholder="e.g., An AI system that scans social media to identify potential brand ambassadors based on their follower engagement and content style..."
            />
            {isOptimized && (
                <div className="text-xs text-cyan-300 bg-cyan-900/50 p-2 rounded-md my-2 flex justify-between items-center">
                    <span>Description optimized by AI.</span>
                    <button onClick={handleRevert} className="flex items-center space-x-1 font-semibold hover:underline">
                        <ArrowPathIcon className="h-4 w-4" />
                        <span>Revert</span>
                    </button>
                </div>
            )}
            <div className="flex items-center justify-end space-x-3 mt-4">
                <button
                    onClick={handleOptimize}
                    disabled={isOptimizing || !currentText.trim()}
                    className="flex items-center justify-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <SparklesIcon className="h-5 w-5 text-yellow-300"/>
                    <span>{isOptimizing ? 'Optimizing...' : 'Optimize with AI'}</span>
                </button>
                 <button
                    onClick={handleAnalyze}
                    disabled={!currentText.trim()}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200 disabled:bg-slate-700 disabled:cursor-not-allowed"
                >
                    Analyze
                </button>
            </div>
        </div>
    );
};


const UseCaseSelector: React.FC<UseCaseSelectorProps> = ({ useCases, onSelect }) => {
  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700">
      <h2 className="text-xl font-bold mb-2 text-white">Select a Pre-defined Use Case</h2>
      <p className="text-slate-400 mb-6">Choose one of the following examples to see how the EU AI Act classifier works.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {useCases.map((useCase) => (
          <button
            key={useCase.id}
            onClick={() => onSelect(useCase)}
            className="group text-left p-5 bg-slate-800 rounded-xl border border-slate-700 hover:border-cyan-500 hover:bg-slate-700/50 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 bg-slate-700 group-hover:bg-cyan-500 rounded-lg p-3 transition-colors duration-300">
                <useCase.icon className="h-6 w-6 text-slate-300 group-hover:text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{useCase.title}</h3>
                <p className="text-sm text-slate-400">{useCase.category}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
              {useCase.description}
            </p>
          </button>
        ))}
      </div>
      <CustomUseCaseInput onSelect={onSelect} />
    </div>
  );
};

export default UseCaseSelector;
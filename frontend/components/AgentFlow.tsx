
import React, { useState, useEffect } from 'react';
import type { UseCase, AnalysisStep, StepResult } from '../types';
import { analysisSteps } from '../constants';
import { analyzeUseCase } from '../services/openaiService';
import { CheckCircleIcon, XCircleIcon, ChevronDownIcon } from './Icons';
import HighlightCitations from './HighlightCitations';

interface AgentFlowProps {
  useCase: UseCase;
  currentStep: number;
  onStepComplete: (stepId: number, decision: boolean, aiReason: string, rationale?: string) => void;
  isCompleted: boolean;
  results: StepResult[];
}

const getPositiveButtonClass = (step: number) => {
    switch (step) {
        case 1: return 'bg-red-600 hover:bg-red-500'; // Unacceptable
        case 2: return 'bg-amber-600 hover:bg-amber-500'; // High-Risk
        case 3: return 'bg-sky-600 hover:bg-sky-500'; // Limited Risk
        default: return 'bg-cyan-600 hover:bg-cyan-500';
    }
}

const ActiveStep: React.FC<{ useCase: UseCase; step: AnalysisStep; onStepComplete: AgentFlowProps['onStepComplete'] }> = ({ useCase, step, onStepComplete }) => {
  const [subStep, setSubStep] = useState<'analyzing' | 'pending_decision'>('analyzing');
  const [analysisResult, setAnalysisResult] = useState<{ isPositive: boolean, reason: string } | null>(null);
  const [showRationaleModal, setShowRationaleModal] = useState(false);
  const [rationale, setRationale] = useState('');
  const [decisionToConfirm, setDecisionToConfirm] = useState<boolean | null>(null);

  useEffect(() => {
    const handleStartAnalysis = async () => {
      setSubStep('analyzing');
      const prompt = step.prompt(useCase.description);
      const result = await analyzeUseCase(prompt, step.responseSchema);
      
      let isPositive = false;
      if (step.id === 1) isPositive = result.is_prohibited ?? false;
      if (step.id === 2) isPositive = result.is_high_risk ?? false;
      if (step.id === 3) isPositive = result.is_limited_risk ?? false;

      setAnalysisResult({ isPositive, reason: result.reason });
      setSubStep('pending_decision');
    };
    
    handleStartAnalysis();
  }, [step, useCase]);

  const handleDecision = (isPositive: boolean) => {
    if(!analysisResult) return;
    const isDisagreement = isPositive !== analysisResult.isPositive;
    if (isDisagreement) {
      setDecisionToConfirm(isPositive);
      setShowRationaleModal(true);
    } else {
      onStepComplete(step.id, isPositive, analysisResult.reason);
    }
  };
  
  const submitRationale = () => {
    if (decisionToConfirm === null || !analysisResult) return;
    onStepComplete(step.id, decisionToConfirm, analysisResult.reason, rationale);
    setShowRationaleModal(false);
    setRationale('');
  };

  return (
    <>
      <div className="bg-slate-800 p-4 rounded-lg border border-cyan-500/50 shadow-lg">
        <h3 className="text-lg font-semibold text-white">{step.question}</h3>
        <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-700 min-h-[150px] mt-3">
          {subStep === 'analyzing' && (
            <div className="flex items-center justify-center h-full text-slate-400">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>AI Agent is analyzing...</span>
            </div>
          )}
          {subStep === 'pending_decision' && analysisResult && (
            <div>
              <div className={`flex items-start space-x-3 p-3 rounded-md ${analysisResult.isPositive ? 'bg-amber-900/40' : 'bg-green-900/40'}`}>
                {analysisResult.isPositive ? <XCircleIcon className="h-6 w-6 flex-shrink-0 mt-0.5 text-amber-400"/> : <CheckCircleIcon className="h-6 w-6 flex-shrink-0 mt-0.5 text-green-400"/>}
                <div>
                    <span className={`block text-sm font-bold ${analysisResult.isPositive ? 'text-amber-300' : 'text-green-300'}`}>AI Suggestion: {analysisResult.isPositive ? step.aiPositiveLabel : step.aiNegativeLabel}</span>
                    <div className="mt-2">
                        <HighlightCitations text={analysisResult.reason} />
                    </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {subStep === 'pending_decision' && analysisResult && (
          <div className="pt-4 mt-3 border-t border-slate-700">
            <p className="text-sm text-slate-400 mb-3 text-center">Human-in-the-loop: Please verify the AI's assessment.</p>
            <div className="flex justify-center space-x-4">
              <button onClick={() => handleDecision(true)} className={`w-full flex-1 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ${getPositiveButtonClass(step.id)}`}>
                {step.humanPositiveAction}
              </button>
              <button onClick={() => handleDecision(false)} className="w-full flex-1 bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                {step.humanNegativeAction}
              </button>
            </div>
          </div>
        )}
      </div>

      {showRationaleModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-2xl w-full max-w-lg">
            <h3 className="text-lg font-bold text-white">Provide Rationale</h3>
            <p className="text-slate-400 mt-2">You have disagreed with the AI's suggestion. Please provide a brief rationale for your decision.</p>
            <textarea
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 mt-4 h-32 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="e.g., The AI missed the nuance of this use case..."
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button onClick={() => setShowRationaleModal(false)} className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-lg">Cancel</button>
              <button onClick={submitRationale} disabled={!rationale.trim()} className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-4 rounded-lg disabled:bg-slate-700 disabled:cursor-not-allowed">Submit Rationale</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const CompletedStep: React.FC<{ result: StepResult }> = ({ result }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    return (
        <div className="bg-slate-800/70 rounded-lg border border-slate-700 overflow-hidden">
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full text-left p-4 hover:bg-slate-700/50 focus:outline-none"
            >
                <div className="flex justify-between items-center">
                    <h3 className="text-md font-semibold text-slate-300">{result.stepName}</h3>
                    <div className="flex items-center space-x-4">
                        <div className={`flex items-center space-x-2 text-sm font-bold ${result.isPositive ? 'text-red-400' : 'text-green-400'}`}>
                            {result.isPositive ? <XCircleIcon className="h-5 w-5" /> : <CheckCircleIcon className="h-5 w-5" />}
                            <span>{result.humanDecision}</span>
                        </div>
                        <ChevronDownIcon className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                </div>
            </button>
            {isExpanded && (
                <div className="p-4 border-t border-slate-700 space-y-4">
                    <div className="bg-slate-900/50 p-3 rounded-md border border-slate-700/50">
                        <h4 className="text-sm font-semibold text-slate-400 mb-2">AI Analysis Rationale</h4>
                        <HighlightCitations text={result.aiAnalysis} />
                    </div>
                    {result.humanRationale && (
                         <div className="bg-cyan-900/30 p-3 rounded-md border border-cyan-700/50">
                            <h4 className="text-sm font-semibold text-cyan-300 mb-2">Your Rationale for Disagreement</h4>
                            <p className="text-sm text-cyan-200 italic">"{result.humanRationale}"</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const AgentFlow: React.FC<AgentFlowProps> = ({ useCase, currentStep, onStepComplete, isCompleted, results }) => {
  return (
    <div className='min-h-[calc(100vh-220px)] flex flex-col'>
      <div className="mb-6">
        <span className="text-sm font-semibold text-cyan-400">USE CASE</span>
        <h2 className="text-2xl font-bold text-white">{useCase.title}</h2>
        <p className="text-slate-400 mt-1">{useCase.description}</p>
      </div>
      
      <div className="space-y-4 flex-grow">
        {results.map((result) => (
            <CompletedStep key={result.stepName} result={result} />
        ))}

        {!isCompleted && currentStep > 0 && analysisSteps[currentStep - 1] && (
          <ActiveStep 
            key={analysisSteps[currentStep - 1].id} 
            useCase={useCase} 
            step={analysisSteps[currentStep - 1]} 
            onStepComplete={onStepComplete} 
          />
        )}
        
        {isCompleted && (
            <div className="text-center p-8 bg-slate-800 rounded-lg border border-green-500/50">
                <h2 className="text-2xl font-bold text-white mb-2">Analysis Complete</h2>
                <p className="text-slate-300">The risk assessment is finished. See the Final Report for a complete breakdown.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AgentFlow;


import React from 'react';
import type { AnalysisStep, StepResult } from '../types';
import { CheckCircleIcon, XCircleIcon } from './Icons';

interface FlowDiagramProps {
  steps: AnalysisStep[];
  currentStep: number;
  isCompleted: boolean;
  results: StepResult[];
}

const FlowDiagram: React.FC<FlowDiagramProps> = ({ steps, currentStep, isCompleted, results }) => {
  const allSteps = [...steps, { id: steps.length + 1, name: 'Final Classification', description: 'The final risk level is determined based on the previous steps.' }];
  
  const wasStepPerformed = (stepId: number) => results.some(r => r.stepName === steps[stepId - 1]?.name);

  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700">
      <h3 className="text-lg font-bold text-white mb-4">Analysis Workflow</h3>
      <div className="space-y-4">
        {allSteps.map((step, index) => {
          const stepNumber = index + 1;
          
          if (stepNumber > steps.length) { // Final Classification step
            const isStepActive = isCompleted;
            return (
              <div
                key={step.id}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${isStepActive ? 'bg-slate-700/80 border-cyan-500' : 'bg-slate-800 border-slate-700'}`}
              >
                 <div className="flex items-center space-x-3">
                    <div className={`flex items-center justify-center h-7 w-7 rounded-full text-sm font-bold text-white flex-shrink-0 ${isStepActive ? 'bg-cyan-500' : 'bg-slate-600'}`}>
                        {isStepActive ? <CheckCircleIcon className="w-4 h-4" /> : stepNumber}
                    </div>
                    <h4 className={`font-semibold ${isStepActive ? 'text-white' : 'text-slate-300'}`}>{step.name}</h4>
                  </div>
                <p className="mt-2 text-xs text-slate-400 pl-10">{step.description}</p>
              </div>
            );
          }

          const isStepActive = !isCompleted && currentStep === stepNumber;
          const isStepCompleted = isCompleted && wasStepPerformed(stepNumber);
          const isStepSkipped = isCompleted && !wasStepPerformed(stepNumber);
          
          let statusStyles = 'bg-slate-800 border-slate-700';
          let icon = <>{stepNumber}</>;
          let iconBg = 'bg-slate-600';

          if (isStepActive) {
            statusStyles = 'bg-slate-700/80 border-cyan-500';
            iconBg = 'bg-cyan-500';
          } else if (isStepCompleted) {
            statusStyles = 'bg-slate-800 border-green-500/50 opacity-90';
            iconBg = 'bg-green-500';
            icon = <CheckCircleIcon className="w-4 h-4" />;
          } else if (isStepSkipped) {
            statusStyles = 'bg-slate-800/60 border-slate-700/60 opacity-50';
            iconBg = 'bg-slate-500';
            icon = <span className="font-bold">-</span>;
          }

          return (
            <div key={step.id} className={`p-4 rounded-lg border-2 transition-all duration-300 ${statusStyles}`}>
              <div className="flex items-center space-x-3">
                <div className={`flex items-center justify-center h-7 w-7 rounded-full text-sm font-bold text-white flex-shrink-0 ${iconBg}`}>
                  {icon}
                </div>
                <h4 className={`font-semibold ${isStepActive ? 'text-white' : 'text-slate-300'}`}>
                  {step.name}
                </h4>
              </div>
              <p className="mt-2 text-xs text-slate-400 pl-10">{step.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FlowDiagram;

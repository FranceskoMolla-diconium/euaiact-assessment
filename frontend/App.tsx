import React, { useState, useCallback, useEffect } from 'react';
import UseCaseSelector from './components/UseCaseSelector';
import AgentFlow from './components/AgentFlow';
import FlowDiagram from './components/FlowDiagram';
import FinalReport from './components/FinalReport';
import { useCases, analysisSteps } from './constants';
import type { UseCase, StepResult, RiskLevel } from './types';
import { RiskLevelEnum } from './types';
import { ShieldCheckIcon, ArrowPathIcon } from './components/Icons';
import { generateFinalSummary, generateMitigationSuggestions } from './services/openaiService';


export default function App() {
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [results, setResults] = useState<StepResult[]>([]);
  const [finalRisk, setFinalRisk] = useState<RiskLevel | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [finalSummary, setFinalSummary] = useState<string>('');
  const [mitigationSteps, setMitigationSteps] = useState<string>('');
  const [isLoadingReport, setIsLoadingReport] = useState<boolean>(false);

  const handleSelectUseCase = (useCase: UseCase) => {
    setSelectedUseCase(useCase);
    setCurrentStep(1);
    setResults([]);
    setFinalRisk(null);
    setIsCompleted(false);
    setFinalSummary('');
    setMitigationSteps('');
  };

  const resetState = () => {
    setSelectedUseCase(null);
    setCurrentStep(0);
    setResults([]);
    setFinalRisk(null);
    setIsCompleted(false);
    setFinalSummary('');
    setMitigationSteps('');
  };

  const handleStepComplete = useCallback((stepId: number, decision: boolean, aiReason: string, rationale?: string) => {
    const step = analysisSteps[stepId - 1];
    const humanDecision = decision ? step.humanPositiveAction : step.humanNegativeAction;

    const newResult: StepResult = {
      stepName: step.name,
      aiAnalysis: aiReason,
      isPositive: decision,
      humanDecision: humanDecision,
      humanRationale: rationale,
    };
    setResults(prev => [...prev, newResult]);
    
    // Early exit logic: if a risk is confirmed, complete the analysis.
    if (decision && (step.positiveRisk === RiskLevelEnum.UNACCEPTABLE || step.positiveRisk === RiskLevelEnum.HIGH)) {
       setIsCompleted(true);
    } else if (stepId >= analysisSteps.length) {
       setIsCompleted(true);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  }, []);

  useEffect(() => {
    if (isCompleted && selectedUseCase) {
      console.log("🎯 Analysis completed, generating final report...");
      
      // Determine final risk based on hierarchy
      const hasUnacceptable = results.find(r => r.stepName === 'Unacceptable Risk Check' && r.isPositive);
      const hasHigh = results.find(r => r.stepName === 'High-Risk Check' && r.isPositive);
      const hasLimited = results.find(r => r.stepName === 'Limited Risk Check' && r.isPositive);

      let risk: RiskLevel = RiskLevelEnum.MINIMAL;
      if (hasUnacceptable) risk = RiskLevelEnum.UNACCEPTABLE;
      else if (hasHigh) risk = RiskLevelEnum.HIGH;
      else if (hasLimited) risk = RiskLevelEnum.LIMITED;
      
      console.log(`📊 Final risk level determined: ${risk}`);
      setFinalRisk(risk);

      const generateReport = async () => {
        try {
          console.log("⏳ Setting loading state to true");
          setIsLoadingReport(true);
          
          console.log("📝 Generating summary...");
          const summary = await generateFinalSummary(results, selectedUseCase);
          console.log("✅ Summary generated");
          setFinalSummary(summary);
          
          if (risk !== RiskLevelEnum.MINIMAL) {
              console.log("🛡️ Generating mitigation suggestions...");
              const mitigations = await generateMitigationSuggestions(risk, results, selectedUseCase);
              console.log("✅ Mitigation suggestions generated");
              setMitigationSteps(mitigations);
          } else {
              console.log("ℹ️ No mitigation needed for minimal risk");
              setMitigationSteps('');
          }
          
          console.log("✓ Report generation complete, setting loading to false");
          setIsLoadingReport(false);
        } catch (error) {
          console.error("❌ Error generating report:", error);
          setIsLoadingReport(false);
        }
      };
      
      generateReport();
    }
  }, [isCompleted, results, selectedUseCase]);


  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <ShieldCheckIcon className="h-8 w-8 text-cyan-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">AI Use Case Classifier</h1>
            <span className="hidden sm:inline-block bg-cyan-900/50 text-cyan-300 text-xs font-medium px-2.5 py-1 rounded-full">EU AI Act</span>
          </div>
          {selectedUseCase && (
             <button
              onClick={resetState}
              className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              <ArrowPathIcon className="h-5 w-5" />
              <span>Start Over</span>
            </button>
          )}
        </header>

        {!selectedUseCase ? (
          <UseCaseSelector useCases={useCases} onSelect={handleSelectUseCase} />
        ) : (
          <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700">
              <AgentFlow
                useCase={selectedUseCase}
                currentStep={currentStep}
                onStepComplete={handleStepComplete}
                isCompleted={isCompleted}
                results={results}
              />
            </div>
            <aside className="lg:col-span-2 space-y-8">
              <FlowDiagram steps={analysisSteps} currentStep={currentStep} isCompleted={isCompleted} results={results} />
              {isCompleted && finalRisk && (
                  <FinalReport 
                    riskLevel={finalRisk} 
                    summary={finalSummary}
                    mitigation={mitigationSteps}
                    isLoading={isLoadingReport}
                    useCase={selectedUseCase}
                    results={results}
                  />
              )}
            </aside>
          </main>
        )}
      </div>
    </div>
  );
}

// Fix: Add import for ElementType to resolve React namespace error.
import type { ElementType } from 'react';

export enum RiskLevelEnum {
  UNACCEPTABLE = 'Unacceptable Risk',
  HIGH = 'High-Risk',
  LIMITED = 'Limited Risk',
  MINIMAL = 'Minimal/No Risk',
  PENDING = 'Pending Analysis'
}

export type RiskLevel = RiskLevelEnum;

export interface UseCase {
  id: number;
  title: string;
  description: string;
  category: string;
  // Fix: Use ElementType directly instead of React.ElementType
  icon: ElementType;
}

export interface AnalysisStep {
  id: number;
  name: string;
  question: string;
  description: string;
  prompt: (description: string) => string;
  // Fix: Add responseSchema for robust JSON handling with Gemini API
  responseSchema: object;
  aiPositiveLabel: string;
  aiNegativeLabel: string;
  humanPositiveAction: string;
  humanNegativeAction: string;
  positiveRisk: RiskLevel;
  negativeRisk: RiskLevel;
}

export interface StepResult {
    stepName: string;
    aiAnalysis: string;
    isPositive: boolean;
    humanDecision: string;
    humanRationale?: string;
}

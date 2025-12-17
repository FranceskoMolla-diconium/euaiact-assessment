
import type { UseCase, AnalysisStep } from './types';
import { RiskLevelEnum } from './types';
import { DocumentMagnifyingGlassIcon, UserGroupIcon, CurrencyDollarIcon, ChatBubbleBottomCenterTextIcon, SparklesIcon, ShieldExclamationIcon } from './components/Icons';

export const useCases: UseCase[] = [
  {
    id: 1,
    title: 'AI-Powered A&R Scouting',
    description: 'An AI system that analyzes streaming data, social media trends, and demo submissions to identify and rank promising new artists for potential record deals.',
    category: 'Talent Acquisition',
    icon: UserGroupIcon,
  },
  {
    id: 2,
    title: 'AI-Powered CV Screening',
    description: 'An AI tool that automatically filters and ranks job candidates\' resumes for corporate roles based on learned patterns from historical data, used for hiring decisions.',
    category: 'Human Resources',
    icon: DocumentMagnifyingGlassIcon,
  },
  {
    id: 3,
    title: 'Dynamic Royalty Auditing',
    description: 'An AI that continuously monitors and audits royalty payments across millions of streams and licenses to detect and flag potential discrepancies or fraud.',
    category: 'Finance & Royalties',
    icon: CurrencyDollarIcon,
  },
  {
    id: 4,
    title: 'Generative AI for Music Ideas',
    description: 'A tool for artists that generates novel melodies, chord progressions, or beats based on text prompts or musical inputs, intended for creative inspiration.',
    category: 'Creative Tools',
    icon: SparklesIcon,
  },
  {
    id: 5,
    title: 'Personalized Fan Engagement Chatbot',
    description: 'A chatbot using an artist\'s persona to interact with fans on their website, answer questions about tour dates, and promote merchandise. Users are notified they are talking to an AI.',
    category: 'Fan Engagement',
    icon: ChatBubbleBottomCenterTextIcon,
  },
  {
    id: 6,
    title: 'Copyright Infringement Detection',
    description: 'An AI that scans user-generated content platforms (e.g., YouTube) to identify unauthorized use of a music catalog and automates the initial takedown notice process.',
    category: 'Rights Management',
    icon: ShieldExclamationIcon,
  }
];

export const analysisSteps: AnalysisStep[] = [
  {
    id: 1,
    name: 'Unacceptable Risk Check',
    question: 'Does this use case fall into an "Unacceptable Risk" category?',
    description: 'Evaluates if the AI practice is explicitly banned under the EU AI Act, such as social scoring or manipulation.',
    prompt: (description: string) => `As an expert on the EU AI Act, analyze this AI use case: "${description}". Does it fall under a 'Prohibited AI Practice' leading to an 'Unacceptable Risk' as defined in the EU AI Act? Provide a detailed assessment and a concise explanation. In your reason, you MUST cite the specific clauses (e.g., Article 5). Respond in JSON format with: {"is_prohibited": boolean, "reason": string}`,
    responseSchema: {},
    aiPositiveLabel: "Potential Unacceptable Risk",
    aiNegativeLabel: "Not an Unacceptable Risk",
    humanPositiveAction: "Confirm as Unacceptable",
    humanNegativeAction: "Not Unacceptable, Continue",
    positiveRisk: RiskLevelEnum.UNACCEPTABLE,
    negativeRisk: RiskLevelEnum.PENDING,
  },
  {
    id: 2,
    name: 'High-Risk Check',
    question: 'Is this a "High-Risk" application as defined by the EU AI Act?',
    description: 'Determines if the AI is used in critical areas listed in the Act, like recruitment or medical devices.',
    prompt: (description: string) => `As an expert on the EU AI Act, analyze this AI use case: "${description}". Determine if it falls under any of the 'High-Risk' categories as listed in the EU AI Act (e.g., Annex III). Provide a detailed assessment and a concise explanation. In your reason, you MUST cite the specific category (e.g., Annex III, point 1(a)). Respond in JSON format with: {"is_high_risk": boolean, "reason": string}`,
    responseSchema: {},
    aiPositiveLabel: "Potential High-Risk Practice",
    aiNegativeLabel: "Not a High-Risk Practice",
    humanPositiveAction: "Confirm as High-Risk",
    humanNegativeAction: "Not High-Risk, Continue",
    positiveRisk: RiskLevelEnum.HIGH,
    negativeRisk: RiskLevelEnum.PENDING,
  },
  {
    id: 3,
    name: 'Limited Risk Check',
    question: 'Does this system require transparency obligations (Limited Risk)?',
    description: 'Checks for transparency obligations under the Act, such as for chatbots or deepfakes.',
    prompt: (description: string) => `As an expert on the EU AI Act, analyze this AI use case: "${description}". Determine if it requires transparency obligations, categorizing it as 'Limited Risk' (e.g., systems interacting with humans, deep fakes). Provide a detailed assessment and a concise explanation. In your reason, you MUST cite the relevant parts of the EU AI Act (e.g., Article 52). Respond in JSON format with: {"is_limited_risk": boolean, "reason": string}`,
    responseSchema: {},
    aiPositiveLabel: "Potential Limited Risk",
    aiNegativeLabel: "Not a Limited Risk Practice",
    humanPositiveAction: "Confirm as Limited Risk",
    humanNegativeAction: "Not Limited Risk, Continue",
    positiveRisk: RiskLevelEnum.LIMITED,
    negativeRisk: RiskLevelEnum.MINIMAL,
  },
];

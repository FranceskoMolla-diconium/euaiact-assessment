import React from 'react';
import type { RiskLevel } from '../types';
import { RiskLevelEnum } from '../types';

const riskConfig = {
  [RiskLevelEnum.MINIMAL]: { label: 'Minimal/No Risk', color: 'text-green-400', position: '12.5%' },
  [RiskLevelEnum.LIMITED]: { label: 'Limited Risk', color: 'text-sky-400', position: '37.5%' },
  [RiskLevelEnum.HIGH]: { label: 'High-Risk', color: 'text-amber-400', position: '62.5%' },
  [RiskLevelEnum.UNACCEPTABLE]: { label: 'Unacceptable Risk', color: 'text-red-400', position: '87.5%' },
  [RiskLevelEnum.PENDING]: { label: 'Pending', color: 'text-slate-400', position: '50%' },
};


const RiskBar: React.FC<{ riskLevel: RiskLevel }> = ({ riskLevel }) => {
    const { label, color, position } = riskConfig[riskLevel] || riskConfig[RiskLevelEnum.PENDING];
    
    return (
        <div className="space-y-3 pt-2">
            <div className="relative h-6 w-full rounded-full flex overflow-hidden border-2 border-slate-700/50">
                <div className="w-1/4 bg-green-500/50"></div>
                <div className="w-1/4 bg-sky-500/50"></div>
                <div className="w-1/4 bg-amber-500/50"></div>
                <div className="w-1/4 bg-red-500/50"></div>
            </div>

            <div className="relative h-8 w-full">
                <div 
                    className="absolute top-0 transition-all duration-1000 ease-out" 
                    style={{ left: position, transform: 'translateX(-50%)' }}
                >
                    <div className="flex flex-col items-center">
                        <span className={`text-xl font-extrabold ${color} whitespace-nowrap`}>{label}</span>
                        <svg width="24" height="16" viewBox="0 0 24 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={`${color}`}>
                            <path d="M12 16L0 0H24L12 16Z"/>
                        </svg>
                    </div>
                </div>
            </div>

            <div className="relative w-full h-4 flex text-xs font-semibold text-slate-400">
                <div className="w-1/4 text-center">Minimal</div>
                <div className="w-1/4 text-center">Limited</div>
                <div className="w-1/4 text-center">High</div>
                <div className="w-1/4 text-center">Unacceptable</div>
            </div>
        </div>
    );
};

export default RiskBar;
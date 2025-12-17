import React, { useState, useRef, useEffect } from 'react';
import { getActText } from '../eu-ai-act';
import { XIcon } from './Icons';

interface HighlightCitationsProps {
  text: string;
}

const HighlightCitations: React.FC<HighlightCitationsProps> = ({ text }) => {
  if (!text) return null;

  const [activeCitation, setActiveCitation] = useState<string | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      // Close if the click is outside the tooltip
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setActiveCitation(null);
      }
    };
    
    // Add event listener only when a tooltip is active
    if (activeCitation) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    
    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [activeCitation]);

  const renderTextWithCitations = () => {
    // Improved regex to handle various citation formats and surrounding punctuation
    const regex = /(Article\s*\d+\(?\d*\)?|Annex\s*(?:[IVX]+|\d+)(?:,\s*point\s*\d+\(?[a-z]?\)?)?)/gi;
    
    return text.split('\n\n').map((paragraph, pIndex) => (
      <p key={pIndex} className="mb-4 last:mb-0">
        {paragraph.split(regex).map((part, i) => {
          if (part.match(regex)) {
            const citationId = `${part}-${pIndex}-${i}`;
            const isActive = activeCitation === citationId;
            const actContent = getActText(part);
            
            return (
              <span key={i} className="relative inline-block" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setActiveCitation(isActive ? null : citationId)}
                  className="text-cyan-300 underline decoration-cyan-300/50 decoration-2 underline-offset-2 font-semibold cursor-pointer"
                >
                  {part}
                </button>
                {isActive && (
                  <div
                    ref={tooltipRef}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-96 max-w-lg max-h-80 overflow-y-auto bg-slate-950 text-slate-200 text-sm rounded-lg p-4 border border-slate-700 shadow-2xl z-20"
                  >
                    <button onClick={() => setActiveCitation(null)} className="absolute top-2 right-2 text-slate-400 hover:text-white transition-colors">
                        <XIcon className="h-5 w-5" />
                    </button>
                    <strong className="block font-bold mb-2 text-white not-prose text-base pr-6">{actContent.title}</strong>
                    <div className="whitespace-pre-wrap prose prose-invert prose-sm max-w-none">{actContent.text}</div>
                    <span className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-950"></span>
                  </div>
                )}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </p>
    ));
  };

  return (
    <div className="prose prose-invert prose-sm max-w-none text-slate-300">
      {renderTextWithCitations()}
    </div>
  );
};

export default HighlightCitations;
import React from 'react';
import type { RiskLevel, UseCase, StepResult } from '../types';
import { RiskLevelEnum } from '../types';
import RiskBar from './RiskBar';
import HighlightCitations from './HighlightCitations';
import { DocumentArrowDownIcon } from './Icons';

declare global {
  interface Window {
    jspdf: any;
  }
}

interface FinalReportProps {
  riskLevel: RiskLevel;
  summary: string;
  mitigation: string;
  isLoading: boolean;
  useCase: UseCase | null;
  results: StepResult[];
}

const riskLevelStyles: Record<RiskLevel, { bg: string; text: string; border: string; pdfColor: [number, number, number] }> = {
  [RiskLevelEnum.UNACCEPTABLE]: { bg: 'bg-red-900/50', text: 'text-red-300', border: 'border-red-700', pdfColor: [220, 38, 38] },
  [RiskLevelEnum.HIGH]: { bg: 'bg-amber-900/50', text: 'text-amber-300', border: 'border-amber-700', pdfColor: [217, 119, 6] },
  [RiskLevelEnum.LIMITED]: { bg: 'bg-sky-900/50', text: 'text-sky-300', border: 'border-sky-700', pdfColor: [2, 132, 199] },
  [RiskLevelEnum.MINIMAL]: { bg: 'bg-green-900/50', text: 'text-green-300', border: 'border-green-700', pdfColor: [34, 197, 94] },
  [RiskLevelEnum.PENDING]: { bg: 'bg-slate-700', text: 'text-slate-300', border: 'border-slate-600', pdfColor: [100, 116, 139] },
};

const FinalReport: React.FC<FinalReportProps> = ({ riskLevel, summary, mitigation, isLoading, useCase, results }) => {
  const styles = riskLevelStyles[riskLevel];

  const handleDownload = () => {
    if (!useCase) return;

    console.log("📄 Starting PDF generation...");
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt', 'a4');
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const leftMargin = 60;
    const rightMargin = 60;
    const topMargin = 80;
    const bottomMargin = 60;
    const contentWidth = pageWidth - leftMargin - rightMargin;
    let y = topMargin;

    const addHeader = (text: string = 'EU AI Act - Risk Analysis Report') => {
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text(text, leftMargin, 30);
    };

    const addFooter = () => {
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(9);
            doc.setTextColor(150);
            doc.text(`Page ${i} of ${pageCount}`, pageWidth - rightMargin, pageHeight - 30, { align: 'right' });
        }
    };

    const addTextBlock = (text: string, fontSize: number = 10, lineHeight: number = 14, addSpacingAfter: number = 15) => {
        doc.setFontSize(fontSize);
        
        // Clean and normalize text - remove HTML tags and normalize whitespace
        const cleanText = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        
        // Split text into paragraphs first
        const paragraphs = cleanText.split(/\n\n+/).filter(p => p.trim());
        
        paragraphs.forEach((paragraph, idx) => {
            // Split paragraph into lines that fit the content width
            const lines = doc.splitTextToSize(paragraph.trim(), contentWidth);
            
            // Check if we need a new page
            if (y + (lines.length * lineHeight) + addSpacingAfter > pageHeight - bottomMargin) {
                doc.addPage();
                addHeader();
                y = topMargin;
            }
            
            // Add each line
            lines.forEach((line: string) => {
                doc.text(line, leftMargin, y);
                y += lineHeight;
            });
            
            // Add spacing between paragraphs (except after last one)
            if (idx < paragraphs.length - 1) {
                y += addSpacingAfter;
            }
        });
        
        return y;
    };
    
    // --- Title Page ---
    addHeader();
    y = 140;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(31, 41, 55);
    doc.text('EU AI Act Compliance Report', pageWidth / 2, y, { align: 'center' });
    y += 60;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text('Analysis for Use Case:', pageWidth / 2, y, { align: 'center' });
    y += 25;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    const useCaseTitleLines = doc.splitTextToSize(useCase.title, contentWidth - 40);
    useCaseTitleLines.forEach((line: string) => {
        doc.text(line, pageWidth / 2, y, { align: 'center' });
        y += 22;
    });
    y += 10;
    
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const descriptionLines = doc.splitTextToSize(useCase.description, contentWidth - 100);
    descriptionLines.forEach((line: string) => {
        doc.text(line, pageWidth / 2, y, { align: 'center' });
        y += 15;
    });
    y += 30;

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, y, pageWidth - rightMargin, y);
    y += 40;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(80, 80, 80);
    doc.text('Final Risk Classification:', pageWidth / 2, y, { align: 'center' });
    y += 35;

    doc.setFontSize(28);
    doc.setTextColor(...styles.pdfColor);
    doc.text(riskLevel, pageWidth / 2, y, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Report generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 80, { align: 'center' });

    // --- Executive Summary Page ---
    doc.addPage();
    addHeader();
    y = topMargin;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text('Executive Summary', leftMargin, y);
    y += 5;
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, y, pageWidth - rightMargin, y);
    y += 25;
    
    if (summary) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        y = addTextBlock(summary, 10, 15, 12);
    }

    // --- Detailed Analysis Section ---
    y += 30;
    if (y + 60 > pageHeight - bottomMargin) { 
        doc.addPage(); 
        addHeader(); 
        y = topMargin; 
    }
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text('Detailed Step-by-Step Analysis', leftMargin, y);
    y += 5;
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, y, pageWidth - rightMargin, y);
    y += 25;
    
    results.forEach((result, index) => {
        // Check if we need a new page for this step
        const estimatedHeight = 100;
        if (y + estimatedHeight > pageHeight - bottomMargin) {
            doc.addPage();
            addHeader();
            y = topMargin;
        }
        
        // Step title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(result.stepName, leftMargin, y);
        y += 18;
        
        // AI Suggestion
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.text('AI Suggestion Rationale:', leftMargin, y);
        y += 12;
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        y = addTextBlock(result.aiAnalysis, 9, 13, 0);
        y += 15;
        
        // Human Decision
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text('Human Decision:', leftMargin, y);
        y += 12;
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        y = addTextBlock(result.humanDecision, 9, 13, 0);
        y += 15;
        
        // Human Rationale (if exists)
        if (result.humanRationale) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.text('Human Rationale for Disagreement:', leftMargin, y);
            y += 12;
            
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            y = addTextBlock(result.humanRationale, 9, 13, 0);
            y += 15;
        }
        
        // Add extra spacing between steps
        y += 20;
    });

    // --- Mitigation Suggestions - New Page ---
    if (mitigation) {
        doc.addPage(); 
        addHeader(); 
        y = topMargin;
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(0, 0, 0);
        doc.text('Mitigation Suggestions', leftMargin, y);
        y += 5;
        doc.setDrawColor(200);
        doc.setLineWidth(0.5);
        doc.line(leftMargin, y, pageWidth - rightMargin, y);
        y += 25;
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        addTextBlock(mitigation, 10, 15, 12);
    }
    
    addFooter();
    const fileName = `EU-AI-Act-Report_${useCase.title.replace(/\s/g, '_')}.pdf`;
    doc.save(fileName);
    console.log(`✅ PDF generated successfully: ${fileName}`);
  };


  if (isLoading) {
    return (
        <div className={`p-6 rounded-2xl shadow-lg border bg-slate-800 border-slate-700 flex flex-col items-center justify-center min-h-[400px]`}>
            <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h3 className="text-lg font-bold text-white mt-4">Generating Final Report...</h3>
            <p className="text-slate-400">The AI agent is compiling the final assessment.</p>
        </div>
    );
  }

  return (
    <div className={`p-6 rounded-2xl shadow-lg border ${styles.bg} ${styles.border}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">Final Report</h3>
        <button
          onClick={handleDownload}
          disabled={!useCase}
          className="flex items-center space-x-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 font-semibold py-2 px-3 rounded-lg transition-colors duration-200 border border-slate-600 disabled:opacity-50"
          title="Download Report as PDF"
        >
          <DocumentArrowDownIcon className="h-5 w-5" />
          <span>Download PDF</span>
        </button>
      </div>

      <div className="bg-slate-800 p-4 rounded-lg">
        <RiskBar riskLevel={riskLevel} />
        
        <div className="mt-6 space-y-6">
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
              <h4 className="font-semibold text-slate-200 mb-2">Overall Assessment</h4>
              <HighlightCitations text={summary} />
          </div>
          
          {mitigation && (
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                  <h4 className="font-semibold text-slate-200 mb-2">Mitigation Suggestions</h4>
                  <HighlightCitations text={mitigation} />
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinalReport;
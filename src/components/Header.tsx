import React from 'react';
import { Download, BookOpen } from 'lucide-react';

interface HeaderProps {
  activeTab: 'calculator' | 'results' | 'planner';
  setActiveTab: (tab: 'calculator' | 'results' | 'planner') => void;
  onOpenMethodology: () => void;
  onOpenExport: () => void;
  totalTonnes: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenMethodology,
  onOpenExport,
  totalTonnes,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-stone-200/80 px-4 sm:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-emerald-800 text-emerald-50 flex items-center justify-center font-bold text-sm shadow-xs">
            C
          </div>
          <span className="text-lg font-bold tracking-tight text-stone-900 whitespace-nowrap">
            CarbonTrack
          </span>
        </div>

        {/* Zone 2: 4 single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'calculator'
                ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800'
                : 'hover:text-stone-900'
            }`}
          >
            1. Lifestyle Assessment
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('results')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'results'
                ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800'
                : 'hover:text-stone-900'
            }`}
          >
            2. Results & Breakdown
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('planner')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'planner'
                ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800'
                : 'hover:text-stone-900'
            }`}
          >
            3. Reduction & Savings
          </button>
          <button
            type="button"
            onClick={onOpenMethodology}
            className="cursor-pointer whitespace-nowrap shrink-0 text-stone-500 hover:text-stone-900 transition-colors inline-flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Methodology & Factors</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-baseline gap-1.5 px-2.5 py-1 text-xs text-stone-600 font-mono-data">
            <span className="text-stone-400 font-sans text-xs">Footprint:</span>
            <span className="font-semibold text-stone-900 text-sm">
              {totalTonnes.toFixed(2)}
            </span>
            <span className="text-stone-500 text-[11px]">t CO₂e/yr</span>
          </div>

          <button
            type="button"
            onClick={onOpenExport}
            className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors whitespace-nowrap shrink-0 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>
    </header>
  );
};

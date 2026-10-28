import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LifestyleForm } from './components/LifestyleForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { ActionPlanner } from './components/ActionPlanner';
import { MethodologyModal } from './components/MethodologyModal';
import { ExportModal } from './components/ExportModal';
import { DEFAULT_INPUTS, LIFESTYLE_PRESETS } from './data/presets';
import { UserFootprintInputs } from './types/footprint';
import { calculateTotalFootprint } from './utils/calculator';
import { Sliders, BarChart3, Target } from 'lucide-react';

const STORAGE_KEY = 'carbontrack_user_inputs_v3';

export default function App() {
  const [inputs, setInputs] = useState<UserFootprintInputs>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_INPUTS, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return DEFAULT_INPUTS;
  });

  const [activeTab, setActiveTab] = useState<'calculator' | 'results' | 'planner'>('calculator');
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Persist user answers
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
    } catch {
      // ignore in private tabs
    }
  }, [inputs]);

  const handleInputChange = (updates: Partial<UserFootprintInputs>) => {
    setInputs((prev) => ({ ...prev, ...updates }));
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = LIFESTYLE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setInputs({ ...preset.inputs });
    }
  };

  const handleReset = () => {
    setInputs({
      twoWheelerType: 'none',
      twoWheelerKmPerWeek: 0,
      carType: 'none',
      carKmPerWeek: 0,
      metroBusKmPerWeek: 0,
      railwayKmPerYear: 0,
      flightHoursPerYear: 0,
      householdSize: 1,
      electricityKWhPerMonth: 0,
      rooftopSolarPercent: 0,
      cookingFuelType: 'none',
      lpgCylindersPerYear: 0,
      pngScmPerMonth: 0,
      dietType: 'pure_veg',
      wasteKgPerWeek: 0,
      segregateAndRecycle: true,
    });
  };

  // Live calculated results
  const results = calculateTotalFootprint(inputs);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-stone-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Bar adhering to 3-zone contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        totalTonnes={results.totalAnnualTonnesCO2e}
      />

      {/* Hero Header */}
      <div className="bg-white border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-800 tracking-wide uppercase">
                  Carbon Accounting & Cost Savings
                </span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="text-xs text-stone-500 font-mono-data">CEA v19 & ARAI Grounded</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-stone-900">
                Personal Carbon Footprint & Savings Planner
              </h1>
              <p className="text-sm text-stone-600 leading-relaxed">
                Calculate your annual greenhouse gas emissions across electricity, daily commute, cooking fuel, and diet. Grounded in Central Electricity Authority grid baselines and ARAI vehicular data with actionable Rupee (₹) savings.
              </p>
            </div>

            {/* Step Navigation Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl shrink-0 self-start lg:self-auto border border-stone-200/60">
              <button
                type="button"
                onClick={() => setActiveTab('calculator')}
                className={`cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all ${
                  activeTab === 'calculator'
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-800" />
                <span>1. Lifestyle Assessment</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('results')}
                className={`cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all ${
                  activeTab === 'results'
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-emerald-800" />
                <span>2. Results & Breakdown</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('planner')}
                className={`cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all ${
                  activeTab === 'planner'
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Target className="w-3.5 h-3.5 text-emerald-800" />
                <span>3. Reduction & Savings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-10">
        {activeTab === 'calculator' && (
          <LifestyleForm
            inputs={inputs}
            onInputChange={handleInputChange}
            onApplyPreset={handleApplyPreset}
            onReset={handleReset}
            onProceedToResults={() => setActiveTab('results')}
          />
        )}

        {activeTab === 'results' && (
          <ResultsDashboard
            results={results}
            onNavigateToPlanner={() => setActiveTab('planner')}
            onNavigateToInputs={() => setActiveTab('calculator')}
            onOpenMethodology={() => setIsMethodologyOpen(true)}
          />
        )}

        {activeTab === 'planner' && (
          <ActionPlanner
            inputs={inputs}
            results={results}
            onNavigateToInputs={() => setActiveTab('calculator')}
            onNavigateToResults={() => setActiveTab('results')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-stone-200/80 px-4 sm:px-8 py-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-stone-600">
            <span className="font-semibold text-stone-800">CarbonTrack</span>
            <span aria-hidden="true">·</span>
            <span>CEA Grid Baseline (0.716 kg/kWh)</span>
            <span aria-hidden="true">·</span>
            <span>ARAI & MoEFCC Standards</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsMethodologyOpen(true)}
              className="cursor-pointer text-stone-600 hover:text-stone-900 hover:underline"
            >
              Full Calculation Methodology & Factors
            </button>
            <button
              type="button"
              onClick={() => setIsExportOpen(true)}
              className="cursor-pointer text-stone-600 hover:text-stone-900 hover:underline"
            >
              Export Report (CSV / JSON)
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        inputs={inputs}
        results={results}
      />
    </div>
  );
}

import React, { useState } from 'react';
import {
  CheckCircle2,
  Target,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { CalculationResults, UserFootprintInputs } from '../types/footprint';
import { deriveReductionStrategies } from '../utils/calculator';

interface ActionPlannerProps {
  inputs: UserFootprintInputs;
  results: CalculationResults;
  onNavigateToInputs: () => void;
  onNavigateToResults: () => void;
}

export const ActionPlanner: React.FC<ActionPlannerProps> = ({
  inputs,
  results,
  onNavigateToInputs,
  onNavigateToResults,
}) => {
  const [selectedStrategyIds, setSelectedStrategyIds] = useState<string[]>([]);

  const eligibleStrategies = deriveReductionStrategies(inputs, results);

  const toggleStrategy = (id: string) => {
    setSelectedStrategyIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedStrategyIds(eligibleStrategies.map((s) => s.id));
  };

  const clearAll = () => {
    setSelectedStrategyIds([]);
  };

  // Calculations for simulated reduction
  const selectedStrategies = eligibleStrategies.filter((s) =>
    selectedStrategyIds.includes(s.id)
  );

  const totalSimulatedReductionKg = selectedStrategies.reduce(
    (sum, s) => sum + s.impactAnnualKgCO2e,
    0
  );

  const totalSimulatedSavingsINR = selectedStrategies.reduce(
    (sum, s) => sum + s.annualSavingsINR,
    0
  );

  const projectedAnnualKg = Math.max(0, results.totalAnnualKgCO2e - totalSimulatedReductionKg);
  const projectedTonnes = projectedAnnualKg / 1000;
  const reductionPercent = results.totalAnnualKgCO2e > 0
    ? Math.min(100, (totalSimulatedReductionKg / results.totalAnnualKgCO2e) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* Simulation Header Summary Card */}
      <div className="bg-white rounded-xl border border-stone-200/90 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-900">
                <Target className="w-4 h-4" />
              </div>
              <h2 className="text-base font-semibold text-stone-900">
                Climate Action & Cost Savings Simulator
              </h2>
            </div>
            <p className="text-xs text-stone-500">
              Select verified sustainable interventions to simulate your projected carbon trajectory and annual Rupee (₹) savings.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={selectAll}
              className="cursor-pointer px-3 py-1.5 text-xs font-medium text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="cursor-pointer px-3 py-1.5 text-xs font-medium text-stone-600 bg-white hover:bg-stone-50 rounded-lg transition-colors border border-stone-200"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Live Reduction & Rupee Trajectory */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 pt-6">
          <div>
            <span className="text-xs text-stone-500 block">Current Footprint</span>
            <div className="flex items-baseline gap-1 mt-1 font-mono-data">
              <span className="text-2xl font-bold text-stone-800">
                {results.totalAnnualTonnesCO2e.toFixed(2)}
              </span>
              <span className="text-xs text-stone-500 font-sans">tonnes/yr</span>
            </div>
            <span className="text-[11px] text-stone-400 font-mono-data">
              {Math.round(results.totalAnnualKgCO2e).toLocaleString()} kg CO₂e
            </span>
          </div>

          <div>
            <span className="text-xs text-emerald-800 font-medium block">
              Simulated CO₂ Reduction
            </span>
            <div className="flex items-baseline gap-1 mt-1 font-mono-data">
              <span className="text-2xl font-bold text-emerald-800">
                -{(totalSimulatedReductionKg / 1000).toFixed(2)}
              </span>
              <span className="text-xs text-emerald-800 font-sans">tonnes/yr</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">
              {reductionPercent.toFixed(1)}% footprint decrease
            </span>
          </div>

          <div>
            <span className="text-xs text-emerald-800 font-medium block">
              Simulated Annual Savings (₹)
            </span>
            <div className="flex items-baseline gap-1 mt-1 font-mono-data text-emerald-900">
              <span className="text-sm font-sans font-semibold">₹</span>
              <span className="text-2xl font-bold">
                {totalSimulatedSavingsINR.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-sans text-stone-500">/ yr</span>
            </div>
            <span className="text-[11px] text-stone-500">
              Fuel, utility bills & grocery savings
            </span>
          </div>

          <div>
            <span className="text-xs text-stone-500 block">Projected Footprint</span>
            <div className="flex items-baseline gap-1 mt-1 font-mono-data">
              <span className="text-2xl font-bold text-stone-900">
                {projectedTonnes.toFixed(2)}
              </span>
              <span className="text-xs text-stone-500 font-sans">tonnes/yr</span>
            </div>
            <span className="text-[11px] text-stone-500 font-mono-data">
              {projectedTonnes <= 2.0
                ? '✓ Aligned with Paris 2.0t target'
                : `${(projectedTonnes - 2.0).toFixed(1)}t above 2.0t target`}
            </span>
          </div>
        </div>

        {/* Dynamic Comparison Bar */}
        <div className="mt-6 pt-5 border-t border-stone-100">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-stone-600 font-medium">
              Simulation Progress ({selectedStrategyIds.length} of {eligibleStrategies.length} interventions selected)
            </span>
            <span className="font-mono-data font-semibold text-emerald-800">
              {Math.round(totalSimulatedReductionKg).toLocaleString()} kg CO₂e · ₹{totalSimulatedSavingsINR.toLocaleString('en-IN')}/yr saved
            </span>
          </div>
          <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-800 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, reductionPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Strategies List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-stone-900">
            High-Impact Interventions (Ranked by CO₂ Savings)
          </h3>
          <span className="text-xs text-stone-500">
            Tailored directly to your travel & utility inputs
          </span>
        </div>

        {eligibleStrategies.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200/90 p-8 text-center">
            <Sparkles className="w-8 h-8 text-emerald-800 mx-auto mb-2 opacity-60" />
            <h4 className="text-sm font-semibold text-stone-900">
              Exemplary Low Carbon Footprint
            </h4>
            <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
              Your logged lifestyle is already well below the urban average and aligned with 1.5°C climate goals.
            </p>
            <button
              type="button"
              onClick={onNavigateToInputs}
              className="mt-4 cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200"
            >
              Modify Activities
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eligibleStrategies.map((strat, index) => {
              const isSelected = selectedStrategyIds.includes(strat.id);
              return (
                <div
                  key={strat.id}
                  onClick={() => toggleStrategy(strat.id)}
                  className={`cursor-pointer rounded-xl border p-5 transition-all text-left flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-800 bg-emerald-50/40 shadow-xs'
                      : 'border-stone-200/90 bg-white hover:border-stone-300 hover:bg-stone-50/50'
                  }`}
                >
                  <div>
                    {/* Header: Title + Savings */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-stone-400 font-mono-data">
                          #{index + 1}
                        </span>
                        <h4 className="text-sm font-semibold text-stone-900">
                          {strat.title}
                        </h4>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-emerald-800 font-mono-data block">
                          -{(strat.impactAnnualKgCO2e / 1000).toFixed(2)} t CO₂e
                        </span>
                        <span className="text-[11px] text-emerald-900 font-mono-data font-semibold block">
                          Save ₹{strat.annualSavingsINR.toLocaleString('en-IN')}/yr
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed mb-3">
                      {strat.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px]">
                    <span className="text-stone-500 font-mono-data truncate max-w-[220px]">
                      {strat.applicabilityNote}
                    </span>
                    <div className="flex items-center gap-1.5 font-medium text-xs">
                      {isSelected ? (
                        <span className="text-emerald-900 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                          <span>Simulated</span>
                        </span>
                      ) : (
                        <span className="text-stone-400 hover:text-stone-700">
                          Click to Simulate
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="bg-white rounded-xl border border-stone-200/90 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={onNavigateToInputs}
          className="cursor-pointer text-xs font-medium text-stone-600 hover:text-stone-900 hover:underline"
        >
          ← Return to Lifestyle Inputs
        </button>
        <button
          type="button"
          onClick={onNavigateToResults}
          className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors shadow-xs"
        >
          <span>View Full Results & Benchmarks</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { CalculationResults } from '../types/footprint';

interface ResultsDashboardProps {
  results: CalculationResults;
  onNavigateToPlanner: () => void;
  onNavigateToInputs: () => void;
  onOpenMethodology: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  results,
  onNavigateToPlanner,
  onNavigateToInputs,
  onOpenMethodology,
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = (id: string) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  const {
    totalAnnualKgCO2e,
    totalMonthlyKgCO2e,
    totalAnnualTonnesCO2e,
    sortedCategories,
    benchmarks,
    confidenceScore,
    estimatedAnnualExpenditureINR,
  } = results;

  const primaryContributor = sortedCategories[0];
  const isBelowNationalAvg = totalAnnualKgCO2e <= benchmarks.indiaAverageKg;
  const isBelowUrbanAvg = totalAnnualKgCO2e <= benchmarks.indiaUrbanAverageKg;

  // Donut chart calculations
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;
  const donutSegments = sortedCategories.map((cat) => {
    const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((cumulativePercent / 100) * circumference);
    cumulativePercent += cat.percentage;
    return {
      id: cat.id,
      label: cat.label,
      color: cat.color,
      strokeDasharray,
      strokeDashoffset,
      percentage: cat.percentage,
    };
  });

  return (
    <div className="space-y-8">
      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Annual Footprint */}
        <div className="bg-white rounded-xl border border-stone-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-medium text-stone-500 mb-1">
              Estimated Annual Emissions
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-bold text-stone-900 font-mono-data tracking-tight">
                {totalAnnualTonnesCO2e.toFixed(2)}
              </span>
              <span className="text-sm font-semibold text-stone-600">
                tonnes CO₂e / yr
              </span>
            </div>
            <div className="text-xs text-stone-400 font-mono-data mt-1">
              {Math.round(totalAnnualKgCO2e).toLocaleString()} kg CO₂e / year
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Monthly footprint</span>
            <span className="font-mono-data font-semibold text-stone-800">
              {Math.round(totalMonthlyKgCO2e).toLocaleString()} kg / month
            </span>
          </div>
        </div>

        {/* Benchmarks & Position */}
        <div className="bg-white rounded-xl border border-stone-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-medium text-stone-500 mb-1">
              National & Urban Benchmarks
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-3xl sm:text-4xl font-bold font-mono-data tracking-tight ${
                  isBelowUrbanAvg ? 'text-emerald-800' : 'text-stone-800'
                }`}
              >
                {isBelowUrbanAvg ? 'Within' : 'Exceeds'}
              </span>
              <span className="text-xs font-medium text-stone-600">
                Urban Average (3.8 t)
              </span>
            </div>
            <div className="text-xs text-stone-500 mt-1">
              {isBelowNationalAvg
                ? `You are at or below the national per-capita baseline of 1.9 tonnes.`
                : `You emit ${(totalAnnualTonnesCO2e - 1.9).toFixed(1)}t more than the national per-capita baseline (1.9 t).`}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="text-stone-500">Paris 1.5°C Budget (2.0 t)</span>
            <span className="font-mono-data font-semibold text-stone-800">
              {totalAnnualTonnesCO2e <= 2.0
                ? 'Aligned with 1.5°C ✓'
                : `+${(totalAnnualTonnesCO2e - 2.0).toFixed(1)} t to target`}
            </span>
          </div>
        </div>

        {/* Annual Utility & Fuel Expenditure in INR (₹) */}
        <div className="bg-white rounded-xl border border-stone-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-medium text-stone-500 mb-1">
              Estimated Energy & Travel Spend
            </div>
            <div className="flex items-baseline gap-1.5 font-mono-data">
              <span className="text-xs text-stone-600 font-sans">₹</span>
              <span className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
                {Math.round(estimatedAnnualExpenditureINR).toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-medium text-stone-500 font-sans">/ year</span>
            </div>
            <div className="text-xs text-stone-500 mt-1">
              Combined electricity, fuel, LPG, and transit costs based on standard tariffs.
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Primary source</span>
            <span className="font-medium text-stone-800 truncate max-w-[140px]">
              {primaryContributor ? primaryContributor.label : 'None'}
            </span>
          </div>
        </div>
      </div>

      {/* Reference Spectrum */}
      <div className="bg-white rounded-xl border border-stone-200/90 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-stone-900">
            Per-Capita Reference Spectrum
          </h3>
          <span className="text-xs text-stone-500 font-mono-data">
            Your Footprint: {totalAnnualTonnesCO2e.toFixed(2)} t CO₂e
          </span>
        </div>

        <div className="relative pt-6 pb-4">
          <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden flex">
            <div className="h-full bg-emerald-600/40 w-[19%]" title="National Avg (1.9t)" />
            <div className="h-full bg-emerald-500/30 w-[19%]" title="Urban Resident Avg (3.8t)" />
            <div className="h-full bg-amber-500/20 w-[9%]" title="Global Avg (4.7t)" />
            <div className="h-full bg-stone-300/40 w-[53%]" title="High-Emission Comparison (16.0t)" />
          </div>

          {/* User Marker */}
          {(() => {
            const maxScale = 10;
            const userPercent = Math.min(100, Math.max(0, (totalAnnualTonnesCO2e / maxScale) * 100));
            return (
              <div
                className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-300"
                style={{ left: `${userPercent}%` }}
              >
                <span className="text-[10px] font-bold font-mono-data text-emerald-900 bg-emerald-100 px-1.5 py-0.5 rounded shadow-2xs whitespace-nowrap">
                  You: {totalAnnualTonnesCO2e.toFixed(1)}t
                </span>
                <div className="w-0.5 h-7 bg-emerald-900 mt-0.5" />
              </div>
            );
          })()}

          {/* Key Reference Labels */}
          <div className="relative mt-2 text-[11px] text-stone-500 font-mono-data">
            <div className="flex justify-between items-center text-[10px]">
              <div>
                <span className="font-semibold text-emerald-800">1.9t</span> National Avg
              </div>
              <div>
                <span className="font-semibold text-emerald-700">2.0t</span> Paris Target
              </div>
              <div>
                <span className="font-semibold text-stone-700">3.8t</span> Urban Resident
              </div>
              <div>
                <span className="font-semibold text-stone-700">4.7t</span> Global Avg
              </div>
              <div>
                <span className="font-semibold text-stone-500">10t+</span> High Income
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown: Chart + Category Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Donut Chart & Category Shares */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-stone-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-stone-900 mb-1">
              Emissions by Category
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Percentage breakdown across lifestyle domains
            </p>

            <div className="flex flex-col items-center justify-center my-2">
              <div className="relative flex items-center justify-center">
                <svg width={size} height={size} className="transform -rotate-90">
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#f5f5f4"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                  />
                  {totalAnnualKgCO2e > 0 &&
                    donutSegments.map((seg) => (
                      <circle
                        key={seg.id}
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={seg.color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={seg.strokeDasharray}
                        strokeDashoffset={seg.strokeDashoffset}
                        strokeLinecap="butt"
                        fill="transparent"
                        className="transition-all duration-300"
                      />
                    ))}
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-xl font-bold text-stone-900 font-mono-data">
                    {totalAnnualTonnesCO2e.toFixed(1)}t
                  </span>
                  <span className="text-[11px] text-stone-500">CO₂e / yr</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-stone-100">
              {sortedCategories.map((cat) => (
                <div key={cat.id} className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-xs shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-stone-800 truncate">
                      {cat.label}
                    </div>
                    <div className="text-[11px] text-stone-500 font-mono-data">
                      {cat.percentage.toFixed(1)}% · {Math.round(cat.annualKgCO2e).toLocaleString()} kg
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
              <span>Assessment Confidence: {confidenceScore}%</span>
            </span>
            <button
              type="button"
              onClick={onOpenMethodology}
              className="cursor-pointer text-emerald-800 hover:text-emerald-950 font-medium hover:underline"
            >
              Methodology
            </button>
          </div>
        </div>

        {/* Detailed Activity Table & Formula Drilldown */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200/90 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
            <div>
              <h3 className="text-sm font-semibold text-stone-900">
                Detailed Activity Breakdown
              </h3>
              <p className="text-xs text-stone-500">
                Click any category to inspect activity quantities, emission factors, and costs
              </p>
            </div>
            <button
              type="button"
              onClick={onNavigateToInputs}
              className="cursor-pointer text-xs font-medium text-emerald-800 hover:text-emerald-950 hover:underline"
            >
              Edit Inputs
            </button>
          </div>

          <div className="space-y-3">
            {sortedCategories.map((cat) => {
              const isExpanded = expandedCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  className="rounded-lg border border-stone-200/80 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className="w-full cursor-pointer px-4 py-3 bg-stone-50/50 hover:bg-stone-50 flex items-center justify-between text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2.5 h-2.5 rounded-xs shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <div>
                        <div className="text-xs font-semibold text-stone-900">
                          {cat.label}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {cat.sublabel}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right font-mono-data">
                        <div className="text-xs font-bold text-stone-900">
                          {Math.round(cat.annualKgCO2e).toLocaleString()} kg
                        </div>
                        <div className="text-[10px] text-stone-500">
                          {cat.percentage.toFixed(1)}% of total
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-stone-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-stone-400" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Itemized Formula View */}
                  {isExpanded && (
                    <div className="p-4 bg-white border-t border-stone-200/70 space-y-3">
                      <div className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider">
                        Activity Data & Factor Math:
                      </div>
                      <div className="space-y-2">
                        {cat.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-md bg-stone-50/80 border border-stone-200/60 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
                          >
                            <div className="space-y-0.5">
                              <span className="font-medium text-stone-900 block">
                                {item.name}
                              </span>
                              <span className="text-[11px] text-stone-500 font-mono-data block">
                                {item.activityData} × {item.emissionFactor}
                              </span>
                            </div>
                            <div className="text-right sm:text-right shrink-0">
                              <span className="font-semibold text-stone-900 font-mono-data block">
                                {Math.round(item.annualKgCO2e).toLocaleString()} kg CO₂e
                              </span>
                              {item.annualCostINR !== undefined && item.annualCostINR > 0 && (
                                <span className="text-[10px] text-emerald-800 font-mono-data block">
                                  ~₹{item.annualCostINR.toLocaleString('en-IN')}/yr
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Primary Source Summary Alert */}
          {primaryContributor && (
            <div className="mt-5 p-4 rounded-lg bg-emerald-50/40 border border-emerald-100/90 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
              <div className="text-xs text-stone-700 leading-relaxed">
                <span className="font-semibold text-emerald-950">
                  Key Lever: {primaryContributor.label}
                </span>{' '}
                represents your largest impact at {primaryContributor.percentage.toFixed(0)}% (
                {Math.round(primaryContributor.annualKgCO2e).toLocaleString()} kg CO₂e/yr). Targeted interventions in this area yield substantial carbon reductions and direct monthly savings in ₹.
              </div>
            </div>
          )}

          {/* Action CTA */}
          <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500">
              Ready to simulate reductions and financial savings?
            </span>
            <button
              type="button"
              onClick={onNavigateToPlanner}
              className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors shadow-xs"
            >
              <span>Explore Reductions & ₹ Savings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

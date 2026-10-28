import React, { useState } from 'react';
import { X, Download, FileText, Check, Printer, Copy } from 'lucide-react';
import { CalculationResults, UserFootprintInputs } from '../types/footprint';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: UserFootprintInputs;
  results: CalculationResults;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  inputs,
  results,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateCSV = () => {
    const rows = [
      ['CarbonTrack Assessment Report', ''],
      ['Reporting Period', 'Annual (kg CO2e / year)'],
      ['Generated Date', new Date().toISOString().split('T')[0]],
      ['', ''],
      ['Summary Metric', 'Value', 'Unit'],
      ['Total Annual Footprint', results.totalAnnualTonnesCO2e.toFixed(3), 'tonnes CO2e/year'],
      ['Total Annual kg', Math.round(results.totalAnnualKgCO2e).toString(), 'kg CO2e/year'],
      ['Monthly Average', Math.round(results.totalMonthlyKgCO2e).toString(), 'kg CO2e/month'],
      ['Estimated Annual Energy & Fuel Cost', `INR ${Math.round(results.estimatedAnnualExpenditureINR).toLocaleString('en-IN')}`, 'INR (₹)'],
      ['Assessment Confidence', `${results.confidenceScore}%`, ''],
      ['', ''],
      ['Category Breakdown', 'Annual kg CO2e', 'Percentage Share'],
      ['Transportation & Travel', Math.round(results.categories.transportation.annualKgCO2e).toString(), `${results.categories.transportation.percentage.toFixed(1)}%`],
      ['Home Electricity & Cooking', Math.round(results.categories.energy.annualKgCO2e).toString(), `${results.categories.energy.percentage.toFixed(1)}%`],
      ['Diet & Nutrition', Math.round(results.categories.food.annualKgCO2e).toString(), `${results.categories.food.percentage.toFixed(1)}%`],
      ['Waste & Recycling', Math.round(results.categories.waste.annualKgCO2e).toString(), `${results.categories.waste.percentage.toFixed(1)}%`],
      ['', ''],
      ['Lifestyle Activity Inputs', 'User Provided Value'],
      ['Two-Wheeler Commute', `${inputs.twoWheelerKmPerWeek} km/wk (${inputs.twoWheelerType})`],
      ['Car Travel', `${inputs.carKmPerWeek} km/wk (${inputs.carType})`],
      ['Metro, Rail & City Bus', `${inputs.metroBusKmPerWeek} km/week`],
      ['Intercity Rail', `${inputs.railwayKmPerYear} km/year`],
      ['Air Travel Hours', `${inputs.flightHoursPerYear} hours/year`],
      ['Household Members', `${inputs.householdSize} member(s)`],
      ['Monthly Electricity', `${inputs.electricityKWhPerMonth} Units (kWh)/month`],
      ['Rooftop Solar Offset', `${inputs.rooftopSolarPercent}%`],
      ['Cooking Fuel', inputs.cookingFuelType],
      ['LPG Cylinders Per Year', `${inputs.lpgCylindersPerYear} cylinders/yr`],
      ['PNG Piped Gas', `${inputs.pngScmPerMonth} SCM/mo`],
      ['Dietary Habit', inputs.dietType],
      ['Weekly Waste', `${inputs.wasteKgPerWeek} kg/week`],
      ['Segregated & Recycled', inputs.segregateAndRecycle ? 'Yes' : 'No'],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.map(item => `"${item}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `carbontrack-assessment-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateJSON = () => {
    const exportData = {
      app: 'CarbonTrack',
      version: '2.5.0',
      timestamp: new Date().toISOString(),
      currency: 'INR',
      summary: {
        totalAnnualTonnesCO2e: Number(results.totalAnnualTonnesCO2e.toFixed(3)),
        totalAnnualKgCO2e: Math.round(results.totalAnnualKgCO2e),
        totalMonthlyKgCO2e: Math.round(results.totalMonthlyKgCO2e),
        estimatedAnnualExpenditureINR: Math.round(results.estimatedAnnualExpenditureINR),
        confidenceScore: results.confidenceScore,
      },
      benchmarks: results.benchmarks,
      categories: {
        transportation: {
          annualKg: Math.round(results.categories.transportation.annualKgCO2e),
          percentage: Number(results.categories.transportation.percentage.toFixed(1)),
        },
        energy: {
          annualKg: Math.round(results.categories.energy.annualKgCO2e),
          percentage: Number(results.categories.energy.percentage.toFixed(1)),
        },
        food: {
          annualKg: Math.round(results.categories.food.annualKgCO2e),
          percentage: Number(results.categories.food.percentage.toFixed(1)),
        },
        waste: {
          annualKg: Math.round(results.categories.waste.annualKgCO2e),
          percentage: Number(results.categories.waste.percentage.toFixed(1)),
        },
      },
      inputs,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `carbontrack-data-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copySummaryText = () => {
    const summary = `CarbonTrack Assessment Summary
Total Annual Footprint: ${results.totalAnnualTonnesCO2e.toFixed(2)} tonnes CO₂e/yr (${Math.round(results.totalAnnualKgCO2e).toLocaleString('en-IN')} kg CO₂e)
Monthly Average: ${Math.round(results.totalMonthlyKgCO2e).toLocaleString('en-IN')} kg CO₂e/month
Estimated Annual Energy & Travel Spend: ₹${Math.round(results.estimatedAnnualExpenditureINR).toLocaleString('en-IN')}/year
Comparison to National Baseline (1.9t): ${results.totalAnnualTonnesCO2e <= 1.9 ? 'At/Below National Baseline' : `${(results.totalAnnualTonnesCO2e - 1.9).toFixed(1)}t above national baseline`}

Category Breakdown:
• Transportation & Travel: ${Math.round(results.categories.transportation.annualKgCO2e).toLocaleString('en-IN')} kg (${results.categories.transportation.percentage.toFixed(1)}%)
• Home Electricity & Cooking: ${Math.round(results.categories.energy.annualKgCO2e).toLocaleString('en-IN')} kg (${results.categories.energy.percentage.toFixed(1)}%)
• Diet & Food: ${Math.round(results.categories.food.annualKgCO2e).toLocaleString('en-IN')} kg (${results.categories.food.percentage.toFixed(1)}%)
• Waste & Recycling: ${Math.round(results.categories.waste.annualKgCO2e).toLocaleString('en-IN')} kg (${results.categories.waste.percentage.toFixed(1)}%)

Assessment Confidence: ${results.confidenceScore}% (CEA Grid Baseline & ARAI Grounded)`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-emerald-800" />
            <h2 id="export-title" className="text-base font-bold text-stone-900">
              Export Carbon Assessment Report
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-stone-700">
          {/* Quick Summary Preview */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 font-mono-data space-y-1">
            <div className="flex justify-between items-baseline font-sans">
              <span className="text-xs text-stone-500 font-medium">Estimated Footprint:</span>
              <span className="text-base font-bold text-stone-900 font-mono-data">
                {results.totalAnnualTonnesCO2e.toFixed(2)} t CO₂e / yr
              </span>
            </div>
            <div className="text-[11px] text-stone-500 pt-1 border-t border-stone-200/70 flex justify-between font-sans">
              <span>{Math.round(results.totalAnnualKgCO2e).toLocaleString('en-IN')} kg CO₂e / yr</span>
              <span className="text-emerald-900 font-semibold font-mono-data">
                ~₹{Math.round(results.estimatedAnnualExpenditureINR).toLocaleString('en-IN')}/yr
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={generateCSV}
              className="cursor-pointer p-3.5 rounded-xl border border-stone-200 hover:border-emerald-700 hover:bg-emerald-50/40 transition-all text-left flex items-start gap-3"
            >
              <FileText className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-900 block text-xs">
                  Download CSV
                </span>
                <span className="text-[11px] text-stone-500 block mt-0.5">
                  Spreadsheet of all activity inputs & factors
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={generateJSON}
              className="cursor-pointer p-3.5 rounded-xl border border-stone-200 hover:border-emerald-700 hover:bg-emerald-50/40 transition-all text-left flex items-start gap-3"
            >
              <Download className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-900 block text-xs">
                  Download JSON
                </span>
                <span className="text-[11px] text-stone-500 block mt-0.5">
                  Structured data with financial calculations
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={copySummaryText}
              className="cursor-pointer p-3.5 rounded-xl border border-stone-200 hover:border-emerald-700 hover:bg-emerald-50/40 transition-all text-left flex items-start gap-3"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
              ) : (
                <Copy className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-semibold text-stone-900 block text-xs">
                  {copied ? 'Copied to Clipboard!' : 'Copy Summary'}
                </span>
                <span className="text-[11px] text-stone-500 block mt-0.5">
                  Formatted text for reports and sharing
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="cursor-pointer p-3.5 rounded-xl border border-stone-200 hover:border-emerald-700 hover:bg-emerald-50/40 transition-all text-left flex items-start gap-3"
            >
              <Printer className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-900 block text-xs">
                  Print Report
                </span>
                <span className="text-[11px] text-stone-500 block mt-0.5">
                  Clean browser print view or Save to PDF
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

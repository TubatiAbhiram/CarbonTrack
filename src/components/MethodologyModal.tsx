import React, { useEffect } from 'react';
import { X, ShieldCheck, BookOpen } from 'lucide-react';
import { EMISSION_FACTORS, BENCHMARKS, TARIFFS_INR } from '../data/emissionFactors';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="methodology-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-800" />
            <h2 id="methodology-title" className="text-base font-bold text-stone-900">
              Calculation Methodology, Emission Factors & Data Sources
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-700 leading-relaxed">
          {/* Overview Callout */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-emerald-950 block text-sm">
                Transparent & Verifiable GHG Accounting
              </span>
              <p className="text-stone-600">
                CarbonTrack follows standard Greenhouse Gas Protocol guidelines tailored to domestic power generation and transport baselines. All estimates follow:
              </p>
              <div className="p-2 bg-white rounded border border-emerald-200 font-mono-data text-stone-800 text-[11px] my-1">
                Activity Data [km, kWh, cylinders] × Verified Emission Factor [kg CO₂e/unit] = Annual Emissions [kg CO₂e]
              </div>
              <p className="text-stone-500 text-[11px]">
                Factors incorporate Central Electricity Authority (CEA) national grid carbon intensity, ARAI vehicle certification benchmarks, domestic LPG cylinder standards, and dietary studies.
              </p>
            </div>
          </div>

          {/* Emission Factors Table */}
          <div>
            <h3 className="text-sm font-semibold text-stone-900 mb-3">
              Emission Factors Reference Table
            </h3>
            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-100/80 text-stone-800 font-semibold border-b border-stone-200 text-[11px]">
                    <th className="p-3">Category & Activity</th>
                    <th className="p-3">Emission Factor</th>
                    <th className="p-3">Reference Source</th>
                    <th className="p-3 hidden sm:table-cell">Geography / Year</th>
                    <th className="p-3">Scientific Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 font-sans">
                  {Object.values(EMISSION_FACTORS).map((factor) => (
                    <tr key={factor.id} className="hover:bg-stone-50/50">
                      <td className="p-3 font-medium text-stone-900">
                        <div>{factor.name}</div>
                        <div className="text-[10px] text-stone-400">{factor.category}</div>
                      </td>
                      <td className="p-3 font-mono-data font-semibold text-stone-800 whitespace-nowrap">
                        {factor.factorValue} {factor.unit}
                      </td>
                      <td className="p-3 text-stone-600 text-[11px]">
                        {factor.source}
                      </td>
                      <td className="p-3 text-stone-500 text-[11px] hidden sm:table-cell whitespace-nowrap">
                        {factor.geography} ({factor.referenceYear})
                      </td>
                      <td className="p-3 text-stone-500 text-[11px] leading-normal">
                        {factor.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Benchmarks & Tariffs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-stone-900 mb-2">
                Reference Benchmarks
              </h3>
              <ul className="space-y-2">
                <li className="p-2.5 rounded-lg border border-stone-200 bg-stone-50">
                  <span className="font-semibold text-stone-900 block">
                    National Average: 1,900 kg CO₂e / year (1.9 t)
                  </span>
                  <span className="text-stone-500 text-[11px] block">
                    MoEFCC / World Bank per-capita consumption baseline.
                  </span>
                </li>
                <li className="p-2.5 rounded-lg border border-stone-200 bg-stone-50">
                  <span className="font-semibold text-stone-900 block">
                    Urban Resident Average: 3,800 kg CO₂e / year (3.8 t)
                  </span>
                  <span className="text-stone-500 text-[11px] block">
                    CEEW study on urban air conditioning, mobility, and flights.
                  </span>
                </li>
                <li className="p-2.5 rounded-lg border border-stone-200 bg-stone-50">
                  <span className="font-semibold text-stone-900 block">
                    Paris 1.5°C Budget Target: 2,000 kg CO₂e / year (2.0 t)
                  </span>
                  <span className="text-stone-500 text-[11px] block">
                    UNEP target budget per person by 2030 to limit global warming.
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-stone-900 mb-2">
                Tariff Assumptions (for ₹ Savings)
              </h3>
              <ul className="space-y-2">
                <li className="p-2.5 rounded-lg border border-stone-200 bg-stone-50">
                  <span className="font-semibold text-stone-900 block">
                    Petrol: ₹102 / litre
                  </span>
                  <span className="text-stone-500 text-[11px] block">
                    Current metro average retail price across fuel outlets.
                  </span>
                </li>
                <li className="p-2.5 rounded-lg border border-stone-200 bg-stone-50">
                  <span className="font-semibold text-stone-900 block">
                    Residential Electricity: ₹7.50 / Unit (kWh)
                  </span>
                  <span className="text-stone-500 text-[11px] block">
                    Blended residential tariff (tiered slabs ~₹6 to ₹9/unit).
                  </span>
                </li>
                <li className="p-2.5 rounded-lg border border-stone-200 bg-stone-50">
                  <span className="font-semibold text-stone-900 block">
                    LPG Cylinder (14.2 kg): ₹850 / cylinder
                  </span>
                  <span className="text-stone-500 text-[11px] block">
                    Non-subsidized domestic LPG refill rate.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors"
          >
            Close Methodology
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Bike,
  Car,
  Train,
  Plane,
  Zap,
  Flame,
  Utensils,
  Trash2,
  Users,
  RotateCcw,
  SlidersHorizontal,
  ArrowRight,
  Info,
  Sun,
} from 'lucide-react';
import {
  CarType,
  CookingFuelType,
  DietType,
  TwoWheelerType,
  UserFootprintInputs,
} from '../types/footprint';
import { LIFESTYLE_PRESETS } from '../data/presets';
import { TARIFFS_INR } from '../data/emissionFactors';

interface LifestyleFormProps {
  inputs: UserFootprintInputs;
  onInputChange: (updates: Partial<UserFootprintInputs>) => void;
  onApplyPreset: (presetId: string) => void;
  onReset: () => void;
  onProceedToResults: () => void;
}

export const LifestyleForm: React.FC<LifestyleFormProps> = ({
  inputs,
  onInputChange,
  onApplyPreset,
  onReset,
  onProceedToResults,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const twoWheelerOptions: { value: TwoWheelerType; label: string; desc: string }[] = [
    { value: 'petrol_bike', label: 'Petrol Scooter/Bike', desc: '0.040 kg/km • ~50 km/L at ₹102/L' },
    { value: 'electric_scooter', label: 'Electric EV Scooter', desc: '0.018 kg/km • ~₹0.20/km charging' },
    { value: 'none', label: 'No Two-Wheeler', desc: 'Transit or active commute only' },
  ];

  const carOptions: { value: CarType; label: string; desc: string }[] = [
    { value: 'petrol_diesel', label: 'Petrol / Diesel Car', desc: '0.155 kg/km • ~16 km/L fleet avg' },
    { value: 'cng', label: 'CNG Vehicle', desc: '0.115 kg/km • ~22 km/kg at ₹78/kg' },
    { value: 'electric', label: 'Electric Car (EV)', desc: '0.086 kg/km • Grid life-cycle' },
    { value: 'none', label: 'No Car (0 km)', desc: 'No personal 4-wheeler' },
  ];

  const dietOptions: { value: DietType; label: string; sub: string }[] = [
    { value: 'pure_veg', label: 'Pure Lacto-Vegetarian', sub: 'Dal, roti, rice, sabzi, curd, milk' },
    { value: 'eggetarian', label: 'Eggetarian', sub: 'Vegetarian meals + eggs' },
    { value: 'non_veg_occasional', label: 'Occasional Non-Veg', sub: 'Chicken/fish 1–2 days/wk' },
    { value: 'non_veg_regular', label: 'Regular Non-Veg', sub: 'Chicken/mutton 4–6 days/wk' },
    { value: 'vegan', label: 'Plant-Based Vegan', sub: 'No dairy, curd, paneer or ghee' },
  ];

  const cookingOptions: { value: CookingFuelType; label: string; desc: string }[] = [
    { value: 'lpg_cylinder', label: 'LPG Cylinder (14.2 kg)', desc: 'Standard domestic refill (~₹850)' },
    { value: 'png_piped', label: 'Piped Natural Gas (PNG)', desc: 'Metred utility connection (~₹50/SCM)' },
    { value: 'electric_induction', label: 'Induction Cooking', desc: 'Electric cooktop / solar powered' },
    { value: 'none', label: 'Shared / Mess / None', desc: 'Hostel or included in meals' },
  ];

  return (
    <div className="space-y-8">
      {/* Preset Toolbar */}
      <div className="bg-white rounded-xl border border-stone-200/90 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <h2 className="text-base font-semibold text-stone-900">
              Lifestyle Archetypes
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Select an archetype to populate verified regional baselines, or customize your activities below.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                showAdvanced
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{showAdvanced ? 'Advanced Mode: Active' : 'Enable Advanced Mode'}</span>
            </button>
            <button
              type="button"
              onClick={onReset}
              className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
              title="Reset all inputs to zero"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Preset Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-4">
          {LIFESTYLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onApplyPreset(preset.id)}
              className="cursor-pointer text-left p-3 rounded-lg border border-stone-200/80 hover:border-emerald-700/60 hover:bg-emerald-50/30 transition-all group"
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-semibold text-stone-900 group-hover:text-emerald-900">
                  {preset.name}
                </span>
                <span className="text-[10px] text-stone-500 font-medium">
                  {preset.badge}
                </span>
              </div>
              <div className="text-[10px] text-emerald-800 font-medium mb-1">
                {preset.cityContext}
              </div>
              <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Mobility & Daily Travel */}
        <section className="bg-white rounded-xl border border-stone-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-4 mb-5 border-b border-stone-100">
              <div className="p-2 rounded-lg bg-teal-50 text-teal-800">
                <Bike className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-900">1. Daily Mobility & Commute</h3>
                <p className="text-xs text-stone-500">Two-wheelers, cars, Metro, railways, and flights</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Two-Wheeler Commute */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Bike className="w-3.5 h-3.5 text-stone-500" />
                    <label htmlFor="twoWheelerKm" className="text-xs font-semibold text-stone-800">
                      Two-Wheeler Commute
                    </label>
                  </div>
                  <span className="text-xs font-mono-data text-stone-600">
                    {inputs.twoWheelerKmPerWeek} km/week{' '}
                    <span className="text-stone-400 font-sans">
                      ({Math.round(inputs.twoWheelerKmPerWeek * 52).toLocaleString()} km/yr)
                    </span>
                  </span>
                </div>
                <input
                  id="twoWheelerKm"
                  type="range"
                  min="0"
                  max="350"
                  step="5"
                  value={inputs.twoWheelerKmPerWeek}
                  onChange={(e) => onInputChange({ twoWheelerKmPerWeek: Number(e.target.value) })}
                  className="w-full accent-emerald-800 cursor-pointer"
                />
                <div className="grid grid-cols-3 gap-1.5 mt-2">
                  {twoWheelerOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onInputChange({ twoWheelerType: opt.value })}
                      className={`cursor-pointer p-2 text-left rounded-lg border text-xs transition-all ${
                        inputs.twoWheelerType === opt.value
                          ? 'border-emerald-800 bg-emerald-50/70 font-semibold text-emerald-950 shadow-2xs'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div className="font-medium text-[11px] truncate">{opt.label}</div>
                      <div className="text-[10px] text-stone-500 truncate">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Four-Wheeler (Car) */}
              <div className="pt-3 border-t border-stone-100">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-stone-500" />
                    <label htmlFor="carKm" className="text-xs font-semibold text-stone-800">
                      Car Travel (Personal / Cab)
                    </label>
                  </div>
                  <span className="text-xs font-mono-data text-stone-600">
                    {inputs.carKmPerWeek} km/week{' '}
                    <span className="text-stone-400 font-sans">
                      ({Math.round(inputs.carKmPerWeek * 52).toLocaleString()} km/yr)
                    </span>
                  </span>
                </div>
                <input
                  id="carKm"
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={inputs.carKmPerWeek}
                  onChange={(e) => onInputChange({ carKmPerWeek: Number(e.target.value) })}
                  className="w-full accent-emerald-800 cursor-pointer"
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-2">
                  {carOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onInputChange({ carType: opt.value })}
                      className={`cursor-pointer p-2 text-left rounded-lg border text-xs transition-all ${
                        inputs.carType === opt.value
                          ? 'border-emerald-800 bg-emerald-50/70 font-semibold text-emerald-950 shadow-2xs'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div className="font-medium text-[11px] truncate">{opt.label}</div>
                      <div className="text-[10px] text-stone-500 truncate">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Metro, Suburban Local Train & City Bus */}
              <div className="pt-3 border-t border-stone-100">
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="metroBusKm" className="text-xs font-semibold text-stone-800">
                    Metro, Suburban Rail & City Bus
                  </label>
                  <span className="text-xs font-mono-data text-stone-600">
                    {inputs.metroBusKmPerWeek} km/week
                  </span>
                </div>
                <input
                  id="metroBusKm"
                  type="range"
                  min="0"
                  max="250"
                  step="5"
                  value={inputs.metroBusKmPerWeek}
                  onChange={(e) => onInputChange({ metroBusKmPerWeek: Number(e.target.value) })}
                  className="w-full accent-emerald-800 cursor-pointer"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  0.032 kg CO₂e/passenger-km • Metro & municipal mass transit
                </p>
              </div>

              {/* Intercity Rail & Aviation */}
              <div className="pt-3 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                      <Train className="w-3.5 h-3.5 text-stone-500" />
                      <span className="text-xs font-semibold text-stone-800">
                        Intercity Rail Travel
                      </span>
                    </div>
                    <span className="text-xs font-mono-data text-stone-600">
                      {inputs.railwayKmPerYear} km/yr
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="200"
                    value={inputs.railwayKmPerYear}
                    onChange={(e) => onInputChange({ railwayKmPerYear: Number(e.target.value) })}
                    className="w-full accent-emerald-800 cursor-pointer"
                  />
                  <div className="text-[10px] text-stone-400 mt-0.5">
                    Express & Vande Bharat (~0.030 kg/km)
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                      <Plane className="w-3.5 h-3.5 text-stone-500" />
                      <span className="text-xs font-semibold text-stone-800">
                        Air Travel (Flights)
                      </span>
                    </div>
                    <span className="text-xs font-mono-data text-stone-600">
                      {inputs.flightHoursPerYear} hrs/yr
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    step="1"
                    value={inputs.flightHoursPerYear}
                    onChange={(e) => onInputChange({ flightHoursPerYear: Number(e.target.value) })}
                    className="w-full accent-emerald-800 cursor-pointer"
                  />
                  <div className="text-[10px] text-stone-400 mt-0.5">
                    185 kg CO₂e/flight hour with radiative forcing
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Home Electricity & Cooking */}
        <section className="bg-white rounded-xl border border-stone-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-4 mb-5 border-b border-stone-100">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-800">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-900">2. Home Electricity & Cooking Fuel</h3>
                <p className="text-xs text-stone-500">Grid power, rooftop solar, and LPG/PNG cooking</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Household Size */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-stone-500" />
                    <label htmlFor="householdSize" className="text-xs font-semibold text-stone-800">
                      Household Members
                    </label>
                  </div>
                  <span className="text-xs font-mono-data font-semibold text-stone-800">
                    {inputs.householdSize} {inputs.householdSize === 1 ? 'person' : 'members'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => onInputChange({ householdSize: num })}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                        inputs.householdSize === num
                          ? 'border-emerald-800 bg-emerald-800 text-white'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {num === 6 ? '6+' : num}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  Electricity and cooking fuel are divided equally per person to reflect individual responsibility.
                </p>
              </div>

              {/* Monthly Electricity (Units) */}
              <div className="pt-3 border-t border-stone-100">
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="electricity" className="text-xs font-semibold text-stone-800">
                    Monthly Electricity (Units / kWh)
                  </label>
                  <span className="text-xs font-mono-data text-stone-600">
                    {inputs.electricityKWhPerMonth} Units/mo{' '}
                    <span className="text-emerald-800 font-sans font-medium">
                      (~₹{Math.round(inputs.electricityKWhPerMonth * TARIFFS_INR.electricityPerKWh).toLocaleString()}/mo bill)
                    </span>
                  </span>
                </div>
                <input
                  id="electricity"
                  type="range"
                  min="0"
                  max="1200"
                  step="20"
                  value={inputs.electricityKWhPerMonth}
                  onChange={(e) => onInputChange({ electricityKWhPerMonth: Number(e.target.value) })}
                  className="w-full accent-emerald-800 cursor-pointer"
                />
                <div className="flex items-center justify-between text-[11px] text-stone-400 mt-1 font-mono-data">
                  <span>0 Units</span>
                  <span>150 Units (1BHK)</span>
                  <span>300 Units (2BHK AC)</span>
                  <span>1,200 Units</span>
                </div>
                <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
                  <Info className="w-3 h-3 text-stone-400 shrink-0" />
                  <span>National grid baseline: 0.716 kg CO₂e / kWh (Central Electricity Authority)</span>
                </div>
              </div>

              {/* Rooftop Solar */}
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-600" />
                    <label htmlFor="solar" className="text-xs font-semibold text-stone-800">
                      Rooftop Solar Offset
                    </label>
                  </div>
                  <span className="text-xs font-mono-data font-semibold text-emerald-800">
                    {inputs.rooftopSolarPercent}% Solar Powered
                  </span>
                </div>
                <input
                  id="solar"
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={inputs.rooftopSolarPercent}
                  onChange={(e) => onInputChange({ rooftopSolarPercent: Number(e.target.value) })}
                  className="w-full accent-emerald-800 cursor-pointer"
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  Offsets thermal coal grid power with zero-carbon domestic solar generation.
                </p>
              </div>

              {/* Cooking Fuel */}
              <div className="pt-3 border-t border-stone-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-stone-500" />
                    <label className="text-xs font-semibold text-stone-800">
                      Primary Kitchen Cooking Fuel
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 mb-3">
                  {cookingOptions.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => onInputChange({ cookingFuelType: c.value })}
                      className={`cursor-pointer p-2 text-left rounded-lg border text-xs transition-all ${
                        inputs.cookingFuelType === c.value
                          ? 'border-emerald-800 bg-emerald-50/70 font-semibold text-emerald-950 shadow-2xs'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div className="font-medium text-[11px] truncate">{c.label}</div>
                      <div className="text-[10px] text-stone-500 truncate">{c.desc}</div>
                    </button>
                  ))}
                </div>

                {inputs.cookingFuelType === 'lpg_cylinder' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-stone-700">14.2 kg LPG Cylinders Consumed per Year</span>
                      <span className="text-xs font-mono-data font-semibold text-stone-800">
                        {inputs.lpgCylindersPerYear} Cylinders/yr (~₹{Math.round(inputs.lpgCylindersPerYear * TARIFFS_INR.lpgCylinderCost).toLocaleString()})
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="16"
                      step="1"
                      value={inputs.lpgCylindersPerYear}
                      onChange={(e) => onInputChange({ lpgCylindersPerYear: Number(e.target.value) })}
                      className="w-full accent-emerald-800 cursor-pointer"
                    />
                    <div className="text-[10px] text-stone-400 mt-1">
                      42.3 kg CO₂e per 14.2 kg cylinder
                    </div>
                  </div>
                )}

                {inputs.cookingFuelType === 'png_piped' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-stone-700">Piped Natural Gas (SCM/Month)</span>
                      <span className="text-xs font-mono-data font-semibold text-stone-800">
                        {inputs.pngScmPerMonth} SCM/mo (~₹{inputs.pngScmPerMonth * TARIFFS_INR.pngPerSCM})
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      step="1"
                      value={inputs.pngScmPerMonth}
                      onChange={(e) => onInputChange({ pngScmPerMonth: Number(e.target.value) })}
                      className="w-full accent-emerald-800 cursor-pointer"
                    />
                    <div className="text-[10px] text-stone-400 mt-1">
                      1.88 kg CO₂e per SCM (Standard Cubic Metre)
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Dietary Lifestyle */}
        <section className="bg-white rounded-xl border border-stone-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-4 mb-5 border-b border-stone-100">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-900">3. Diet & Nutrition</h3>
                <p className="text-xs text-stone-500">Agricultural footprint of dietary choices</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-semibold text-stone-800">
                Select Your Dietary Habit
              </label>
              <div className="space-y-2">
                {dietOptions.map((diet) => (
                  <button
                    key={diet.value}
                    type="button"
                    onClick={() => onInputChange({ dietType: diet.value })}
                    className={`w-full cursor-pointer p-3 text-left rounded-lg border text-xs transition-all flex items-center justify-between ${
                      inputs.dietType === diet.value
                        ? 'border-emerald-800 bg-emerald-50/70 text-emerald-950 font-semibold shadow-2xs'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-xs text-stone-900">{diet.label}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">{diet.sub}</div>
                    </div>
                    <div className="text-right text-[11px] font-mono-data font-semibold text-emerald-800">
                      {diet.value === 'pure_veg' && '1.35 t CO₂e/yr'}
                      {diet.value === 'eggetarian' && '1.55 t CO₂e/yr'}
                      {diet.value === 'non_veg_occasional' && '1.85 t CO₂e/yr'}
                      {diet.value === 'non_veg_regular' && '2.40 t CO₂e/yr'}
                      {diet.value === 'vegan' && '1.05 t CO₂e/yr'}
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-3 bg-emerald-50/40 rounded-lg border border-emerald-100 text-xs text-stone-600 leading-relaxed mt-2">
                <span className="font-semibold text-emerald-950">Dietary Context: </span>
                Diets centered on lentils, pulses (dal, chana, rajma), seasonal vegetables, and grains have substantially lower carbon intensity than global averages. Plant-forward meals reduce agricultural emissions by ~40%.
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Waste Management */}
        <section className="bg-white rounded-xl border border-stone-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-4 mb-5 border-b border-stone-100">
              <div className="p-2 rounded-lg bg-stone-100 text-stone-800">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-900">4. Waste Management & Circular Living</h3>
                <p className="text-xs text-stone-500">Municipal disposal and dry scrap recycling</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Waste Generation */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="waste" className="text-xs font-semibold text-stone-800">
                    Weekly Waste Generated
                  </label>
                  <span className="text-xs font-mono-data text-stone-600">
                    {inputs.wasteKgPerWeek} kg/week{' '}
                    <span className="text-stone-400 font-sans">
                      (~{Math.round(inputs.wasteKgPerWeek * 52)} kg/yr)
                    </span>
                  </span>
                </div>
                <input
                  id="waste"
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={inputs.wasteKgPerWeek}
                  onChange={(e) => onInputChange({ wasteKgPerWeek: Number(e.target.value) })}
                  className="w-full accent-emerald-800 cursor-pointer"
                />
                <div className="flex items-center justify-between text-[11px] text-stone-400 mt-1 font-mono-data">
                  <span>0 kg</span>
                  <span>4 kg (Individual)</span>
                  <span>10 kg (Family)</span>
                  <span>30 kg</span>
                </div>
              </div>

              {/* Segregation & Scrap Recycling */}
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inputs.segregateAndRecycle}
                    onChange={(e) => onInputChange({ segregateAndRecycle: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded text-emerald-800 accent-emerald-800 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-semibold text-stone-900 block">
                      Waste Segregation & Scrap Recycling
                    </span>
                    <span className="text-[11px] text-stone-500 block mt-0.5 leading-relaxed">
                      Segregating organic wet waste (for home or community composting) and handing dry scrap (cardboard, plastics, glass, metals) to local recyclers diverts ~60% of municipal dump yard methane.
                    </span>
                  </div>
                </label>
              </div>

              <div className="text-[11px] text-stone-400">
                Factor: 0.350 kg CO₂e / kg waste (Central Pollution Control Board).
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between">
            <div className="text-xs text-stone-500">
              Live updates calculate results instantly in real time.
            </div>
            <button
              type="button"
              onClick={onProceedToResults}
              className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors shadow-xs"
            >
              <span>View Results & Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

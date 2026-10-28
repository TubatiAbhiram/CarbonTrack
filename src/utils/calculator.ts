import {
  CalculationResults,
  EmissionCategoryBreakdown,
  ReductionStrategy,
  UserFootprintInputs,
} from '../types/footprint';
import { BENCHMARKS, EMISSION_FACTORS, TARIFFS_INR } from '../data/emissionFactors';

/**
 * Validates and sanitizes numeric input to ensure non-negative, finite numbers.
 */
export function sanitizeNumber(value: unknown, fallback = 0, min = 0, max = 1_000_000): number {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    return fallback;
  }
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculates Transportation emissions in kg CO₂e/year and annual cost in INR (₹).
 */
export function calculateTransportation(inputs: UserFootprintInputs): {
  total: number;
  totalCostINR: number;
  items: EmissionCategoryBreakdown['items'];
} {
  const twoWheelerKm = sanitizeNumber(inputs.twoWheelerKmPerWeek, 0);
  const carKm = sanitizeNumber(inputs.carKmPerWeek, 0);
  const metroBusKm = sanitizeNumber(inputs.metroBusKmPerWeek, 0);
  const railwayKm = sanitizeNumber(inputs.railwayKmPerYear, 0);
  const flightHours = sanitizeNumber(inputs.flightHoursPerYear, 0);

  // 1. Two-Wheeler
  let twoWheelerAnnual = 0;
  let twoWheelerCostINR = 0;
  let twoWheelerFactor = 0;
  let twoWheelerLabel = 'Two-Wheeler (None)';

  if (inputs.twoWheelerType === 'petrol_bike') {
    twoWheelerFactor = EMISSION_FACTORS.two_wheeler_petrol.factorValue; // 0.040
    twoWheelerAnnual = twoWheelerKm * 52 * twoWheelerFactor;
    // ~50 km/litre at ₹102/L
    twoWheelerCostINR = ((twoWheelerKm * 52) / 50) * TARIFFS_INR.petrolPerLitre;
    twoWheelerLabel = 'Petrol Two-Wheeler (Motorcycle / Scooter)';
  } else if (inputs.twoWheelerType === 'electric_scooter') {
    twoWheelerFactor = EMISSION_FACTORS.two_wheeler_electric.factorValue; // 0.018
    twoWheelerAnnual = twoWheelerKm * 52 * twoWheelerFactor;
    // ~0.025 kWh/km at ₹7.5/unit
    twoWheelerCostINR = twoWheelerKm * 52 * 0.025 * TARIFFS_INR.electricityPerKWh;
    twoWheelerLabel = 'Electric Two-Wheeler (EV Scooter)';
  }

  // 2. Four-Wheeler (Car)
  let carAnnual = 0;
  let carCostINR = 0;
  let carFactor = 0;
  let carLabel = 'Car (None)';

  if (inputs.carType === 'petrol_diesel') {
    carFactor = EMISSION_FACTORS.car_petrol_diesel.factorValue; // 0.155
    carAnnual = carKm * 52 * carFactor;
    // ~16 km/litre at ₹102/L
    carCostINR = ((carKm * 52) / 16) * TARIFFS_INR.petrolPerLitre;
    carLabel = 'Petrol / Diesel Car (Fleet Avg)';
  } else if (inputs.carType === 'cng') {
    carFactor = EMISSION_FACTORS.car_cng.factorValue; // 0.115
    carAnnual = carKm * 52 * carFactor;
    // ~22 km/kg CNG at ₹78/kg
    carCostINR = ((carKm * 52) / 22) * TARIFFS_INR.cngPerKg;
    carLabel = 'CNG Passenger Car';
  } else if (inputs.carType === 'electric') {
    carFactor = EMISSION_FACTORS.car_electric.factorValue; // 0.086
    carAnnual = carKm * 52 * carFactor;
    // ~0.12 kWh/km at ₹7.5/unit
    carCostINR = carKm * 52 * 0.12 * TARIFFS_INR.electricityPerKWh;
    carLabel = 'Electric Car (EV)';
  }

  // 3. Public Transit & Indian Railways
  const metroBusAnnual = metroBusKm * 52 * EMISSION_FACTORS.metro_local_bus.factorValue; // 0.032
  const metroBusCostINR = metroBusKm * 52 * 2.5; // ~₹2.5/km average fare

  const railwayAnnual = railwayKm * EMISSION_FACTORS.indian_railways.factorValue; // 0.030
  const railwayCostINR = railwayKm * 0.9; // ~₹0.9/km average fare

  // 4. Commercial Aviation
  const airAnnual = flightHours * EMISSION_FACTORS.air_travel.factorValue; // 185.0
  const airCostINR = flightHours * 4500; // ~₹4,500/flight hour ticket price

  const total = twoWheelerAnnual + carAnnual + metroBusAnnual + railwayAnnual + airAnnual;
  const totalCostINR = twoWheelerCostINR + carCostINR + metroBusCostINR + railwayCostINR + airCostINR;

  const items = [
    {
      name: twoWheelerLabel,
      annualKgCO2e: twoWheelerAnnual,
      activityData: `${Math.round(twoWheelerKm * 52).toLocaleString()} km/yr (${Math.round(twoWheelerKm)} km/wk)`,
      emissionFactor: `${twoWheelerFactor.toFixed(3)} kg CO₂e/km (ARAI)`,
      annualCostINR: Math.round(twoWheelerCostINR),
    },
    {
      name: carLabel,
      annualKgCO2e: carAnnual,
      activityData: `${Math.round(carKm * 52).toLocaleString()} km/yr (${Math.round(carKm)} km/wk)`,
      emissionFactor: `${carFactor.toFixed(3)} kg CO₂e/km (ARAI / MoRTH)`,
      annualCostINR: Math.round(carCostINR),
    },
    {
      name: 'Metro, Local Train & City Bus',
      annualKgCO2e: metroBusAnnual,
      activityData: `${Math.round(metroBusKm * 52).toLocaleString()} km/yr (${Math.round(metroBusKm)} km/wk)`,
      emissionFactor: `${EMISSION_FACTORS.metro_local_bus.factorValue.toFixed(3)} kg CO₂e/km (DMRC)`,
      annualCostINR: Math.round(metroBusCostINR),
    },
    {
      name: 'Indian Railways (Intercity Train)',
      annualKgCO2e: railwayAnnual,
      activityData: `${Math.round(railwayKm).toLocaleString()} km/yr`,
      emissionFactor: `${EMISSION_FACTORS.indian_railways.factorValue.toFixed(3)} kg CO₂e/km (BEE / Railways)`,
      annualCostINR: Math.round(railwayCostINR),
    },
    {
      name: 'Commercial Air Travel',
      annualKgCO2e: airAnnual,
      activityData: `${flightHours.toFixed(1)} flight hours/yr`,
      emissionFactor: `${EMISSION_FACTORS.air_travel.factorValue.toFixed(1)} kg CO₂e/hr (DGCA / ICAO)`,
      annualCostINR: Math.round(airCostINR),
    },
  ];

  return { total, totalCostINR, items };
}

/**
 * Calculates Home Energy emissions in kg CO₂e/year and annual cost in INR (₹).
 * Uses CEA national electricity grid baseline and Indian cooking fuel factors.
 */
export function calculateHomeEnergy(inputs: UserFootprintInputs): {
  total: number;
  totalCostINR: number;
  items: EmissionCategoryBreakdown['items'];
} {
  const householdSize = Math.max(1, sanitizeNumber(inputs.householdSize, 1, 1, 20));
  const electricityKWh = sanitizeNumber(inputs.electricityKWhPerMonth, 0);
  const solarPct = Math.min(100, Math.max(0, sanitizeNumber(inputs.rooftopSolarPercent, 0, 0, 100)));

  // Grid electricity factor reduced by rooftop solar fraction
  const gridFactor = EMISSION_FACTORS.electricity_grid_india.factorValue * (1 - solarPct / 100);
  const electricityAnnualHousehold = electricityKWh * 12 * gridFactor;
  const electricityAnnualPerCapita = electricityAnnualHousehold / householdSize;

  const electricCostHousehold = electricityKWh * 12 * (1 - solarPct / 100) * TARIFFS_INR.electricityPerKWh;
  const electricCostPerCapita = electricCostHousehold / householdSize;

  // Cooking Fuel
  let cookingAnnualPerCapita = 0;
  let cookingCostPerCapita = 0;
  let cookingLabel = 'Induction / Electric Cooking';
  let cookingActivity = '0 direct fuel';
  let cookingFactor = 'Included in electricity load';

  if (inputs.cookingFuelType === 'lpg_cylinder') {
    const cylinders = sanitizeNumber(inputs.lpgCylindersPerYear, 0);
    const lpgAnnualHousehold = cylinders * EMISSION_FACTORS.lpg_cylinder.factorValue; // 42.3 kg/cyl
    cookingAnnualPerCapita = lpgAnnualHousehold / householdSize;
    cookingCostPerCapita = (cylinders * TARIFFS_INR.lpgCylinderCost) / householdSize;
    cookingLabel = 'Domestic LPG Cylinder (14.2 kg)';
    cookingActivity = `${(cylinders / householdSize).toFixed(1)} cylinders/yr/person (Household: ${cylinders} cyl/yr)`;
    cookingFactor = `${EMISSION_FACTORS.lpg_cylinder.factorValue.toFixed(1)} kg CO₂e/cylinder (MoPNG)`;
  } else if (inputs.cookingFuelType === 'png_piped') {
    const pngScm = sanitizeNumber(inputs.pngScmPerMonth, 0);
    const pngAnnualHousehold = pngScm * 12 * EMISSION_FACTORS.png_piped.factorValue; // 1.88 kg/SCM
    cookingAnnualPerCapita = pngAnnualHousehold / householdSize;
    cookingCostPerCapita = (pngScm * 12 * TARIFFS_INR.pngPerSCM) / householdSize;
    cookingLabel = 'Piped Natural Gas (PNG)';
    cookingActivity = `${Math.round(pngScm * 12 / householdSize)} SCM/yr/person (Household: ${Math.round(pngScm * 12)} SCM/yr)`;
    cookingFactor = `${EMISSION_FACTORS.png_piped.factorValue.toFixed(2)} kg CO₂e/SCM (PNGRB)`;
  }

  const total = electricityAnnualPerCapita + cookingAnnualPerCapita;
  const totalCostINR = electricCostPerCapita + cookingCostPerCapita;

  const items = [
    {
      name: `DISCOM Electricity (${solarPct}% Rooftop Solar)`,
      annualKgCO2e: electricityAnnualPerCapita,
      activityData: `${Math.round(electricityKWh * 12 / householdSize)} Units (kWh)/yr/person (Household: ${Math.round(electricityKWh * 12)} kWh, ${householdSize} people)`,
      emissionFactor: `${gridFactor.toFixed(3)} kg CO₂e/kWh (CEA Baseline Database)`,
      annualCostINR: Math.round(electricCostPerCapita),
    },
    {
      name: cookingLabel,
      annualKgCO2e: cookingAnnualPerCapita,
      activityData: cookingActivity,
      emissionFactor: cookingFactor,
      annualCostINR: Math.round(cookingCostPerCapita),
    },
  ];

  return { total, totalCostINR, items };
}

/**
 * Calculates Food & Dietary emissions in kg CO₂e/year for Indian dietary patterns.
 */
export function calculateDiet(inputs: UserFootprintInputs): {
  total: number;
  items: EmissionCategoryBreakdown['items'];
} {
  const dietMap: Record<string, { kg: number; label: string; desc: string }> = {
    pure_veg: {
      kg: 1350,
      label: 'Pure Lacto-Vegetarian Diet',
      desc: 'Traditional Indian dal, roti, rice, sabzi, curd, milk, and paneer with zero meat or eggs.',
    },
    eggetarian: {
      kg: 1550,
      label: 'Eggetarian Diet (Vegetarian + Eggs)',
      desc: 'Plant-based staples, dairy, and regular egg consumption without poultry or meat.',
    },
    non_veg_occasional: {
      kg: 1850,
      label: 'Occasional Non-Vegetarian (1–2 days/wk)',
      desc: 'Vegetarian staples with weekend chicken or fish meals.',
    },
    non_veg_regular: {
      kg: 2400,
      label: 'Regular Non-Vegetarian (4–6 days/wk)',
      desc: 'Frequent consumption of chicken, mutton, and fish throughout the week.',
    },
    vegan: {
      kg: 1050,
      label: 'Strict Vegan Diet (No Dairy / Ghee)',
      desc: '100% plant-based diet excluding milk, curd, paneer, and ghee.',
    },
  };

  const dietInfo = dietMap[inputs.dietType] || dietMap.pure_veg;
  const total = dietInfo.kg;

  const items = [
    {
      name: dietInfo.label,
      annualKgCO2e: total,
      activityData: dietInfo.desc,
      emissionFactor: `${total} kg CO₂e/year (CEEW / ICMR Dietary Life-Cycle)`,
    },
  ];

  return { total, items };
}

/**
 * Calculates Municipal Solid Waste emissions in kg CO₂e/year.
 */
export function calculateWaste(inputs: UserFootprintInputs): {
  total: number;
  items: EmissionCategoryBreakdown['items'];
} {
  const wasteKg = sanitizeNumber(inputs.wasteKgPerWeek, 0);
  let factor = EMISSION_FACTORS.waste_dumpsite_india.factorValue; // 0.350

  // Wet waste composting and Kabadiwala scrap recycling diverts ~60% of fugitive methane
  if (inputs.segregateAndRecycle) {
    factor = factor * 0.40; // 60% reduction
  }

  const total = wasteKg * 52 * factor;

  const items = [
    {
      name: inputs.segregateAndRecycle
        ? 'Segregated Waste (Wet Composting & Kabadiwala Recycled)'
        : 'Mixed Waste (Sent to Open Municipal Dump)',
      annualKgCO2e: total,
      activityData: `${Math.round(wasteKg * 52)} kg waste/year (${wasteKg} kg/wk)`,
      emissionFactor: `${factor.toFixed(3)} kg CO₂e/kg waste (CPCB / MoEFCC)`,
    },
  ];

  return { total, items };
}

/**
 * Calculates complete Carbon Footprint results with category breakdowns,
 * uncertainty estimation, Indian benchmarks, and Rupee (₹) expenditure.
 */
export function calculateTotalFootprint(inputs: UserFootprintInputs): CalculationResults {
  const transport = calculateTransportation(inputs);
  const energy = calculateHomeEnergy(inputs);
  const diet = calculateDiet(inputs);
  const waste = calculateWaste(inputs);

  const totalAnnualKgCO2e = transport.total + energy.total + diet.total + waste.total;
  const totalMonthlyKgCO2e = totalAnnualKgCO2e / 12;
  const totalAnnualTonnesCO2e = totalAnnualKgCO2e / 1000;

  const estimatedAnnualExpenditureINR = transport.totalCostINR + energy.totalCostINR;

  const getPct = (val: number) => (totalAnnualKgCO2e > 0 ? (val / totalAnnualKgCO2e) * 100 : 0);

  const categories = {
    transportation: {
      id: 'transportation' as const,
      label: 'Transportation & Travel',
      sublabel: 'Two-wheelers, cars, Indian Railways, Metro, and flights',
      annualKgCO2e: transport.total,
      monthlyKgCO2e: transport.total / 12,
      percentage: getPct(transport.total),
      color: '#0d9488', // teal-600
      items: transport.items,
    },
    energy: {
      id: 'energy' as const,
      label: 'Home Electricity & Cooking',
      sublabel: 'DISCOM grid power, rooftop solar, and LPG/PNG cooking',
      annualKgCO2e: energy.total,
      monthlyKgCO2e: energy.total / 12,
      percentage: getPct(energy.total),
      color: '#eab308', // amber-500
      items: energy.items,
    },
    food: {
      id: 'food' as const,
      label: 'Diet & Nutrition',
      sublabel: 'Agricultural footprint of Indian vegetarian & non-veg diets',
      annualKgCO2e: diet.total,
      monthlyKgCO2e: diet.total / 12,
      percentage: getPct(diet.total),
      color: '#16a34a', // emerald-600
      items: diet.items,
    },
    waste: {
      id: 'waste' as const,
      label: 'Waste & Recycling',
      sublabel: 'Municipal dump yard methane and Kabadiwala diversion',
      annualKgCO2e: waste.total,
      monthlyKgCO2e: waste.total / 12,
      percentage: getPct(waste.total),
      color: '#64748b', // slate-500
      items: waste.items,
    },
  };

  const sortedCategories = [
    categories.transportation,
    categories.energy,
    categories.food,
    categories.waste,
  ].sort((a, b) => b.annualKgCO2e - a.annualKgCO2e);

  // Confidence estimation
  let userProvidedCount = 0;
  const totalFieldsCount = 8;
  if (inputs.twoWheelerKmPerWeek > 0 || inputs.twoWheelerType !== 'none') userProvidedCount++;
  if (inputs.carKmPerWeek > 0 || inputs.carType !== 'none') userProvidedCount++;
  if (inputs.metroBusKmPerWeek >= 0) userProvidedCount++;
  if (inputs.railwayKmPerYear >= 0) userProvidedCount++;
  if (inputs.flightHoursPerYear >= 0) userProvidedCount++;
  if (inputs.electricityKWhPerMonth > 0) userProvidedCount++;
  if (inputs.cookingFuelType !== 'none') userProvidedCount++;
  if (inputs.wasteKgPerWeek > 0) userProvidedCount++;

  const confidenceScore = Math.min(100, Math.round((userProvidedCount / totalFieldsCount) * 100));

  const indiaAverageKg = BENCHMARKS.indiaAverageAnnualKg; // 1,900 kg
  const indiaUrbanAverageKg = BENCHMARKS.indiaUrbanAverageAnnualKg; // 3,800 kg

  const comparisonToIndiaAvgPercent = indiaAverageKg > 0
    ? ((totalAnnualKgCO2e - indiaAverageKg) / indiaAverageKg) * 100
    : 0;

  const comparisonToIndiaUrbanPercent = indiaUrbanAverageKg > 0
    ? ((totalAnnualKgCO2e - indiaUrbanAverageKg) / indiaUrbanAverageKg) * 100
    : 0;

  return {
    totalAnnualKgCO2e,
    totalMonthlyKgCO2e,
    totalAnnualTonnesCO2e,
    categories,
    sortedCategories,
    confidenceScore,
    confidenceDetails: {
      totalFieldsCount,
      userProvidedCount,
      estimatedCount: totalFieldsCount - userProvidedCount,
    },
    benchmarks: {
      indiaAverageKg,
      indiaUrbanAverageKg,
      parisTargetKg: BENCHMARKS.parisAgreementTargetKg,
      globalAverageKg: BENCHMARKS.globalAverageAnnualKg,
      comparisonToIndiaAvgPercent,
      comparisonToIndiaUrbanPercent,
    },
    estimatedAnnualExpenditureINR,
  };
}

/**
 * Derives personalized, actionable reduction recommendations for India
 * with verified GHG savings (kg CO₂e) AND annual money savings in ₹ (INR)!
 */
export function deriveReductionStrategies(
  inputs: UserFootprintInputs,
  results: CalculationResults
): ReductionStrategy[] {
  const strategies: ReductionStrategy[] = [];

  // 1. Two-Wheeler: Switch Petrol Bike to Electric Scooter (Ather / Ola / Chetak)
  if (inputs.twoWheelerType === 'petrol_bike' && inputs.twoWheelerKmPerWeek >= 40) {
    const km = inputs.twoWheelerKmPerWeek * 52;
    const petrolEmissions = km * EMISSION_FACTORS.two_wheeler_petrol.factorValue;
    const evEmissions = km * EMISSION_FACTORS.two_wheeler_electric.factorValue;
    const co2Savings = Math.round(petrolEmissions - evEmissions);

    // Petrol saved: km / 50 km/L * ₹102/L minus EV charging: km * 0.025 * ₹7.5
    const petrolCost = (km / 50) * TARIFFS_INR.petrolPerLitre;
    const evChargingCost = km * 0.025 * TARIFFS_INR.electricityPerKWh;
    const moneySavings = Math.round(petrolCost - evChargingCost);

    strategies.push({
      id: 'switch_ev_scooter',
      category: 'transportation',
      title: 'Switch to Electric Two-Wheeler (EV Scooter)',
      impactAnnualKgCO2e: co2Savings,
      annualSavingsINR: moneySavings,
      description: 'Switching from a petrol scooter/bike to an electric two-wheeler cuts running cost from ~₹2.04/km to ₹0.20/km while reducing tailpipe emissions.',
      applicabilityNote: `Based on your driving of ${Math.round(km).toLocaleString()} km/year`,
      isEligible: co2Savings > 40,
    });
  }

  // 2. Rooftop Solar: PM Surya Ghar Muft Bijli Yojana
  if (inputs.rooftopSolarPercent < 60 && inputs.electricityKWhPerMonth >= 150) {
    const householdSize = Math.max(1, inputs.householdSize);
    const potentialKWhSaved = inputs.electricityKWhPerMonth * 12 * 0.8; // 80% solar offset
    const co2Savings = Math.round((potentialKWhSaved * EMISSION_FACTORS.electricity_grid_india.factorValue) / householdSize);
    const moneySavings = Math.round((potentialKWhSaved * TARIFFS_INR.electricityPerKWh) / householdSize);

    strategies.push({
      id: 'rooftop_solar',
      category: 'energy',
      title: 'Install Rooftop Solar (PM Surya Ghar Scheme)',
      impactAnnualKgCO2e: co2Savings,
      annualSavingsINR: moneySavings,
      description: 'Installing a 2kW–3kW rooftop solar system with government capital subsidy covers up to 80% of household electricity, drastically reducing coal grid reliance.',
      applicabilityNote: `Saves ~${Math.round(potentialKWhSaved / householdSize)} units (kWh)/year per person`,
      isEligible: co2Savings > 200,
    });
  }

  // 3. Shift Car Commute to Metro / Local Train (2 days/week)
  if (inputs.carType === 'petrol_diesel' && inputs.carKmPerWeek >= 50) {
    const shiftedKm = inputs.carKmPerWeek * 0.4 * 52; // shift 40% km
    const carSavings = shiftedKm * EMISSION_FACTORS.car_petrol_diesel.factorValue;
    const metroAdded = shiftedKm * EMISSION_FACTORS.metro_local_bus.factorValue;
    const netCo2Savings = Math.round(carSavings - metroAdded);

    const petrolSaved = (shiftedKm / 16) * TARIFFS_INR.petrolPerLitre;
    const metroTicket = shiftedKm * 2.5;
    const netMoneySavings = Math.round(petrolSaved - metroTicket);

    strategies.push({
      id: 'metro_shift',
      category: 'transportation',
      title: 'Shift 2 Days/Week Commute to Metro / Local Train',
      impactAnnualKgCO2e: netCo2Savings,
      annualSavingsINR: netMoneySavings,
      description: 'Taking the Metro or local suburban train for 2 office commutes per week avoids traffic congestion, parking fees, and single-occupancy vehicle emissions.',
      applicabilityNote: `Replaces ~${Math.round(inputs.carKmPerWeek * 0.4)} km/week of driving`,
      isEligible: netCo2Savings > 100,
    });
  }

  // 4. Intercity Travel: Choose Vande Bharat / Rajdhani over Flight
  if (inputs.flightHoursPerYear >= 4) {
    const replacedHours = Math.min(6, Math.round(inputs.flightHoursPerYear * 0.5));
    // 1 flight hour ~ 185 kg vs Train ~ 25 kg
    const co2Savings = Math.round(replacedHours * (EMISSION_FACTORS.air_travel.factorValue - 30));
    const moneySavings = Math.round(replacedHours * 2500); // flight vs train ticket delta

    strategies.push({
      id: 'train_over_flight',
      category: 'transportation',
      title: 'Replace 2 Regional Flights with Vande Bharat Train',
      impactAnnualKgCO2e: co2Savings,
      annualSavingsINR: moneySavings,
      description: 'For popular corridors like Delhi-Varanasi, Mumbai-Goa, or Bengaluru-Chennai, modern electrified express trains produce ~84% lower emissions than short-haul aviation.',
      applicabilityNote: `Replaces ~${replacedHours} domestic flight hours`,
      isEligible: co2Savings > 200,
    });
  }

  // 5. Diet Shift: Pure Vegetarian / Plant-Forward Days
  if (inputs.dietType === 'non_veg_regular' || inputs.dietType === 'non_veg_occasional') {
    const currentKg = inputs.dietType === 'non_veg_regular' ? 2400 : 1850;
    const vegKg = 1350;
    const co2Savings = Math.round((currentKg - vegKg) * 0.6); // 60% transition towards veg
    const moneySavings = 12000; // Average grocery & restaurant meat expenditure savings

    strategies.push({
      id: 'diet_transition',
      category: 'food',
      title: 'Adopt Plant-Forward Diet (3 Meat-Free Days/Week)',
      impactAnnualKgCO2e: co2Savings,
      annualSavingsINR: moneySavings,
      description: 'Increasing pulses, legumes, paneer, and seasonal vegetables reduces livestock feed and methane impacts while significantly cutting grocery bills.',
      applicabilityNote: 'Traditional Indian vegetarian meals require ~40% less land and carbon',
      isEligible: co2Savings > 150,
    });
  }

  // 6. Solid Waste: Segregate Wet Waste & Kabadiwala Circular Recycling
  if (!inputs.segregateAndRecycle && inputs.wasteKgPerWeek >= 4) {
    const co2Savings = Math.round(inputs.wasteKgPerWeek * 52 * (EMISSION_FACTORS.waste_dumpsite_india.factorValue * 0.60));
    const moneySavings = 1500; // Small scrap revenue from newspaper, bottles, cardboard sold to Kabadiwala

    strategies.push({
      id: 'segregate_waste',
      category: 'waste',
      title: 'Segregate Wet Waste & Handover Dry Scrap to Kabadiwala',
      impactAnnualKgCO2e: co2Savings,
      annualSavingsINR: moneySavings,
      description: 'Home composting wet kitchen waste halts methane generation at municipal dumps, while giving dry paper, metals, and plastics to the local Kabadiwala supports circular recycling.',
      applicabilityNote: `Diverts ~60% of your ${Math.round(inputs.wasteKgPerWeek * 52)} kg/yr municipal waste`,
      isEligible: co2Savings > 40,
    });
  }

  return strategies.sort((a, b) => b.impactAnnualKgCO2e - a.impactAnnualKgCO2e);
}

import { EmissionFactorMetadata } from '../types/footprint';

export const EMISSION_FACTORS: Record<string, EmissionFactorMetadata> = {
  // Two-wheelers (Scooters & Motorcycles)
  two_wheeler_petrol: {
    id: 'two_wheeler_petrol',
    category: 'Transportation',
    name: 'Petrol Two-Wheeler (Motorcycle / Scooter)',
    factorValue: 0.040,
    unit: 'kg CO₂e / km',
    source: 'ARAI (Automotive Research Association of India) & BEE',
    referenceYear: 2024,
    geography: 'India',
    notes: 'Based on typical 100cc–150cc 4-stroke commuter bikes and scooters (Activa, Splendor, Jupiter) delivering ~50 km/litre at ₹102/L petrol.',
  },
  two_wheeler_electric: {
    id: 'two_wheeler_electric',
    category: 'Transportation',
    name: 'Electric Two-Wheeler (EV Scooter)',
    factorValue: 0.018,
    unit: 'kg CO₂e / km',
    source: 'BEE India / CEA Grid Lifecycle',
    referenceYear: 2024,
    geography: 'India',
    notes: 'Based on ~0.025 kWh/km energy consumption (Ather, Ola S1, TVS iQube) powered by the Indian national electricity grid.',
  },

  // Four-wheelers (Cars)
  car_petrol_diesel: {
    id: 'car_petrol_diesel',
    category: 'Transportation',
    name: 'Petrol / Diesel Car (Hatchback & Compact SUV)',
    factorValue: 0.155,
    unit: 'kg CO₂e / km',
    source: 'ARAI India / Ministry of Road Transport & Highways (MoRTH)',
    referenceYear: 2024,
    geography: 'India',
    notes: 'Fleet average for Indian passenger cars (Swift, Baleno, Creta, Nexon) with average fuel efficiency of ~16 km/litre.',
  },
  car_cng: {
    id: 'car_cng',
    category: 'Transportation',
    name: 'CNG Passenger Car',
    factorValue: 0.115,
    unit: 'kg CO₂e / km',
    source: 'Indraprastha Gas Limited (IGL) / ARAI India',
    referenceYear: 2024,
    geography: 'India',
    notes: 'Factory-fitted CNG vehicle emissions (WagonR CNG, Ertiga CNG) producing ~25% lower carbon emissions than pure petrol.',
  },
  car_electric: {
    id: 'car_electric',
    category: 'Transportation',
    name: 'Electric Passenger Car (EV)',
    factorValue: 0.086,
    unit: 'kg CO₂e / km',
    source: 'CEA Baseline Carbon Database & Tata Motors EV Data',
    referenceYear: 2024,
    geography: 'India',
    notes: 'Based on 0.12 kWh/km electricity consumption (Tata Nexon EV, Tiago EV) on CEA national grid baseline mix.',
  },

  // Public Transit & Indian Railways
  metro_local_bus: {
    id: 'metro_local_bus',
    category: 'Transportation',
    name: 'City Metro, Suburban Train & City Bus',
    factorValue: 0.032,
    unit: 'kg CO₂e / passenger-km',
    source: 'Delhi Metro Rail Corp (DMRC) & BEST/BMTC Blended',
    referenceYear: 2024,
    geography: 'Indian Metros',
    notes: 'High-occupancy mass urban transit (Delhi Metro, Mumbai Local, Namma Metro, city buses). DMRC reports ~28 g CO₂/p-km.',
  },
  indian_railways: {
    id: 'indian_railways',
    category: 'Transportation',
    name: 'Indian Railways (Intercity Train)',
    factorValue: 0.030,
    unit: 'kg CO₂e / passenger-km',
    source: 'Ministry of Railways & BEE India Mission 100% Electrification',
    referenceYear: 2024,
    geography: 'India',
    notes: 'Electrified intercity express trains, Sleeper, 3-Tier AC, and Vande Bharat services. One of the cleanest intercity transit systems.',
  },

  // Aviation
  air_travel: {
    id: 'air_travel',
    category: 'Transportation',
    name: 'Commercial Air Travel (Passenger-Hour)',
    factorValue: 185.0,
    unit: 'kg CO₂e / flight-hour',
    source: 'DGCA India & UK DEFRA / ICAO Aviation Methodology',
    referenceYear: 2024,
    geography: 'India Domestic & International',
    notes: 'High passenger load factor (~88% IndiGo/Air India A320neo fleet) with radiative forcing multiplier for high-altitude non-CO₂ effects.',
  },

  // Electricity
  electricity_grid_india: {
    id: 'electricity_grid_india',
    category: 'Home Energy',
    name: 'Indian National Electricity Grid Supply (CEA)',
    factorValue: 0.716,
    unit: 'kg CO₂e / kWh (Unit)',
    source: 'Central Electricity Authority (CEA) of India, Version 19 Baseline',
    referenceYear: 2024,
    geography: 'India (NEWNE & Southern Grid Integrated)',
    notes: 'National weighted average grid emission factor for the Indian power sector reflecting current thermal coal generation share.',
  },

  // Cooking Fuel
  lpg_cylinder: {
    id: 'lpg_cylinder',
    category: 'Home Energy',
    name: 'Domestic LPG Cylinder (14.2 kg)',
    factorValue: 42.3,
    unit: 'kg CO₂e / cylinder',
    source: 'Indian Oil / Bharat Petroleum / MoPNG',
    referenceYear: 2024,
    geography: 'India',
    notes: 'Direct combustion of 14.2 kg liquefied petroleum gas (propane/butane mix) emitting 2.98 kg CO₂ per kg LPG.',
  },
  png_piped: {
    id: 'png_piped',
    category: 'Home Energy',
    name: 'Piped Natural Gas (PNG)',
    factorValue: 1.88,
    unit: 'kg CO₂e / SCM (Standard Cubic Metre)',
    source: 'Petroleum & Natural Gas Regulatory Board (PNGRB) / IGL / MGL',
    referenceYear: 2024,
    geography: 'India',
    notes: 'Standard piped natural gas distributed to urban kitchens.',
  },

  // Waste
  waste_dumpsite_india: {
    id: 'waste_dumpsite_india',
    category: 'Waste & Recycling',
    name: 'Municipal Solid Waste (Unmanaged Landfill)',
    factorValue: 0.350,
    unit: 'kg CO₂e / kg waste',
    source: 'CPCB (Central Pollution Control Board) & MoEFCC',
    referenceYear: 2024,
    geography: 'India',
    notes: 'Decomposition in typical municipal dump yards. Segregation and recycling to Kabadiwala diverts ~60% of fugitive methane.',
  },
};

// India-specific and global benchmarks
export const BENCHMARKS = {
  indiaAverageAnnualKg: 1900, // 1.9 tonnes CO2e/year per capita (MoEFCC / World Bank)
  indiaUrbanAverageAnnualKg: 3800, // 3.8 tonnes CO2e/year (CEEW Urban Middle-Class Study)
  parisAgreementTargetKg: 2000, // 2.0 tonnes CO2e/year (Paris 1.5°C Global Target)
  globalAverageAnnualKg: 4700, // 4.7 tonnes CO2e/year
  usAverageAnnualKg: 16000, // 16.0 tonnes CO2e/year
};

// Common Indian utility tariff benchmarks in INR (₹)
export const TARIFFS_INR = {
  petrolPerLitre: 102, // ₹102/L
  electricityPerKWh: 7.5, // Average DISCOM residential tariff (tier ~₹6-9/unit)
  lpgCylinderCost: 850, // ₹850 per 14.2 kg cylinder
  pngPerSCM: 50, // ₹50 per SCM
  cngPerKg: 78, // ₹78 per kg CNG
};

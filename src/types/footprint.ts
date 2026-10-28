export type TwoWheelerType = 'petrol_bike' | 'electric_scooter' | 'none';
export type CarType = 'petrol_diesel' | 'cng' | 'electric' | 'none';
export type CookingFuelType = 'lpg_cylinder' | 'png_piped' | 'electric_induction' | 'none';
export type DietType = 'pure_veg' | 'eggetarian' | 'non_veg_occasional' | 'non_veg_regular' | 'vegan';

export interface UserFootprintInputs {
  // Two-Wheeler Commute (Scooter / Motorcycle)
  twoWheelerType: TwoWheelerType;
  twoWheelerKmPerWeek: number;

  // Four-Wheeler (Car)
  carType: CarType;
  carKmPerWeek: number;

  // Public Transit & Indian Railways
  metroBusKmPerWeek: number; // Metro, local train, city bus (BEST, BMTC, DTC, etc.)
  railwayKmPerYear: number; // Intercity Indian Railways (Sleeper / 3AC / Vande Bharat)

  // Flights
  flightHoursPerYear: number; // Domestic & International flight hours

  // Home Electricity (DISCOM)
  householdSize: number;
  electricityKWhPerMonth: number; // Units (kWh) consumed per month
  rooftopSolarPercent: number; // 0 to 100% rooftop solar / green power

  // Cooking Fuel
  cookingFuelType: CookingFuelType;
  lpgCylindersPerYear: number; // Number of standard 14.2 kg domestic LPG cylinders per year
  pngScmPerMonth: number; // Piped Natural Gas in Standard Cubic Metres (SCM)

  // Food & Dietary Lifestyle
  dietType: DietType;

  // Waste & Circular Economy
  wasteKgPerWeek: number;
  segregateAndRecycle: boolean; // Wet waste composting & dry waste to Kabadiwala
}

export interface EmissionCategoryBreakdown {
  id: 'transportation' | 'energy' | 'food' | 'waste';
  label: string;
  sublabel: string;
  annualKgCO2e: number;
  monthlyKgCO2e: number;
  percentage: number;
  color: string;
  items: {
    name: string;
    annualKgCO2e: number;
    activityData: string;
    emissionFactor: string;
    annualCostINR?: number;
  }[];
}

export interface CalculationResults {
  totalAnnualKgCO2e: number;
  totalMonthlyKgCO2e: number;
  totalAnnualTonnesCO2e: number;
  categories: {
    transportation: EmissionCategoryBreakdown;
    energy: EmissionCategoryBreakdown;
    food: EmissionCategoryBreakdown;
    waste: EmissionCategoryBreakdown;
  };
  sortedCategories: EmissionCategoryBreakdown[];
  confidenceScore: number; // 0 - 100%
  confidenceDetails: {
    totalFieldsCount: number;
    userProvidedCount: number;
    estimatedCount: number;
  };
  benchmarks: {
    indiaAverageKg: number; // ~1,900 kg (1.9 t)
    indiaUrbanAverageKg: number; // ~3,800 kg (3.8 t)
    parisTargetKg: number; // ~2,000 kg (2.0 t)
    globalAverageKg: number; // ~4,700 kg (4.7 t)
    comparisonToIndiaAvgPercent: number;
    comparisonToIndiaUrbanPercent: number;
  };
  estimatedAnnualExpenditureINR: number; // In Indian Rupees (₹)
}

export interface ReductionStrategy {
  id: string;
  category: 'transportation' | 'energy' | 'food' | 'waste';
  title: string;
  impactAnnualKgCO2e: number;
  annualSavingsINR: number; // Money saved in ₹ INR per year
  description: string;
  applicabilityNote: string;
  isEligible: boolean;
}

export interface EmissionFactorMetadata {
  id: string;
  category: string;
  name: string;
  factorValue: number;
  unit: string;
  source: string;
  referenceYear: number;
  geography: string;
  notes: string;
}

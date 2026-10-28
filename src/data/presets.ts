import { UserFootprintInputs } from '../types/footprint';

export interface LifestylePreset {
  id: string;
  name: string;
  cityContext: string;
  badge: string;
  description: string;
  inputs: UserFootprintInputs;
}

export const LIFESTYLE_PRESETS: LifestylePreset[] = [
  {
    id: 'metro_resident',
    name: 'Metro City Resident',
    cityContext: 'Bengaluru / Mumbai / Delhi / Hyderabad',
    badge: 'Tier-1 Metro',
    description: 'Apartment resident commuting via Metro & two-wheeler, moderate AC usage in summer, domestic PNG cooking, and 2 holiday flights per year.',
    inputs: {
      twoWheelerType: 'petrol_bike',
      twoWheelerKmPerWeek: 50,
      carType: 'petrol_diesel',
      carKmPerWeek: 40,
      metroBusKmPerWeek: 45,
      railwayKmPerYear: 1200,
      flightHoursPerYear: 5,
      householdSize: 3,
      electricityKWhPerMonth: 280,
      rooftopSolarPercent: 0,
      cookingFuelType: 'png_piped',
      lpgCylindersPerYear: 0,
      pngScmPerMonth: 12,
      dietType: 'non_veg_occasional',
      wasteKgPerWeek: 12,
      segregateAndRecycle: true,
    },
  },
  {
    id: 'two_wheeler_commuter',
    name: 'Daily Two-Wheeler Commuter',
    cityContext: 'Pune / Chennai / Ahmedabad / Jaipur',
    badge: 'Commuter Baseline',
    description: 'Daily office commute on a 110cc-125cc motorcycle or scooter, Indian Railways for annual hometown vacation, LPG cylinder cooking, and lacto-vegetarian diet.',
    inputs: {
      twoWheelerType: 'petrol_bike',
      twoWheelerKmPerWeek: 120,
      carType: 'none',
      carKmPerWeek: 0,
      metroBusKmPerWeek: 25,
      railwayKmPerYear: 2400,
      flightHoursPerYear: 0,
      householdSize: 4,
      electricityKWhPerMonth: 160,
      rooftopSolarPercent: 0,
      cookingFuelType: 'lpg_cylinder',
      lpgCylindersPerYear: 8,
      pngScmPerMonth: 0,
      dietType: 'pure_veg',
      wasteKgPerWeek: 10,
      segregateAndRecycle: true,
    },
  },
  {
    id: 'eco_conscious_urban',
    name: 'Clean Tech & Low Carbon',
    cityContext: 'Solar Rooftop & EV Mobility',
    badge: 'Panchamrit Climate Aligned',
    description: 'Electric scooter (Ather/Ola) for city trips, public metro, PM Surya Ghar rooftop solar covering 80% electricity, induction cooking, and pure vegetarian diet.',
    inputs: {
      twoWheelerType: 'electric_scooter',
      twoWheelerKmPerWeek: 70,
      carType: 'none',
      carKmPerWeek: 0,
      metroBusKmPerWeek: 50,
      railwayKmPerYear: 1500,
      flightHoursPerYear: 0,
      householdSize: 3,
      electricityKWhPerMonth: 200,
      rooftopSolarPercent: 80,
      cookingFuelType: 'electric_induction',
      lpgCylindersPerYear: 0,
      pngScmPerMonth: 0,
      dietType: 'pure_veg',
      wasteKgPerWeek: 6,
      segregateAndRecycle: true,
    },
  },
  {
    id: 'frequent_traveler_exec',
    name: 'Corporate Frequent Traveler',
    cityContext: 'Intercity Executive',
    badge: 'High Mobility',
    description: 'Regular intercity flights across Indian metros, petrol SUV for daily commute, high air conditioning usage, and regular non-vegetarian dining.',
    inputs: {
      twoWheelerType: 'none',
      twoWheelerKmPerWeek: 0,
      carType: 'petrol_diesel',
      carKmPerWeek: 160,
      metroBusKmPerWeek: 10,
      railwayKmPerYear: 500,
      flightHoursPerYear: 28,
      householdSize: 3,
      electricityKWhPerMonth: 650,
      rooftopSolarPercent: 0,
      cookingFuelType: 'png_piped',
      lpgCylindersPerYear: 0,
      pngScmPerMonth: 18,
      dietType: 'non_veg_regular',
      wasteKgPerWeek: 16,
      segregateAndRecycle: false,
    },
  },
];

export const DEFAULT_INPUTS: UserFootprintInputs = { ...LIFESTYLE_PRESETS[0].inputs };

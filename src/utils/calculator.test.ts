/**
 * Independent automated verification test suite for CarbonTrack India calculations.
 * Run via: npm test (or npx tsx src/utils/calculator.test.ts)
 */

import {
  calculateDiet,
  calculateHomeEnergy,
  calculateTotalFootprint,
  calculateTransportation,
  calculateWaste,
  deriveReductionStrategies,
  sanitizeNumber,
} from './calculator';
import { UserFootprintInputs } from '../types/footprint';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function assertCloseTo(actual: number, expected: number, delta = 0.05, message = '') {
  if (Math.abs(actual - expected) > delta) {
    throw new Error(`Expected ~${expected}, but got ${actual}. ${message}`);
  }
}

export function runAllTests() {
  console.log('🧪 Starting CarbonTrack India Calculation Verification Suite...\n');

  // Test 1: Sanitize Number
  console.log('Test 1: Input sanitization & bounds handling');
  assert(sanitizeNumber(-15, 0) === 0, 'Negative numbers clamped to min');
  assert(sanitizeNumber(NaN, 10) === 10, 'NaN fallback');
  assert(sanitizeNumber(125, 0) === 125, 'Valid input preserved');
  console.log('✓ Test 1 passed.');

  // Test 2: Indian Two-Wheeler Commuter Baseline
  console.log('\nTest 2: Two-Wheeler Commuter (Pune/Jaipur baseline)');
  // 120 km/wk petrol bike @ 0.040 = 249.6 kg
  // Metro/bus 25 km/wk @ 0.032 = 41.6 kg
  // Railways 2,400 km/yr @ 0.030 = 72.0 kg
  // Flights 0
  // Transport total = 249.6 + 41.6 + 72.0 = 363.2 kg
  // Electricity: 160 kWh/mo * 12 * 0.716 / 4 people = 343.68 kg
  // LPG: 8 cylinders * 42.3 / 4 people = 84.6 kg
  // Home Energy total = 343.68 + 84.6 = 428.28 kg
  // Diet: Pure Vegetarian = 1,350 kg
  // Waste: 10 kg/wk * 52 * (0.350 * 0.40) = 72.8 kg (with segregation)
  // Grand Total = 363.2 + 428.28 + 1350 + 72.8 = 2,214.28 kg CO2e / year (~2.21 tonnes)
  const commuterInput: UserFootprintInputs = {
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
  };

  const commuterResult = calculateTotalFootprint(commuterInput);
  assertCloseTo(commuterResult.categories.transportation.annualKgCO2e, 363.2, 0.1, 'Transportation total');
  assertCloseTo(commuterResult.categories.energy.annualKgCO2e, 428.28, 0.1, 'Home energy total');
  assertCloseTo(commuterResult.categories.food.annualKgCO2e, 1350.0, 0.1, 'Diet total');
  assertCloseTo(commuterResult.categories.waste.annualKgCO2e, 72.8, 0.1, 'Waste total');
  assertCloseTo(commuterResult.totalAnnualKgCO2e, 2214.28, 0.1, 'Grand total annual emissions');
  assertCloseTo(commuterResult.totalAnnualTonnesCO2e, 2.214, 0.01, 'Annual tonnes');
  console.log('✓ Test 2 passed.');

  // Test 3: Rooftop Solar Elimination of Grid Coal Power
  console.log('\nTest 3: PM Surya Ghar Rooftop Solar generation');
  const solarInput: UserFootprintInputs = {
    ...commuterInput,
    rooftopSolarPercent: 100, // 100% solar
  };
  const solarEnergy = calculateHomeEnergy(solarInput);
  assertCloseTo(solarEnergy.items[0].annualKgCO2e, 0, 0.01, '100% rooftop solar yields 0 grid power emissions');
  assertCloseTo(solarEnergy.total, 84.6, 0.01, 'Only LPG cylinder remains');
  console.log('✓ Test 3 passed.');

  // Test 4: Powertrain Comparisons (Petrol vs Electric Scooter)
  console.log('\nTest 4: Two-Wheeler EV vs Petrol comparison');
  const kmWeek = 100; // 5,200 km/yr
  const petrolTrans = calculateTransportation({ ...commuterInput, twoWheelerKmPerWeek: kmWeek, twoWheelerType: 'petrol_bike', metroBusKmPerWeek: 0, railwayKmPerYear: 0 });
  const evTrans = calculateTransportation({ ...commuterInput, twoWheelerKmPerWeek: kmWeek, twoWheelerType: 'electric_scooter', metroBusKmPerWeek: 0, railwayKmPerYear: 0 });

  assertCloseTo(petrolTrans.total, 5200 * 0.040, 0.01, 'Petrol bike emissions (208 kg)');
  assertCloseTo(evTrans.total, 5200 * 0.018, 0.01, 'EV scooter emissions (93.6 kg)');
  assert(evTrans.total < petrolTrans.total, 'EV scooter must emit less than petrol bike');
  console.log('✓ Test 4 passed.');

  // Test 5: Indian Benchmarks (National ~1.9t, Urban ~3.8t)
  console.log('\nTest 5: Indian National and Urban benchmarks');
  assert(commuterResult.benchmarks.indiaAverageKg === 1900, 'India national average is 1.9 tonnes');
  assert(commuterResult.benchmarks.indiaUrbanAverageKg === 3800, 'India urban average is 3.8 tonnes');
  console.log('✓ Test 5 passed.');

  // Test 6: Zero boundary conditions
  console.log('\nTest 6: Boundary condition (Zero inputs)');
  const zeroInput: UserFootprintInputs = {
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
    dietType: 'vegan',
    wasteKgPerWeek: 0,
    segregateAndRecycle: true,
  };
  const zeroResult = calculateTotalFootprint(zeroInput);
  // Diet has baseline 1,050 kg for human sustenance
  assert(zeroResult.categories.transportation.annualKgCO2e === 0, 'Zero transportation');
  assert(zeroResult.categories.energy.annualKgCO2e === 0, 'Zero home energy');
  assert(zeroResult.categories.waste.annualKgCO2e === 0, 'Zero waste');
  console.log('✓ Test 6 passed.');

  // Test 7: Reduction Strategies with INR (₹) Money Savings
  console.log('\nTest 7: Reduction strategies with INR currency savings');
  const strategies = deriveReductionStrategies(commuterInput, commuterResult);
  assert(strategies.length > 0, 'Strategies derived');
  // First strategy must have both emissions savings and money savings
  assert(strategies[0].impactAnnualKgCO2e > 0, 'Positive CO2 impact');
  assert(strategies[0].annualSavingsINR > 0, 'Positive INR money savings');
  console.log('✓ Test 7 passed.');

  console.log('\n🎉 ALL 7 INDIA CALCULATION VERIFICATION TESTS PASSED!');
}

if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('calculator.test.ts')) {
  try {
    runAllTests();
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  }
}

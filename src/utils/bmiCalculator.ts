
// BMI calculator utilities

// Calculate BMI from weight in kg and height in cm
export const calculateBMI = (weight: number, heightCm: number): number => {
  if (!weight || !heightCm || heightCm === 0) return 0;
  
  const heightM = heightCm / 100;
  return weight / (heightM * heightM);
};

// Get BMI category based on BMI value
export const getBMICategory = (bmi: number): string => {
  if (bmi === 0) return "-";
  if (bmi < 18.5) return "Kekurangan berat badan";
  if (bmi < 25) return "Berat badan normal";
  if (bmi < 30) return "Kelebihan berat badan";
  return "Obesitas";
};

// Get BMI color based on BMI value
export const getBMIColor = (bmi: number): string => {
  if (bmi === 0) return "text-gray-500";
  if (bmi < 18.5) return "text-health-info";
  if (bmi < 25) return "text-health-primary";
  if (bmi < 30) return "text-health-warning";
  return "text-health-danger";
};

// Calculate weight from BMI and height
export const calculateWeightFromBMI = (bmi: number, heightCm: number): number => {
  if (!bmi || !heightCm) return 0;
  
  const heightM = heightCm / 100;
  return bmi * (heightM * heightM);
};

// Calculate time to reach target BMI based on current BMI, target BMI, and rate of change
export const calculateTimeToTargetBMI = (
  currentBMI: number,
  targetBMI: number,
  heightCm: number,
  weightChangeRate: number // kg per week
): number => {
  if (!currentBMI || !targetBMI || !heightCm || !weightChangeRate || weightChangeRate === 0) return 0;
  
  const heightM = heightCm / 100;
  const heightSquared = heightM * heightM;
  
  // Calculate BMI change rate using dBMI/dt = (1/H²) * dW/dt
  const bmiChangeRate = (1 / heightSquared) * weightChangeRate;
  
  // Calculate time to reach target using t = ΔBMI / (dBMI/dt)
  const bmiDifference = Math.abs(targetBMI - currentBMI);
  const timeWeeks = bmiDifference / Math.abs(bmiChangeRate);
  
  return timeWeeks;
};

// Calculate daily calorie adjustment needed for weight goal
export const calculateCalorieAdjustment = (weightChangeRate: number): number => {
  // Approximately 7700 calories = 1 kg of body fat
  // So to lose/gain 1kg per week, need 7700 / 7 = 1100 calories per day
  return weightChangeRate * 1100;
};

// Calculate Basal Metabolic Rate (BMR) using Harris-Benedict Equation
export const calculateBMR = (
  weight: number,
  heightCm: number,
  age: number,
  isMale: boolean
): number => {
  if (!weight || !heightCm || !age) return 0;
  
  if (isMale) {
    return 88.362 + (13.397 * weight) + (4.799 * heightCm) - (5.677 * age);
  } else {
    return 447.593 + (9.247 * weight) + (3.098 * heightCm) - (4.330 * age);
  }
};

// Calculate Total Daily Energy Expenditure (TDEE)
export const calculateTDEE = (bmr: number, activityMultiplier: number): number => {
  return bmr * activityMultiplier;
};

// Activity level multipliers
export const activityLevels = [
  { label: "Tidak aktif (aktivitas minimal)", value: 1.2 },
  { label: "Sedikit aktif (olahraga 1-3 kali/minggu)", value: 1.375 },
  { label: "Cukup aktif (olahraga 3-5 kali/minggu)", value: 1.55 },
  { label: "Sangat aktif (olahraga 6-7 kali/minggu)", value: 1.725 },
  { label: "Ekstra aktif (olahraga berat, pekerjaan fisik)", value: 1.9 }
];

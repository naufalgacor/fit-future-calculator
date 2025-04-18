
import React, { useState, useEffect } from 'react';
import { 
  calculateBMI, 
  getBMICategory, 
  getBMIColor, 
  calculateTimeToTargetBMI,
  calculateCalorieAdjustment,
  calculateBMR,
  calculateTDEE,
  activityLevels
} from '@/utils/bmiCalculator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import BmiResultDisplay from './BmiResultDisplay';
import WeightTimeline from './WeightTimeline';
import NutritionPlan from './NutritionPlan';
import { toast } from '@/hooks/use-toast';

interface BmiCalculatorProps {}

const BmiCalculator: React.FC<BmiCalculatorProps> = () => {
  // Personal info
  const [weight, setWeight] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [age, setAge] = useState<number>(25);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activityLevel, setActivityLevel] = useState<number>(1.2);
  
  // Goal settings
  const [goalType, setGoalType] = useState<'weight' | 'bmi'>('weight');
  const [targetWeight, setTargetWeight] = useState<number>(0);
  const [targetBMI, setTargetBMI] = useState<number>(22);
  const [weightChangeRate, setWeightChangeRate] = useState<number>(0.5);
  
  // Food preferences
  const [foodPreference, setFoodPreference] = useState<'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian'>('omnivore');
  
  // Calculation results
  const [currentBMI, setCurrentBMI] = useState<number>(0);
  const [timePrediction, setTimePrediction] = useState<number>(0);
  const [calorieAdjustment, setCalorieAdjustment] = useState<number>(0);
  const [tdee, setTDEE] = useState<number>(0);
  const [dailyCalories, setDailyCalories] = useState<number>(0);
  
  // Calculate current BMI when weight or height changes
  useEffect(() => {
    const bmi = calculateBMI(weight, height);
    setCurrentBMI(bmi);
  }, [weight, height]);
  
  // Calculate TDEE when relevant factors change
  useEffect(() => {
    const bmr = calculateBMR(weight, height, age, gender === 'male');
    const calculatedTDEE = calculateTDEE(bmr, activityLevel);
    setTDEE(calculatedTDEE);
  }, [weight, height, age, gender, activityLevel]);
  
  // Handle calculation of predictions
  const calculatePredictions = () => {
    // Validate inputs
    if (!weight || !height) {
      toast({
        title: "Input tidak lengkap",
        description: "Mohon lengkapi berat badan dan tinggi badan terlebih dahulu.",
        variant: "destructive"
      });
      return;
    }
    
    // Calculate target metrics
    let effectiveTargetBMI = targetBMI;
    let effectiveTargetWeight = targetWeight;
    
    if (goalType === 'weight' && targetWeight) {
      effectiveTargetBMI = calculateBMI(targetWeight, height);
    } else if (goalType === 'bmi') {
      effectiveTargetWeight = (targetBMI * (height / 100) * (height / 100));
    }
    
    // Determine if gaining or losing
    const isGaining = effectiveTargetWeight > weight;
    const effectiveRate = isGaining ? weightChangeRate : -weightChangeRate;
    
    // Calculate time prediction
    const weeks = calculateTimeToTargetBMI(
      currentBMI,
      effectiveTargetBMI,
      height,
      effectiveRate
    );
    
    // Calculate calorie adjustment
    const calorieAdj = calculateCalorieAdjustment(effectiveRate);
    const dailyCals = Math.round(tdee + calorieAdj);
    
    // Update state
    setTimePrediction(weeks);
    setCalorieAdjustment(calorieAdj);
    setDailyCalories(dailyCals);
    
    // Show success message
    toast({
      title: "Kalkulasi selesai",
      description: `Target bisa dicapai dalam ${Math.ceil(weeks)} minggu dengan asupan ${dailyCals} kalori per hari.`,
    });
  };
  
  // Handle input changes
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setWeight(isNaN(value) ? 0 : value);
  };
  
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setHeight(isNaN(value) ? 0 : value);
  };
  
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setAge(isNaN(value) ? 25 : value);
  };
  
  const handleTargetWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setTargetWeight(isNaN(value) ? 0 : value);
  };
  
  const handleTargetBMIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setTargetBMI(isNaN(value) ? 22 : value);
  };
  
  // Determine weight goal type
  const weightGoalType = targetWeight > weight ? 'gain' : (targetWeight < weight ? 'lose' : 'maintain');
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-health-primary">Fit Future Calculator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Input Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-health-primary">Data Diri</CardTitle>
              <CardDescription>Masukkan data diri Anda untuk perhitungan yang akurat</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Berat Badan (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={weight || ''}
                    onChange={handleWeightChange}
                    placeholder="Misal: 70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Tinggi Badan (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={height || ''}
                    onChange={handleHeightChange}
                    placeholder="Misal: 170"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Usia</Label>
                  <Input
                    id="age"
                    type="number"
                    value={age || ''}
                    onChange={handleAgeChange}
                    placeholder="Misal: 25"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Jenis Kelamin</Label>
                  <RadioGroup 
                    defaultValue={gender} 
                    onValueChange={(value) => setGender(value as 'male' | 'female')}
                    className="flex items-center space-x-4 pt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Pria</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Wanita</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="activity">Tingkat Aktivitas</Label>
                <Select 
                  value={activityLevel.toString()} 
                  onValueChange={(value) => setActivityLevel(parseFloat(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tingkat aktivitas" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value.toString()}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-health-primary">Target</CardTitle>
              <CardDescription>Tentukan target dan preferensi Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="weight" onValueChange={(value) => setGoalType(value as 'weight' | 'bmi')}>
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="weight">Target Berat</TabsTrigger>
                  <TabsTrigger value="bmi">Target IMT</TabsTrigger>
                </TabsList>
                <TabsContent value="weight" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetWeight">Target Berat Badan (kg)</Label>
                    <Input
                      id="targetWeight"
                      type="number"
                      value={targetWeight || ''}
                      onChange={handleTargetWeightChange}
                      placeholder="Misal: 65"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="bmi" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetBMI">Target IMT</Label>
                    <Input
                      id="targetBMI"
                      type="number"
                      value={targetBMI || ''}
                      onChange={handleTargetBMIChange}
                      placeholder="Misal: 22"
                    />
                    <p className="text-sm text-muted-foreground">
                      Rekomendasi IMT normal: 18.5 - 24.9
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="space-y-2">
                <Label htmlFor="weightChangeRate" className="flex justify-between">
                  <span>Laju Perubahan Berat (kg/minggu)</span>
                  <span className="font-medium">{weightChangeRate} kg</span>
                </Label>
                <Slider
                  id="weightChangeRate"
                  min={0.1}
                  max={1}
                  step={0.1}
                  value={[weightChangeRate]}
                  onValueChange={(value) => setWeightChangeRate(value[0])}
                />
                <p className="text-sm text-muted-foreground">
                  Direkomendasikan 0.5 - 1 kg per minggu untuk perubahan yang sehat
                </p>
              </div>
              
              <div className="space-y-2 pt-2">
                <Label htmlFor="foodPreference">Preferensi Makanan</Label>
                <Select 
                  value={foodPreference} 
                  onValueChange={(value) => setFoodPreference(value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih preferensi makanan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="omnivore">Omnivora (Semua makanan)</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian (Tanpa daging)</SelectItem>
                    <SelectItem value="vegan">Vegan (Tanpa produk hewani)</SelectItem>
                    <SelectItem value="pescatarian">Pescatarian (Ikan, tanpa daging lain)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-health-primary hover:bg-health-secondary" 
                onClick={calculatePredictions}
              >
                Hitung
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Right Column - Results */}
        <div className="space-y-6">
          <BmiResultDisplay 
            currentBMI={currentBMI} 
            targetBMI={goalType === 'bmi' ? targetBMI : calculateBMI(targetWeight, height)}
            currentWeight={weight}
            targetWeight={goalType === 'weight' ? targetWeight : (targetBMI * (height / 100) * (height / 100))}
          />
          
          {timePrediction > 0 && (
            <>
              <WeightTimeline 
                currentWeight={weight}
                targetWeight={goalType === 'weight' ? targetWeight : (targetBMI * (height / 100) * (height / 100))}
                weeksPrediction={timePrediction}
                weightChangeRate={targetWeight > weight ? weightChangeRate : -weightChangeRate}
              />
              
              <NutritionPlan 
                tdee={tdee}
                dailyCalories={dailyCalories}
                goalType={weightGoalType === 'gain' ? 'gain' : (weightGoalType === 'lose' ? 'lose' : 'maintain')}
                foodPreference={foodPreference}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BmiCalculator;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getFoodRecommendations, getExerciseRecommendations, FoodPreference } from '@/utils/foodRecommendations';

interface NutritionPlanProps {
  tdee: number;
  dailyCalories: number;
  goalType: 'lose' | 'gain' | 'maintain';
  foodPreference: FoodPreference;
}

const NutritionPlan: React.FC<NutritionPlanProps> = ({
  tdee,
  dailyCalories,
  goalType,
  foodPreference
}) => {
  const foodRecommendations = getFoodRecommendations(goalType, foodPreference, dailyCalories);
  const exerciseRecommendations = getExerciseRecommendations(goalType);
  
  // Calculate macronutrient distribution based on goal
  let proteinPercentage = 0;
  let carbsPercentage = 0;
  let fatsPercentage = 0;
  
  if (goalType === 'lose') {
    proteinPercentage = 35;
    carbsPercentage = 35;
    fatsPercentage = 30;
  } else if (goalType === 'gain') {
    proteinPercentage = 25;
    carbsPercentage = 50;
    fatsPercentage = 25;
  } else { // maintain
    proteinPercentage = 30;
    carbsPercentage = 40;
    fatsPercentage = 30;
  }
  
  // Calculate grams per macronutrient
  // Protein and carbs = 4 calories per gram, fat = 9 calories per gram
  const proteinGrams = Math.round((dailyCalories * (proteinPercentage / 100)) / 4);
  const carbsGrams = Math.round((dailyCalories * (carbsPercentage / 100)) / 4);
  const fatsGrams = Math.round((dailyCalories * (fatsPercentage / 100)) / 9);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-health-primary">Rencana Nutrisi & Aktivitas</CardTitle>
        <CardDescription>
          Rekomendasi nutrisi dan aktivitas untuk mencapai target Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-health-highlight rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm font-medium">TDEE</p>
            <p className="text-xl font-bold">{Math.round(tdee)} kkal</p>
            <p className="text-xs text-muted-foreground">Pengeluaran energi harian</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Target Kalori</p>
            <p className="text-xl font-bold">{Math.round(dailyCalories)} kkal</p>
            <p className="text-xs text-muted-foreground">
              {goalType === 'lose' ? 'Defisit' : goalType === 'gain' ? 'Surplus' : 'Seimbang'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Penyesuaian</p>
            <p className="text-xl font-bold">
              {Math.abs(Math.round(dailyCalories - tdee))} kkal
            </p>
            <p className="text-xs text-muted-foreground">
              {dailyCalories > tdee ? 'Tambahan' : 'Pengurangan'} kalori harian
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Distribusi Makronutrien</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 border rounded-lg text-center">
              <p className="text-sm">Protein</p>
              <p className="text-lg font-bold">{proteinGrams}g</p>
              <p className="text-xs text-muted-foreground">{proteinPercentage}%</p>
              <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                <div 
                  className="h-2 bg-health-primary rounded-full" 
                  style={{ width: `${proteinPercentage}%` }}
                />
              </div>
            </div>
            <div className="p-3 border rounded-lg text-center">
              <p className="text-sm">Karbohidrat</p>
              <p className="text-lg font-bold">{carbsGrams}g</p>
              <p className="text-xs text-muted-foreground">{carbsPercentage}%</p>
              <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                <div 
                  className="h-2 bg-health-info rounded-full" 
                  style={{ width: `${carbsPercentage}%` }}
                />
              </div>
            </div>
            <div className="p-3 border rounded-lg text-center">
              <p className="text-sm">Lemak</p>
              <p className="text-lg font-bold">{fatsGrams}g</p>
              <p className="text-xs text-muted-foreground">{fatsPercentage}%</p>
              <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                <div 
                  className="h-2 bg-health-warning rounded-full" 
                  style={{ width: `${fatsPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="food">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="food">Rekomendasi Makanan</TabsTrigger>
            <TabsTrigger value="exercise">Rekomendasi Aktivitas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="food">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Rekomendasi Makanan Harian</h3>
              
              <div className="bg-health-light rounded-lg p-3 mt-2">
                <h4 className="font-medium">Sarapan</h4>
                <ul className="mt-1 space-y-1">
                  {foodRecommendations.breakfast.map((food, index) => (
                    <li key={index} className="text-sm">
                      • {food.name} ({food.caloriesPer100g} kkal per 100g)
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-health-light rounded-lg p-3">
                <h4 className="font-medium">Makan Siang</h4>
                <ul className="mt-1 space-y-1">
                  {foodRecommendations.lunch.map((food, index) => (
                    <li key={index} className="text-sm">
                      • {food.name} ({food.caloriesPer100g} kkal per 100g)
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-health-light rounded-lg p-3">
                <h4 className="font-medium">Makan Malam</h4>
                <ul className="mt-1 space-y-1">
                  {foodRecommendations.dinner.map((food, index) => (
                    <li key={index} className="text-sm">
                      • {food.name} ({food.caloriesPer100g} kkal per 100g)
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-health-light rounded-lg p-3">
                <h4 className="font-medium">Camilan</h4>
                <ul className="mt-1 space-y-1">
                  {foodRecommendations.snacks.map((food, index) => (
                    <li key={index} className="text-sm">
                      • {food.name} ({food.caloriesPer100g} kkal per 100g)
                    </li>
                  ))}
                </ul>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                Catatan: Rekomendasi ini bersifat umum. Konsultasikan dengan ahli gizi
                untuk rencana nutrisi yang lebih personal.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="exercise">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Rekomendasi Aktivitas Fisik</h3>
              
              <div className="bg-health-light rounded-lg p-4">
                <ul className="space-y-3">
                  {exerciseRecommendations.map((exercise, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-6 h-6 rounded-full bg-health-primary text-white flex items-center justify-center text-sm mr-2">
                        {index + 1}
                      </span>
                      <span>{exercise}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                Catatan: Mulailah perlahan jika Anda baru memulai berolahraga. Konsultasikan dengan profesional 
                kesehatan sebelum memulai program latihan baru.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NutritionPlan;

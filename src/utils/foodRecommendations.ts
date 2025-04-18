
// Food recommendation utilities

export type FoodPreference = 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian';

export interface FoodItem {
  name: string;
  category: 'protein' | 'carbs' | 'fats' | 'vegetables' | 'fruits';
  caloriesPer100g: number;
  protein: number; // grams per 100g
  carbs: number; // grams per 100g
  fats: number; // grams per 100g
  fiber: number; // grams per 100g
  suitableFor: FoodPreference[];
}

export const foodDatabase: FoodItem[] = [
  // Protein sources
  { name: 'Dada Ayam', category: 'protein', caloriesPer100g: 165, protein: 31, carbs: 0, fats: 3.6, fiber: 0, suitableFor: ['omnivore'] },
  { name: 'Telur', category: 'protein', caloriesPer100g: 155, protein: 13, carbs: 1.1, fats: 11, fiber: 0, suitableFor: ['omnivore', 'vegetarian', 'pescatarian'] },
  { name: 'Ikan Salmon', category: 'protein', caloriesPer100g: 206, protein: 22, carbs: 0, fats: 13, fiber: 0, suitableFor: ['omnivore', 'pescatarian'] },
  { name: 'Tahu', category: 'protein', caloriesPer100g: 76, protein: 8, carbs: 1.9, fats: 4.8, fiber: 0.3, suitableFor: ['omnivore', 'vegetarian', 'vegan', 'pescatarian'] },
  { name: 'Tempe', category: 'protein', caloriesPer100g: 193, protein: 19, carbs: 8.8, fats: 11, fiber: 1.4, suitableFor: ['omnivore', 'vegetarian', 'vegan', 'pescatarian'] },
  
  // Carbs sources
  { name: 'Nasi', category: 'carbs', caloriesPer100g: 130, protein: 2.7, carbs: 28, fats: 0.3, fiber: 0.4, suitableFor: ['omnivore', 'vegetarian', 'vegan', 'pescatarian'] },
  { name: 'Ubi Jalar', category: 'carbs', caloriesPer100g: 86, protein: 1.6, carbs: 20, fats: 0.1, fiber: 3, suitableFor: ['omnivore', 'vegetarian', 'vegan', 'pescatarian'] },
  { name: 'Kentang', category: 'carbs', caloriesPer100g: 77, protein: 2, carbs: 17, fats: 0.1, fiber: 2.2, suitableFor: ['omnivore', 'vegetarian', 'vegan', 'pescatarian'] },
  { name: 'Oatmeal', category: 'carbs', caloriesPer100g: 68, protein: 2.4, carbs: 12, fats: 1.4, fiber: 1.7, suitableFor: ['omnivore', 'vegetarian', 'vegan', 'pescatarian'] },
  { name: 'Roti Gandum', category: 'carbs', caloriesPer100g: 247, protein: 9.7, carbs: 41, fats: 3.6, fiber: 7, suitableFor: ['omnivore', 'vegetarian', 'vegan', 'pescatarian'] },
  
  // Fats sources
  { name: 'Alpukat', category: 'fats', caloriesPer100g: 160, protein: 2, carbs: 8.5, fats: 15, fiber: 6.7, suitableFor: ['omnivore', 'vegetarian', 'vegan', 'pescatarian'] },
  { name: 'Minyak Zaitun', category: 'fats', caloriesPer100g: 884, protein: 0, carbs: 0, fats: 100, fiber: 0, suitableFor: ['omnivore', 'vegetarian', 'vegan', 'pescatarian'] },
  { name: 'Kacang Almond', category: 'fats', caloriesPer100g: 579, protein: 21, carbs: 22, fats: 50, fiber: 12, suitableFor: ['omnivore', 'vegetarian', 'vegan', 'pescatarian'] },
  
  // Vegetables
  { name: 'Brokoli', category: 'vegetables', caloriesPer100g: 34, protein: 2.8, carbs: 7, fats: 0.4, fiber: 2.6, suitableFor: ['omnivore', 'vegetarian', 'vegan', 'pescatarian'] },
  { name: 'Bayam', category: 'vegetables', caloriesPer100g: 23, protein: 2.9, carbs: 3.6, fats: 0.4, fiber: 2.2, suitableFor: ['omnivore', 'vegetarian', 'vegan', 'pescatarian'] },
  { name: 'Wortel', category: 'vegetables', caloriesPer100g: 41, protein: 0.9, carbs: 10, fats: 0.2, fiber: 2.8, suitableFor: ['omnivore', 'vegetarian', 'vegan', 'pescatarian'] },
  
  // Fruits
  { name: 'Pisang', category: 'fruits', caloriesPer100g: 89, protein: 1.1, carbs: 23, fats: 0.3, fiber: 2.6, suitableFor: ['omnivore', 'vegetarian', 'vegan', 'pescatarian'] },
  { name: 'Apel', category: 'fruits', caloriesPer100g: 52, protein: 0.3, carbs: 14, fats: 0.2, fiber: 2.4, suitableFor: ['omnivore', 'vegetarian', 'vegan', 'pescatarian'] },
  { name: 'Jeruk', category: 'fruits', caloriesPer100g: 47, protein: 0.9, carbs: 12, fats: 0.1, fiber: 2.4, suitableFor: ['omnivore', 'vegetarian', 'vegan', 'pescatarian'] }
];

export const getFoodRecommendations = (
  goalType: 'lose' | 'gain' | 'maintain', 
  foodPreference: FoodPreference,
  calorieTarget: number
): { 
  breakfast: FoodItem[], 
  lunch: FoodItem[], 
  dinner: FoodItem[], 
  snacks: FoodItem[] 
} => {
  // Filter foods based on user preferences
  const suitableFoods = foodDatabase.filter(food => 
    food.suitableFor.includes(foodPreference)
  );
  
  // Get foods by category
  const proteins = suitableFoods.filter(food => food.category === 'protein');
  const carbs = suitableFoods.filter(food => food.category === 'carbs');
  const fats = suitableFoods.filter(food => food.category === 'fats');
  const vegetables = suitableFoods.filter(food => food.category === 'vegetables');
  const fruits = suitableFoods.filter(food => food.category === 'fruits');
  
  // Create recommendations based on goal
  if (goalType === 'lose') {
    return {
      breakfast: [...proteins.slice(0, 1), ...carbs.slice(0, 1), ...fruits.slice(0, 1)],
      lunch: [...proteins.slice(0, 1), ...vegetables.slice(0, 2), ...carbs.slice(0, 1)],
      dinner: [...proteins.slice(0, 1), ...vegetables.slice(0, 2), ...fats.slice(0, 1)],
      snacks: [...fruits.slice(0, 2)]
    };
  } else if (goalType === 'gain') {
    return {
      breakfast: [...proteins.slice(0, 1), ...carbs.slice(0, 2), ...fats.slice(0, 1), ...fruits.slice(0, 1)],
      lunch: [...proteins.slice(0, 2), ...carbs.slice(0, 1), ...vegetables.slice(0, 1), ...fats.slice(0, 1)],
      dinner: [...proteins.slice(0, 2), ...carbs.slice(0, 1), ...vegetables.slice(0, 1), ...fats.slice(0, 1)],
      snacks: [...proteins.slice(0, 1), ...fruits.slice(0, 1), ...fats.slice(0, 1)]
    };
  } else { // maintain
    return {
      breakfast: [...proteins.slice(0, 1), ...carbs.slice(0, 1), ...fruits.slice(0, 1)],
      lunch: [...proteins.slice(0, 1), ...carbs.slice(0, 1), ...vegetables.slice(0, 2)],
      dinner: [...proteins.slice(0, 1), ...carbs.slice(0, 1), ...vegetables.slice(0, 1), ...fats.slice(0, 1)],
      snacks: [...fruits.slice(0, 1), ...fats.slice(0, 1)]
    };
  }
};

export const getExerciseRecommendations = (
  goalType: 'lose' | 'gain' | 'maintain'
): string[] => {
  if (goalType === 'lose') {
    return [
      'Kardio: 30-45 menit, 3-5 kali seminggu (jogging, bersepeda, berenang)',
      'HIIT: 20-30 menit, 2-3 kali seminggu',
      'Angkat beban: 2-3 kali seminggu, fokus pada latihan seluruh tubuh',
      'Jalan kaki minimal 7.000-10.000 langkah setiap hari'
    ];
  } else if (goalType === 'gain') {
    return [
      'Angkat beban: 3-5 kali seminggu, fokus pada latihan progresif',
      'Kardio ringan: 20-30 menit, 2-3 kali seminggu untuk kesehatan jantung',
      'Fokus pada latihan compound (squat, deadlift, bench press)',
      'Prioritaskan istirahat dan pemulihan antara sesi latihan'
    ];
  } else { // maintain
    return [
      'Kombinasi kardio dan latihan kekuatan, 3-4 kali seminggu',
      'Aktivitas yang menyenangkan seperti olahraga tim, bersepeda, atau hiking',
      'Yoga atau pilates untuk kelenturan dan kekuatan inti',
      'Jalan kaki harian minimal 7.000 langkah'
    ];
  }
};

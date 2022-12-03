export interface Nutrition {
  calories: number;
  date: number;
  foodId: string;
  food: string;
  meal: string;
  quantity: number;
  unitId: string;
  unit: string;
  userId: string;
}

export type NutritionRow = Nutrition & {
  food: string;
  unit: string;
  id: string;
};

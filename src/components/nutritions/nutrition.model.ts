export interface Nutrition {
  calories: number;
  dateConsumed: Date;
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
};

export interface Activity {
  id: string;
  exerciseId: string;
  calories: number;
  time: number;
  timeUnitId: string;
  userId: string;
  date: number
 }
  
 export type ActivityRow = Activity & {
  exercise: string;
  unit: string;
 };
 
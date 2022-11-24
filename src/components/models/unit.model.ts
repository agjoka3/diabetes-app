export interface Unit {
  id: string;
  description: string;
  unit: string;
  type: "quantity" | "time";
  baseConversion: string;
  conversionValue: number;
}

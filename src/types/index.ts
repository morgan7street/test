export interface Food {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  quantity: number
  unit: 'g' | 'mL' | 'P'
  nutriscore?: string
  createdAt: Date
}

export interface NutritionInfo {
  name?: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  nutriscore?: string
}

export interface DailyTotals {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
}

export type Unit = 'g' | 'mL' | 'P'

export interface UserSettings {
  calorieLimit: number
}
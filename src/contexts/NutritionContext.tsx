import React, { createContext, useContext, useState, useEffect } from 'react'
import { Food, DailyTotals, UserSettings } from '../types'

interface NutritionContextType {
  foods: Food[]
  dailyTotals: DailyTotals
  settings: UserSettings
  addFood: (food: Omit<Food, 'id' | 'createdAt'>) => void
  removeFood: (id: string) => void
  updateSettings: (settings: Partial<UserSettings>) => void
  isLoading: boolean
}

const NutritionContext = createContext<NutritionContextType | undefined>(undefined)

export function useNutrition() {
  const context = useContext(NutritionContext)
  if (!context) {
    throw new Error('useNutrition must be used within a NutritionProvider')
  }
  return context
}

export function NutritionProvider({ children }: { children: React.ReactNode }) {
  const [foods, setFoods] = useState<Food[]>([])
  const [settings, setSettings] = useState<UserSettings>({ calorieLimit: 2000 })
  const [isLoading, setIsLoading] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedFoods = localStorage.getItem('nutrition-foods')
    const savedSettings = localStorage.getItem('nutrition-settings')
    
    if (savedFoods) {
      try {
        const parsedFoods = JSON.parse(savedFoods).map((food: any) => ({
          ...food,
          createdAt: new Date(food.createdAt)
        }))
        setFoods(parsedFoods)
      } catch (error) {
        console.error('Error parsing saved foods:', error)
      }
    }
    
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error('Error parsing saved settings:', error)
      }
    }
  }, [])

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('nutrition-foods', JSON.stringify(foods))
  }, [foods])

  useEffect(() => {
    localStorage.setItem('nutrition-settings', JSON.stringify(settings))
  }, [settings])

  // Calculate daily totals for today's foods
  const dailyTotals: DailyTotals = React.useMemo(() => {
    const today = new Date().toDateString()
    const todayFoods = foods.filter(food => 
      food.createdAt.toDateString() === today
    )

    return todayFoods.reduce(
      (totals, food) => ({
        calories: totals.calories + food.calories,
        protein: totals.protein + food.protein,
        carbs: totals.carbs + food.carbs,
        fat: totals.fat + food.fat,
        fiber: totals.fiber + food.fiber,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    )
  }, [foods])

  const addFood = (foodData: Omit<Food, 'id' | 'createdAt'>) => {
    const newFood: Food = {
      ...foodData,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setFoods(prev => [newFood, ...prev])
  }

  const removeFood = (id: string) => {
    setFoods(prev => prev.filter(food => food.id !== id))
  }

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  return (
    <NutritionContext.Provider
      value={{
        foods,
        dailyTotals,
        settings,
        addFood,
        removeFood,
        updateSettings,
        isLoading,
      }}
    >
      {children}
    </NutritionContext.Provider>
  )
}
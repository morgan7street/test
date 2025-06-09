import { motion } from 'framer-motion'
import { Trash2, Calendar } from 'lucide-react'
import { useNutrition } from '../contexts/NutritionContext'
import ProgressRing from '../components/ProgressRing'
import NutriScore from '../components/NutriScore'

export default function Dashboard() {
  const { foods, dailyTotals, settings, removeFood } = useNutrition()
  
  const today = new Date().toDateString()
  const todayFoods = foods.filter(food => 
    food.createdAt.toDateString() === today
  )

  const calorieProgress = (dailyTotals.calories / settings.calorieLimit) * 100

  const macroData = [
    { name: 'Protéines', value: dailyTotals.protein, unit: 'g', color: 'bg-blue-500' },
    { name: 'Glucides', value: dailyTotals.carbs, unit: 'g', color: 'bg-green-500' },
    { name: 'Lipides', value: dailyTotals.fat, unit: 'g', color: 'bg-yellow-500' },
    { name: 'Fibres', value: dailyTotals.fiber, unit: 'g', color: 'bg-purple-500' },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">NutriTrack</h1>
        <div className="flex items-center justify-center text-gray-600">
          <Calendar size={16} className="mr-2" />
          <span>{new Date().toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </motion.div>

      {/* Calorie Progress */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="card text-center"
      >
        <ProgressRing progress={Math.min(calorieProgress, 100)}>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(dailyTotals.calories)}
            </div>
            <div className="text-sm text-gray-500">
              / {settings.calorieLimit} kcal
            </div>
          </div>
        </ProgressRing>
        <h2 className="text-lg font-semibold text-gray-900 mt-4">Calories du jour</h2>
        <p className="text-gray-600">
          {calorieProgress > 100 
            ? `Dépassement de ${Math.round(dailyTotals.calories - settings.calorieLimit)} kcal`
            : `Reste ${Math.round(settings.calorieLimit - dailyTotals.calories)} kcal`
          }
        </p>
      </motion.div>

      {/* Macronutrients */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Macronutriments</h3>
        <div className="grid grid-cols-2 gap-4">
          {macroData.map((macro, index) => (
            <motion.div
              key={macro.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center space-x-3"
            >
              <div className={`w-3 h-3 rounded-full ${macro.color}`} />
              <div>
                <div className="font-medium text-gray-900">
                  {Math.round(macro.value * 10) / 10} {macro.unit}
                </div>
                <div className="text-sm text-gray-500">{macro.name}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Today's Foods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Aliments du jour ({todayFoods.length})
        </h3>
        
        {todayFoods.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun aliment ajouté aujourd'hui</p>
            <p className="text-sm mt-1">Commencez par ajouter votre premier repas !</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayFoods.map((food, index) => (
              <motion.div
                key={food.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-gray-900">{food.name}</h4>
                    <NutriScore score={food.nutriscore} size="sm" />
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {food.quantity} {food.unit} • {Math.round(food.calories)} kcal
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    P: {Math.round(food.protein)}g • G: {Math.round(food.carbs)}g • L: {Math.round(food.fat)}g • F: {Math.round(food.fiber)}g
                  </div>
                </div>
                <button
                  onClick={() => removeFood(food.id)}
                  className="btn-icon text-gray-400 hover:text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Target } from 'lucide-react'
import { useNutrition } from '../contexts/NutritionContext'

export default function Settings() {
  const navigate = useNavigate()
  const { settings, updateSettings } = useNutrition()
  const [calorieLimit, setCalorieLimit] = useState(settings.calorieLimit)
  const [isSaved, setIsSaved] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings({ calorieLimit })
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const presetLimits = [
    { label: 'Perte de poids', value: 1500 },
    { label: 'Maintien', value: 2000 },
    { label: 'Prise de masse', value: 2500 },
    { label: 'Sport intensif', value: 3000 },
  ]

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center mb-6"
      >
        <button
          onClick={() => navigate('/')}
          className="btn-icon text-gray-600 hover:bg-gray-100 mr-3"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Current Goal */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="btn-icon bg-primary-100 text-primary-600">
              <Target size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Objectif calorique</h2>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Limite quotidienne (kcal)
            </label>
            <input
              type="number"
              step="50"
              value={calorieLimit}
              onChange={(e) => setCalorieLimit(Number(e.target.value))}
              className="input-field"
              required
            />
          </div>

          {/* Preset buttons */}
          <div className="grid grid-cols-2 gap-3">
            {presetLimits.map((preset) => (
              <motion.button
                key={preset.label}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setCalorieLimit(preset.value)}
                className={`p-3 rounded-xl border transition-all duration-200 text-sm ${
                  calorieLimit === preset.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">{preset.label}</div>
                <div className="text-xs opacity-75">{preset.value} kcal</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
            isSaved
              ? 'bg-green-500 text-white'
              : 'bg-primary-500 hover:bg-primary-600 text-white'
          }`}
        >
          <Save size={20} />
          <span>{isSaved ? 'Sauvegardé !' : 'Sauvegarder'}</span>
        </motion.button>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-medium text-blue-900 mb-2">💡 Conseils</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Adaptez votre objectif selon votre activité physique</li>
            <li>• Consultez un professionnel pour un suivi personnalisé</li>
            <li>• L'équilibre est plus important que la restriction</li>
          </ul>
        </div>
      </motion.form>
    </div>
  )
}
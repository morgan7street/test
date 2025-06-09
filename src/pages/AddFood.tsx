import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Camera, QrCode, Edit3, ArrowLeft, Check } from 'lucide-react'
import { useNutrition } from '../contexts/NutritionContext'
import { NutritionInfo, Unit } from '../types'
import LoadingSpinner from '../components/LoadingSpinner'
import NutriScore from '../components/NutriScore'

export default function AddFood() {
  const navigate = useNavigate()
  const { addFood } = useNutrition()
  
  const [mode, setMode] = useState<'select' | 'manual' | 'photo' | 'barcode'>('select')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form data
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState(100)
  const [unit, setUnit] = useState<Unit>('g')
  const [nutritionInfo, setNutritionInfo] = useState<NutritionInfo | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setError('Veuillez entrer un nom d\'aliment')
      return
    }

    if (!nutritionInfo) {
      setError('Informations nutritionnelles manquantes')
      return
    }

    try {
      setIsLoading(true)
      
      // Calculate nutrition values based on quantity
      const factor = quantity / 100
      
      addFood({
        name: name.trim(),
        calories: nutritionInfo.calories * factor,
        protein: nutritionInfo.protein * factor,
        carbs: nutritionInfo.carbs * factor,
        fat: nutritionInfo.fat * factor,
        fiber: nutritionInfo.fiber * factor,
        quantity,
        unit,
        nutriscore: nutritionInfo.nutriscore,
      })

      navigate('/')
    } catch (err) {
      setError('Erreur lors de l\'ajout de l\'aliment')
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualEntry = () => {
    // For demo purposes, we'll use mock nutrition data
    // In a real app, this would call an API
    setIsLoading(true)
    setTimeout(() => {
      setNutritionInfo({
        calories: 250,
        protein: 8,
        carbs: 45,
        fat: 5,
        fiber: 3,
        nutriscore: 'B'
      })
      setIsLoading(false)
      setMode('manual')
    }, 1500)
  }

  const handlePhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setMode('photo')
    
    // Mock photo recognition
    setTimeout(() => {
      setName('Pomme')
      setNutritionInfo({
        calories: 52,
        protein: 0.3,
        carbs: 14,
        fat: 0.2,
        fiber: 2.4,
        nutriscore: 'A'
      })
      setIsLoading(false)
    }, 2000)
  }

  const handleBarcodeScanned = (code: string) => {
    setIsLoading(true)
    setMode('barcode')
    
    // Mock barcode lookup
    setTimeout(() => {
      setName('Yaourt nature')
      setNutritionInfo({
        calories: 60,
        protein: 4,
        carbs: 5,
        fat: 3,
        fiber: 0,
        nutriscore: 'A'
      })
      setIsLoading(false)
    }, 1500)
  }

  const resetForm = () => {
    setMode('select')
    setName('')
    setQuantity(100)
    setUnit('g')
    setNutritionInfo(null)
    setError(null)
  }

  if (mode === 'select') {
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
          <h1 className="text-2xl font-bold text-gray-900">Ajouter un aliment</h1>
        </motion.div>

        <div className="space-y-4">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={handleManualEntry}
            className="w-full card hover:shadow-md transition-all duration-200 text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="btn-icon bg-primary-100 text-primary-600">
                <Edit3 size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Saisie manuelle</h3>
                <p className="text-gray-600 text-sm">Entrez le nom de l'aliment</p>
              </div>
            </div>
          </motion.button>

          <motion.label
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="block w-full card hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="btn-icon bg-green-100 text-green-600">
                <Camera size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Prendre une photo</h3>
                <p className="text-gray-600 text-sm">Reconnaissance automatique</p>
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoCapture}
              className="hidden"
            />
          </motion.label>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => handleBarcodeScanned('mock-barcode')}
            className="w-full card hover:shadow-md transition-all duration-200 text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="btn-icon bg-orange-100 text-orange-600">
                <QrCode size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Scanner un code-barres</h3>
                <p className="text-gray-600 text-sm">Base de données OpenFoodFacts</p>
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center mb-6"
      >
        <button
          onClick={resetForm}
          className="btn-icon text-gray-600 hover:bg-gray-100 mr-3"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Ajouter un aliment</h1>
      </motion.div>

      {isLoading ? (
        <LoadingSpinner size="lg" text="Analyse en cours..." />
      ) : (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Nutrition Info Display */}
          {nutritionInfo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card bg-green-50 border-green-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{name}</h3>
                <NutriScore score={nutritionInfo.nutriscore} />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Calories:</span>
                  <span className="font-medium ml-2">{nutritionInfo.calories} kcal/100g</span>
                </div>
                <div>
                  <span className="text-gray-600">Protéines:</span>
                  <span className="font-medium ml-2">{nutritionInfo.protein}g</span>
                </div>
                <div>
                  <span className="text-gray-600">Glucides:</span>
                  <span className="font-medium ml-2">{nutritionInfo.carbs}g</span>
                </div>
                <div>
                  <span className="text-gray-600">Lipides:</span>
                  <span className="font-medium ml-2">{nutritionInfo.fat}g</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Manual name input for manual mode */}
          {mode === 'manual' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'aliment
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="Ex: Pomme, Yaourt nature..."
                required
              />
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantité
            </label>
            <input
              type="number"
              step="0.01"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="input-field"
              required
            />
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unité
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as Unit)}
              className="input-field"
            >
              <option value="g">Grammes (g)</option>
              <option value="mL">Millilitres (mL)</option>
              <option value="P">Pièce (P)</option>
            </select>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl"
            >
              {error}
            </motion.div>
          )}

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={!nutritionInfo || isLoading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Check size={20} />
              <span>Ajouter</span>
            </button>
          </div>
        </motion.form>
      )}
    </div>
  )
}
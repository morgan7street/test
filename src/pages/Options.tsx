import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Options() {
  const navigate = useNavigate()

  const useTimer = (defaultDuration: number, defaultInterval: number) => {
    const [duration, setDuration] = useState(defaultDuration)
    const [interval, setIntervalValue] = useState(defaultInterval)
    const [unit, setUnit] = useState<'minutes' | 'heures' | 'jour' | 'semaine'>('heures')
    const [repeat, setRepeat] = useState(false)
    const [remaining, setRemaining] = useState(defaultDuration * 60)
    const [active, setActive] = useState(false)

    const parseInterval = (val: number, u: string) => {
      switch (u) {
        case 'minutes':
          return val * 60
        case 'heures':
          return val * 3600
        case 'jour':
          return 86400
        case 'semaine':
          return 604800
        default:
          return 0
      }
    }

    useEffect(() => {
      if (!active) return
      if (remaining <= 0) {
        alert('Temps écoulé !')
        if (repeat) {
          setRemaining(parseInterval(interval, unit))
        } else {
          setActive(false)
        }
        return
      }
      const id = setInterval(() => setRemaining((r) => r - 1), 1000)
      return () => clearInterval(id)
    }, [active, remaining, repeat, interval, unit])

    const start = () => {
      setRemaining(duration * 60)
      setActive(true)
    }
    const stop = () => setActive(false)

    const display = `${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`
    return {
      display,
      active,
      start,
      stop,
      duration,
      setDuration,
      interval,
      setInterval: setIntervalValue,
      unit,
      setUnit,
      repeat,
      setRepeat,
    }
  }

  const water = useTimer(15, 120)
  const move = useTimer(30, 180)

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} className="flex items-center mb-6">
        <button onClick={()=>navigate('/')} className="btn-icon text-gray-600 hover:bg-gray-100 mr-3">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Options+</h1>
      </motion.div>

      <div className="space-y-6">
        <div className="card text-center">
          <h2 className="font-semibold mb-2">Minuterie hydrique</h2>
          <p className="text-3xl font-mono">{water.display}</p>
          <div className="mt-3 flex flex-col items-center space-y-2">
            <div>
              <label className="mr-2">Durée initiale (min)</label>
              <input
                type="number"
                className="input-field w-20"
                value={water.duration}
                onChange={(e) => water.setDuration(Number(e.target.value))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="water-repeat"
                type="checkbox"
                className="form-checkbox"
                checked={water.repeat}
                onChange={(e) => water.setRepeat(e.target.checked)}
              />
              <label htmlFor="water-repeat">Répéter</label>
            </div>
            <div>
              <label className="mr-2">Intervalle</label>
              <input
                type="number"
                className="input-field w-20"
                value={water.interval}
                onChange={(e) => water.setInterval(Number(e.target.value))}
              />
              <select
                className="input-field w-32 ml-2"
                value={water.unit}
                onChange={(e) => water.setUnit(e.target.value as any)}
              >
                <option value="minutes">minutes</option>
                <option value="heures">heures</option>
                <option value="jour">quotidien</option>
                <option value="semaine">hebdomadaire</option>
              </select>
            </div>
            <div className="space-x-2 mt-2">
              <button onClick={water.start} className="btn-primary">Démarrer</button>
              <button onClick={water.stop} className="btn-secondary">Arrêter</button>
            </div>
          </div>
        </div>
        <div className="card text-center">
          <h2 className="font-semibold mb-2">Minuterie mouvement</h2>
          <p className="text-3xl font-mono">{move.display}</p>
          <div className="mt-3 flex flex-col items-center space-y-2">
            <div>
              <label className="mr-2">Durée initiale (min)</label>
              <input
                type="number"
                className="input-field w-20"
                value={move.duration}
                onChange={(e) => move.setDuration(Number(e.target.value))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="move-repeat"
                type="checkbox"
                className="form-checkbox"
                checked={move.repeat}
                onChange={(e) => move.setRepeat(e.target.checked)}
              />
              <label htmlFor="move-repeat">Répéter</label>
            </div>
            <div>
              <label className="mr-2">Intervalle</label>
              <input
                type="number"
                className="input-field w-20"
                value={move.interval}
                onChange={(e) => move.setInterval(Number(e.target.value))}
              />
              <select
                className="input-field w-32 ml-2"
                value={move.unit}
                onChange={(e) => move.setUnit(e.target.value as any)}
              >
                <option value="minutes">minutes</option>
                <option value="heures">heures</option>
                <option value="jour">quotidien</option>
                <option value="semaine">hebdomadaire</option>
              </select>
            </div>
            <div className="space-x-2 mt-2">
              <button onClick={move.start} className="btn-primary">Démarrer</button>
              <button onClick={move.stop} className="btn-secondary">Arrêter</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

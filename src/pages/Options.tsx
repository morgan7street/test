import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Options() {
  const navigate = useNavigate()

  const createTimer = (minutes: number) => {
    const [remaining, setRemaining] = useState(minutes * 60)
    const [active, setActive] = useState(false)

    useEffect(() => {
      if (!active) return
      if (remaining <= 0) {
        setActive(false)
        alert('Temps écoulé !')
        return
      }
      const id = setInterval(() => setRemaining((r) => r - 1), 1000)
      return () => clearInterval(id)
    }, [active, remaining])

    const start = () => {
      setRemaining(minutes * 60)
      setActive(true)
    }
    const stop = () => setActive(false)

    const display = `${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`
    return { display, active, start, stop }
  }

  const water = createTimer(30)
  const move = createTimer(60)

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
          <div className="mt-3 space-x-2">
            <button onClick={water.start} className="btn-primary">Démarrer</button>
            <button onClick={water.stop} className="btn-secondary">Arrêter</button>
          </div>
        </div>
        <div className="card text-center">
          <h2 className="font-semibold mb-2">Minuterie mouvement</h2>
          <p className="text-3xl font-mono">{move.display}</p>
          <div className="mt-3 space-x-2">
            <button onClick={move.start} className="btn-primary">Démarrer</button>
            <button onClick={move.stop} className="btn-secondary">Arrêter</button>
          </div>
        </div>
      </div>
    </div>
  )
}

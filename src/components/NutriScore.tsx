
interface NutriScoreProps {
  score?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function NutriScore({ score, size = 'md' }: NutriScoreProps) {
  if (!score) return null

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-lg'
  }

  const getScoreColor = (score: string) => {
    const colors = {
      A: 'bg-nutriscore-A',
      B: 'bg-nutriscore-B', 
      C: 'bg-nutriscore-C',
      D: 'bg-nutriscore-D',
      E: 'bg-nutriscore-E',
    }
    return colors[score as keyof typeof colors] || 'bg-gray-400'
  }

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${getScoreColor(score)} 
        rounded-full flex items-center justify-center text-white font-bold shadow-sm
      `}
    >
      {score}
    </div>
  )
}
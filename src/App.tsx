import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { NutritionProvider } from './contexts/NutritionContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import AddFood from './pages/AddFood'
import Settings from './pages/Settings'
import Options from './pages/Options'

function App() {
  return (
    <NutritionProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddFood />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/options" element={<Options />} />
          </Routes>
        </Layout>
      </Router>
    </NutritionProvider>
  )
}

export default App

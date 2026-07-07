import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Splash() {
  const navigate = useNavigate()
  
  useEffect(() => {
    const timer = setTimeout(() => navigate('/onboarding'), 2000)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-primary-foreground">ExamPilot AI</h1>
      </motion.div>
    </div>
  )
}

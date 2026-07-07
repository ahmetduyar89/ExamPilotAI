import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'

export default function Onboarding() {
  const navigate = useNavigate()
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <h1 className="text-3xl font-bold">Welcome to ExamPilot AI</h1>
        <p className="text-muted-foreground">The future of grading and analytics.</p>
        <Button className="w-full" size="lg" onClick={() => navigate('/login')}>
          Get Started
        </Button>
      </motion.div>
    </div>
  )
}

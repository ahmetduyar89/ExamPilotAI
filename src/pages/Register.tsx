import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'

export default function Register() {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>Join ExamPilot AI today</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input placeholder="Dr. Smith" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" placeholder="instructor@exampilot.ai" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input type="password" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" onClick={() => navigate('/dashboard')}>Sign Up</Button>
          <div className="text-sm text-center text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

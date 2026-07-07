import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'

export default function Login() {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
          <Button className="w-full" onClick={() => navigate('/dashboard')}>Sign In</Button>
          <div className="text-sm text-center text-muted-foreground">
            Don't have an account? <Link to="/register" className="text-primary hover:underline">Sign up</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

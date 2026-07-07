import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function Profile() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input disabled placeholder="Your Name" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input disabled type="email" placeholder="your.email@example.com" />
          </div>
          <Button variant="outline">Update Profile</Button>
        </CardContent>
      </Card>
    </div>
  )
}

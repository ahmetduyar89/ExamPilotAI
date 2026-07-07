import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useThemeStore } from '@/store/themeStore'

export default function Settings() {
  const { theme, setTheme } = useThemeStore()

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the app.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Theme Preference</label>
            <div className="flex items-center gap-2">
              <Button 
                variant={theme === 'light' ? 'primary' : 'outline'} 
                onClick={() => setTheme('light')}
              >
                Light
              </Button>
              <Button 
                variant={theme === 'dark' ? 'primary' : 'outline'} 
                onClick={() => setTheme('dark')}
              >
                Dark
              </Button>
              <Button 
                variant={theme === 'system' ? 'primary' : 'outline'} 
                onClick={() => setTheme('system')}
              >
                System
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

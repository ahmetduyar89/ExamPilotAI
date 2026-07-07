import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export default function Analytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-muted-foreground border-t">
          Chart data will appear here once exams are graded.
        </CardContent>
      </Card>
    </div>
  )
}

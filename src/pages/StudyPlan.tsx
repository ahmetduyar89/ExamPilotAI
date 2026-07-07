import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export default function StudyPlan() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Study Plans</h1>
      <Card>
        <CardHeader>
          <CardTitle>Generated Plans</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          Study plans will be available after student exams are analyzed.
        </CardContent>
      </Card>
    </div>
  )
}

import { Button } from "@/components/ui/button" 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <div className="space-y-8">
        <h1 className="text-4xl font-bold">WordPress GraphQL Blog</h1>
        
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>shadcn/ui Test</CardTitle>
            <CardDescription>Testing our component library setup</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>Click me!</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

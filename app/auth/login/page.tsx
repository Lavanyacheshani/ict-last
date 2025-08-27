import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <Link href="/" className="text-2xl font-bold text-foreground hover:text-accent">
              Saman Priyakara Sir
            </Link>
          </div>

          <Card className="bg-card border-border">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <CardTitle className="text-2xl text-foreground">Authentication Error</CardTitle>
              <CardDescription className="text-muted-foreground">
                There was an error with your authentication. Please try again.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="space-y-2">
                <Link href="/auth/login">
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Try Again</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full bg-transparent">
                    Back to Website
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface Result {
  id: string
  student_name: string
  achievement: string
  year: number
  testimonial: string
  image_url?: string
}

export function ResultsSection() {
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchResults() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("results")
        .select("*")
        .order("order_index", { ascending: true })
        .limit(6)

      if (!error && data) {
        setResults(data)
      }
      setLoading(false)
    }

    fetchResults()
  }, [])

  if (loading) {
    return (
      <section id="results" className="py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">Loading results...</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="results" className="py-20 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Student Results</h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Proud achievements of our students who excelled in A/L ICT examinations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((result) => (
            <Card key={result.id} className="bg-card border-border hover:border-accent/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                    <Star className="h-8 w-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{result.student_name}</h3>
                    <p className="text-sm text-accent font-medium">{result.achievement}</p>
                    <p className="text-xs text-muted-foreground">Year {result.year}</p>
                  </div>
                </div>

                {result.testimonial && (
                  <div className="relative">
                    <Quote className="h-4 w-4 text-accent/50 absolute -top-1 -left-1" />
                    <p className="text-sm text-muted-foreground italic pl-4 text-balance">"{result.testimonial}"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {results.length === 0 && (
          <div className="text-center text-muted-foreground">
            <p>No results available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}

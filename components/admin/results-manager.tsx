"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Result {
  id: string
  student_name: string
  achievement: string
  year: number
  image_url?: string
  testimonial?: string
  order_index: number
}

export function ResultsManager() {
  const [results, setResults] = useState<Result[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingResult, setEditingResult] = useState<Result | null>(null)
  const [formData, setFormData] = useState({
    student_name: "",
    achievement: "",
    year: "",
    image_url: "",
    testimonial: "",
    order_index: "0",
  })

  useEffect(() => {
    fetchResults()
  }, [])

  async function fetchResults() {
    const supabase = createClient()
    const { data, error } = await supabase.from("results").select("*").order("order_index", { ascending: true })

    if (!error && data) {
      setResults(data)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createClient()

    const resultData = {
      student_name: formData.student_name,
      achievement: formData.achievement,
      year: Number.parseInt(formData.year),
      image_url: formData.image_url || null,
      testimonial: formData.testimonial || null,
      order_index: Number.parseInt(formData.order_index),
    }

    if (editingResult) {
      const { error } = await supabase.from("results").update(resultData).eq("id", editingResult.id)
      if (!error) {
        fetchResults()
        resetForm()
      }
    } else {
      const { error } = await supabase.from("results").insert([resultData])
      if (!error) {
        fetchResults()
        resetForm()
      }
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this result?")) {
      const supabase = createClient()
      const { error } = await supabase.from("results").delete().eq("id", id)
      if (!error) {
        fetchResults()
      }
    }
  }

  function handleEdit(result: Result) {
    setEditingResult(result)
    setFormData({
      student_name: result.student_name,
      achievement: result.achievement,
      year: result.year.toString(),
      image_url: result.image_url || "",
      testimonial: result.testimonial || "",
      order_index: result.order_index.toString(),
    })
    setIsEditing(true)
  }

  function resetForm() {
    setEditingResult(null)
    setFormData({
      student_name: "",
      achievement: "",
      year: "",
      image_url: "",
      testimonial: "",
      order_index: "0",
    })
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {editingResult ? "Edit Result" : "Add New Result"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="student_name" className="text-foreground">
                  Student Name
                </Label>
                <Input
                  id="student_name"
                  value={formData.student_name}
                  onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                  required
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="achievement" className="text-foreground">
                  Achievement
                </Label>
                <Input
                  id="achievement"
                  value={formData.achievement}
                  onChange={(e) => setFormData({ ...formData, achievement: e.target.value })}
                  required
                  className="bg-input border-border text-foreground"
                  placeholder="e.g., ICT A Grade - 85 Marks"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year" className="text-foreground">
                  Year
                </Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  required
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="order_index" className="text-foreground">
                  Display Order
                </Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: e.target.value })}
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="image_url" className="text-foreground">
                Image URL (Optional)
              </Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="bg-input border-border text-foreground"
              />
            </div>
            <div>
              <Label htmlFor="testimonial" className="text-foreground">
                Testimonial (Optional)
              </Label>
              <Textarea
                id="testimonial"
                value={formData.testimonial}
                onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                className="bg-input border-border text-foreground"
                rows={3}
                placeholder="Student's testimonial about the classes"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
                {editingResult ? "Update Result" : "Add Result"}
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Existing Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result) => (
              <div
                key={result.id}
                className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{result.student_name}</h3>
                  <p className="text-sm text-accent font-medium">{result.achievement}</p>
                  <p className="text-xs text-muted-foreground">Year {result.year}</p>
                  {result.testimonial && (
                    <p className="text-sm text-muted-foreground mt-2 italic">"{result.testimonial}"</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(result)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(result.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

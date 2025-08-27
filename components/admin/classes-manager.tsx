"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Class {
  id: string
  name: string
  description: string
  year: number | null
  is_active: boolean
}

export function ClassesManager() {
  const [classes, setClasses] = useState<Class[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    year: "",
    is_active: true,
  })

  useEffect(() => {
    fetchClasses()
  }, [])

  async function fetchClasses() {
    const supabase = createClient()
    const { data, error } = await supabase.from("classes").select("*").order("created_at", { ascending: false })

    if (!error && data) {
      setClasses(data)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createClient()

    const classData = {
      name: formData.name,
      description: formData.description,
      year: formData.year ? Number.parseInt(formData.year) : null,
      is_active: formData.is_active,
    }

    if (editingClass) {
      const { error } = await supabase.from("classes").update(classData).eq("id", editingClass.id)
      if (!error) {
        fetchClasses()
        resetForm()
      }
    } else {
      const { error } = await supabase.from("classes").insert([classData])
      if (!error) {
        fetchClasses()
        resetForm()
      }
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this class?")) {
      const supabase = createClient()
      const { error } = await supabase.from("classes").delete().eq("id", id)
      if (!error) {
        fetchClasses()
      }
    }
  }

  function handleEdit(classItem: Class) {
    setEditingClass(classItem)
    setFormData({
      name: classItem.name,
      description: classItem.description,
      year: classItem.year?.toString() || "",
      is_active: classItem.is_active,
    })
    setIsEditing(true)
  }

  function resetForm() {
    setEditingClass(null)
    setFormData({
      name: "",
      description: "",
      year: "",
      is_active: true,
    })
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {editingClass ? "Edit Class" : "Add New Class"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-foreground">
                  Class Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-input border-border text-foreground"
                  placeholder="e.g., 2025 A/L"
                />
              </div>
              <div>
                <Label htmlFor="year" className="text-foreground">
                  Year (Optional)
                </Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="bg-input border-border text-foreground"
                  placeholder="e.g., 2025"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description" className="text-foreground">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-input border-border text-foreground"
                placeholder="Class description"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active" className="text-foreground">
                Active
              </Label>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
                {editingClass ? "Update Class" : "Add Class"}
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
          <CardTitle className="text-foreground">Existing Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {classes.map((classItem) => (
              <div
                key={classItem.id}
                className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border"
              >
                <div>
                  <h3 className="font-semibold text-foreground">{classItem.name}</h3>
                  <p className="text-sm text-muted-foreground">{classItem.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    {classItem.year && <span className="text-xs text-muted-foreground">Year: {classItem.year}</span>}
                    <span className={`text-xs ${classItem.is_active ? "text-green-500" : "text-red-500"}`}>
                      {classItem.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(classItem)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(classItem.id)}>
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

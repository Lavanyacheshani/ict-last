"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface GalleryItem {
  id: string
  title: string
  description?: string
  image_url: string
  category: string
  order_index: number
}

export function GalleryManager() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    category: "",
    order_index: "0",
  })

  const categories = ["classes", "events", "activities", "achievements"]

  useEffect(() => {
    fetchGalleryItems()
  }, [])

  async function fetchGalleryItems() {
    const supabase = createClient()
    const { data, error } = await supabase.from("gallery").select("*").order("order_index", { ascending: true })

    if (!error && data) {
      setGalleryItems(data)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createClient()

    const itemData = {
      title: formData.title,
      description: formData.description || null,
      image_url: formData.image_url,
      category: formData.category,
      order_index: Number.parseInt(formData.order_index),
    }

    if (editingItem) {
      const { error } = await supabase.from("gallery").update(itemData).eq("id", editingItem.id)
      if (!error) {
        fetchGalleryItems()
        resetForm()
      }
    } else {
      const { error } = await supabase.from("gallery").insert([itemData])
      if (!error) {
        fetchGalleryItems()
        resetForm()
      }
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this gallery item?")) {
      const supabase = createClient()
      const { error } = await supabase.from("gallery").delete().eq("id", id)
      if (!error) {
        fetchGalleryItems()
      }
    }
  }

  function handleEdit(item: GalleryItem) {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description || "",
      image_url: item.image_url,
      category: item.category,
      order_index: item.order_index.toString(),
    })
    setIsEditing(true)
  }

  function resetForm() {
    setEditingItem(null)
    setFormData({
      title: "",
      description: "",
      image_url: "",
      category: "",
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
            {editingItem ? "Edit Gallery Item" : "Add New Gallery Item"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-foreground">
                  Title
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="category" className="text-foreground">
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description" className="text-foreground">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-input border-border text-foreground"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="image_url" className="text-foreground">
                  Image URL
                </Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
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
            <div className="flex gap-2">
              <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
                {editingItem ? "Update Item" : "Add Item"}
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
          <CardTitle className="text-foreground">Existing Gallery Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryItems.map((item) => (
              <div key={item.id} className="bg-muted/20 rounded-lg overflow-hidden border border-border">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  {item.description && <p className="text-sm text-muted-foreground mb-2">{item.description}</p>}
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">{item.category}</span>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

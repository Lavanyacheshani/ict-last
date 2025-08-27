"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Video {
  id: string
  title: string
  description: string
  video_url: string
  thumbnail_url: string
  is_free: boolean
  price: number
  order_index: number
  month_id: string
}

interface Month {
  id: string
  name: string
  month_number: number
  year: number
  class_name: string
}

export function VideosManager() {
  const [videos, setVideos] = useState<Video[]>([])
  const [months, setMonths] = useState<Month[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video_url: "",
    thumbnail_url: "",
    is_free: true,
    price: "0",
    order_index: "0",
    month_id: "",
  })

  useEffect(() => {
    fetchVideos()
    fetchMonths()
  }, [])

  async function fetchVideos() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("videos")
      .select(
        `
        *,
        months!inner(
          name,
          month_number,
          year,
          classes!inner(name)
        )
      `,
      )
      .order("created_at", { ascending: false })

    if (!error && data) {
      setVideos(data)
    }
  }

  async function fetchMonths() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("months")
      .select(
        `
        *,
        classes!inner(name)
      `,
      )
      .order("month_number", { ascending: true })

    if (!error && data) {
      const monthsWithClassName = data.map((month: any) => ({
        ...month,
        class_name: month.classes.name,
      }))
      setMonths(monthsWithClassName)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createClient()

    const videoData = {
      title: formData.title,
      description: formData.description,
      video_url: formData.video_url,
      thumbnail_url: formData.thumbnail_url,
      is_free: formData.is_free,
      price: Number.parseFloat(formData.price),
      order_index: Number.parseInt(formData.order_index),
      month_id: formData.month_id,
    }

    if (editingVideo) {
      const { error } = await supabase.from("videos").update(videoData).eq("id", editingVideo.id)
      if (!error) {
        fetchVideos()
        resetForm()
      }
    } else {
      const { error } = await supabase.from("videos").insert([videoData])
      if (!error) {
        fetchVideos()
        resetForm()
      }
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this video?")) {
      const supabase = createClient()
      const { error } = await supabase.from("videos").delete().eq("id", id)
      if (!error) {
        fetchVideos()
      }
    }
  }

  function handleEdit(video: Video) {
    setEditingVideo(video)
    setFormData({
      title: video.title,
      description: video.description,
      video_url: video.video_url,
      thumbnail_url: video.thumbnail_url,
      is_free: video.is_free,
      price: video.price.toString(),
      order_index: video.order_index.toString(),
      month_id: video.month_id,
    })
    setIsEditing(true)
  }

  function resetForm() {
    setEditingVideo(null)
    setFormData({
      title: "",
      description: "",
      video_url: "",
      thumbnail_url: "",
      is_free: true,
      price: "0",
      order_index: "0",
      month_id: "",
    })
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {editingVideo ? "Edit Video" : "Add New Video"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-foreground">
                  Video Title
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
                <Label htmlFor="month_id" className="text-foreground">
                  Month
                </Label>
                <Select
                  value={formData.month_id}
                  onValueChange={(value) => setFormData({ ...formData, month_id: value })}
                >
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.id} value={month.id}>
                        {month.class_name} - {month.name} {month.year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="video_url" className="text-foreground">
                  Video URL
                </Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  required
                  className="bg-input border-border text-foreground"
                  placeholder="Google Drive or YouTube URL"
                />
              </div>
              <div>
                <Label htmlFor="thumbnail_url" className="text-foreground">
                  Thumbnail URL (Optional)
                </Label>
                <Input
                  id="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_free"
                  checked={formData.is_free}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_free: checked })}
                />
                <Label htmlFor="is_free" className="text-foreground">
                  Free Video
                </Label>
              </div>
              <div>
                <Label htmlFor="price" className="text-foreground">
                  Price (Rs.)
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  disabled={formData.is_free}
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="order_index" className="text-foreground">
                  Order
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
                {editingVideo ? "Update Video" : "Add Video"}
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
          <CardTitle className="text-foreground">Existing Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {videos.map((video: any) => (
              <div
                key={video.id}
                className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{video.title}</h3>
                  <p className="text-sm text-muted-foreground">{video.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-muted-foreground">
                      {video.months.classes.name} - {video.months.name} {video.months.year}
                    </span>
                    <span className={`text-xs ${video.is_free ? "text-green-500" : "text-accent"}`}>
                      {video.is_free ? "Free" : `Rs. ${video.price}`}
                    </span>
                    <span className="text-xs text-muted-foreground">Order: {video.order_index}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(video)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(video.id)}>
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

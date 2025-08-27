"use client"

import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface GalleryItem {
  id: string
  title: string
  description?: string
  image_url: string
  category: string
}

export function GallerySection() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGallery() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("order_index", { ascending: true })
        .limit(6)

      if (!error && data) {
        setGalleryItems(data)
      }
      setLoading(false)
    }

    fetchGallery()
  }, [])

  if (loading) {
    return (
      <section id="gallery" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">Loading gallery...</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="gallery" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Gallery</h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Glimpses from our classes, events, and special activities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden bg-card border-border hover:border-accent/50 transition-colors group"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-foreground mb-1">{item.title}</h3>
                {item.description && <p className="text-sm text-muted-foreground text-balance">{item.description}</p>}
                <span className="inline-block mt-2 px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                  {item.category}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {galleryItems.length === 0 && (
          <div className="text-center text-muted-foreground">
            <p>No gallery items available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { createClient } from "@/lib/supabase/client"
import { ChevronDown, ChevronUp, FileText, Play, CreditCard, Download } from "lucide-react"
import "./globals.css";

interface ClassData {
  id: string
  name: string
  description: string
  year: number
}

interface Month {
  id: string
  name: string
  month_number: number
  year: number
}

interface Video {
  id: string
  title: string
  description: string
  video_url: string
  thumbnail_url: string
  is_free: boolean
  price: number
  order_index: number
}

interface Note {
  id: string
  title: string
  description: string
  drive_url: string
  is_free: boolean
  price: number
}

interface MonthData extends Month {
  videos: Video[]
  notes: Note[]
}

export default function ClassPage() {
  const params = useParams()
  const classId = params.classId as string
  const [classData, setClassData] = useState<ClassData | null>(null)
  const [months, setMonths] = useState<MonthData[]>([])
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchClassData() {
      const supabase = createClient()

      // Fetch class information
      const { data: classInfo } = await supabase
        .from("classes")
        .select("*")
        .eq("name", getClassNameFromId(classId))
        .single()

      if (classInfo) {
        setClassData(classInfo)

        // Fetch months for this class
        const { data: monthsData } = await supabase
          .from("months")
          .select("*")
          .eq("class_id", classInfo.id)
          .order("month_number", { ascending: true })

        if (monthsData) {
          // Fetch videos and notes for each month
          const monthsWithContent = await Promise.all(
            monthsData.map(async (month) => {
              const [videosResult, notesResult] = await Promise.all([
                supabase.from("videos").select("*").eq("month_id", month.id).order("order_index", { ascending: true }),
                supabase.from("notes").select("*").eq("month_id", month.id),
              ])

              return {
                ...month,
                videos: videosResult.data || [],
                notes: notesResult.data || [],
              }
            }),
          )

          setMonths(monthsWithContent)
        }
      }

      setLoading(false)
    }

    fetchClassData()
  }, [classId])

  function getClassNameFromId(id: string): string {
    const mapping: Record<string, string> = {
      "2025-al": "2025 A/L",
      "2026-al": "2026 A/L",
      "2027-al": "2027 A/L",
      "lesson-packs": "Lesson Packs",
    }
    return mapping[id] || id
  }

  function toggleMonth(monthId: string) {
    const newExpanded = new Set(expandedMonths)
    if (newExpanded.has(monthId)) {
      newExpanded.delete(monthId)
    } else {
      newExpanded.add(monthId)
    }
    setExpandedMonths(newExpanded)
  }

  function handleBuyClick() {
    const bankDetails = `Bank: Commercial Bank
Account: 1234567890
Name: Saman Priyakara

Please send payment receipt to WhatsApp after payment.`

    const whatsappMessage = encodeURIComponent(
      `Hello Sir, I want to purchase ${classData?.name} content. Here are the bank details I received:\n\n${bankDetails}`,
    )
    window.open(`https://wa.me/+94771234567?text=${whatsappMessage}`, "_blank")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 flex items-center justify-center">
          <div className="animate-pulse text-foreground">Loading class content...</div>
        </div>
      </div>
    )
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Class Not Found</h1>
            <p className="text-muted-foreground">The requested class could not be found.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20">
        {/* Header */}
        <div className="bg-card/50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{classData.name}</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{classData.description}</p>
              <div className="w-24 h-1 bg-accent mx-auto mt-6"></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {months.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No content available for this class yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {months.map((month) => (
                <Card key={month.id} className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl text-foreground flex items-center gap-2">
                        {month.name} {month.year}
                        <Badge variant="secondary" className="ml-2">
                          {month.videos.length} videos, {month.notes.length} notes
                        </Badge>
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleMonth(month.id)}
                        className="text-foreground hover:text-accent"
                      >
                        {expandedMonths.has(month.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {/* Preview - Show first 3 videos */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {month.videos.slice(0, 3).map((video) => (
                        <div
                          key={video.id}
                          className="bg-muted/20 rounded-lg overflow-hidden border border-border hover:border-accent/50 transition-colors"
                        >
                          <div className="aspect-video bg-muted/40 flex items-center justify-center">
                            <Play className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div className="p-3">
                            <h4 className="font-medium text-foreground text-sm mb-1 line-clamp-2">{video.title}</h4>
                            <div className="flex items-center justify-between">
                              <Badge variant={video.is_free ? "default" : "secondary"} className="text-xs">
                                {video.is_free ? "Free" : `Rs. ${video.price}`}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4">
                      <Button
                        variant="outline"
                        className="border-accent text-accent hover:bg-accent/10 flex items-center gap-2 bg-transparent"
                        onClick={() => {
                          if (month.notes.length > 0) {
                            window.open(month.notes[0].drive_url, "_blank")
                          }
                        }}
                        disabled={month.notes.length === 0}
                      >
                        <FileText className="h-4 w-4" />
                        Notes
                      </Button>

                      <Button
                        variant="outline"
                        className="border-foreground text-foreground hover:bg-muted/20 flex items-center gap-2 bg-transparent"
                        onClick={() => toggleMonth(month.id)}
                      >
                        <Play className="h-4 w-4" />
                        {expandedMonths.has(month.id) ? "Hide Videos" : "View All Videos"}
                      </Button>

                      <Button
                        className="bg-accent text-accent-foreground hover:bg-accent/90 flex items-center gap-2"
                        onClick={handleBuyClick}
                      >
                        <CreditCard className="h-4 w-4" />
                        Buy
                      </Button>
                    </div>

                    {/* Expanded Content */}
                    {expandedMonths.has(month.id) && (
                      <div className="mt-8 pt-6 border-t border-border">
                        <h4 className="text-lg font-semibold text-foreground mb-4">All Videos</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {month.videos.map((video) => (
                            <div
                              key={video.id}
                              className="bg-muted/20 rounded-lg overflow-hidden border border-border hover:border-accent/50 transition-colors"
                            >
                              <div className="aspect-video bg-muted/40 flex items-center justify-center">
                                <Play className="h-8 w-8 text-muted-foreground" />
                              </div>
                              <div className="p-4">
                                <h5 className="font-medium text-foreground mb-2 line-clamp-2">{video.title}</h5>
                                {video.description && (
                                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{video.description}</p>
                                )}
                                <div className="flex items-center justify-between">
                                  <Badge variant={video.is_free ? "default" : "secondary"}>
                                    {video.is_free ? "Free" : `Rs. ${video.price}`}
                                  </Badge>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-accent hover:text-accent/80"
                                    onClick={() => window.open(video.video_url, "_blank")}
                                  >
                                    <Play className="h-3 w-3 mr-1" />
                                    Watch
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {month.notes.length > 0 && (
                          <div className="mt-8">
                            <h4 className="text-lg font-semibold text-foreground mb-4">Notes & Materials</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {month.notes.map((note) => (
                                <Card key={note.id} className="bg-muted/20 border-border">
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <h5 className="font-medium text-foreground mb-1">{note.title}</h5>
                                        {note.description && (
                                          <p className="text-sm text-muted-foreground mb-3">{note.description}</p>
                                        )}
                                        <Badge variant={note.is_free ? "default" : "secondary"}>
                                          {note.is_free ? "Free" : `Rs. ${note.price}`}
                                        </Badge>
                                      </div>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-accent hover:text-accent/80"
                                        onClick={() => window.open(note.drive_url, "_blank")}
                                      >
                                        <Download className="h-3 w-3 mr-1" />
                                        Download
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

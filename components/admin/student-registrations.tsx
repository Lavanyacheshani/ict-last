"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Trash2, Search, Download } from "lucide-react"

interface StudentRegistration {
  id: string
  name: string
  class: string
  student_id: string
  phone_number: string
  school: string
  created_at: string
}

export function StudentRegistrations() {
  const [registrations, setRegistrations] = useState<StudentRegistration[]>([])
  const [filteredRegistrations, setFilteredRegistrations] = useState<StudentRegistration[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchRegistrations()
  }, [])

  useEffect(() => {
    const filtered = registrations.filter(
      (reg) =>
        reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.student_id.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredRegistrations(filtered)
  }, [registrations, searchTerm])

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from("student_registrations")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setRegistrations(data || [])
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch registrations")
    } finally {
      setIsLoading(false)
    }
  }

  const deleteRegistration = async (id: string) => {
    if (!confirm("Are you sure you want to delete this registration?")) return

    try {
      const { error } = await supabase.from("student_registrations").delete().eq("id", id)
      if (error) throw error

      setRegistrations(registrations.filter((reg) => reg.id !== id))
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete registration")
    }
  }

  const exportToCSV = () => {
    const headers = ["Name", "Class", "Student ID", "Phone", "School", "Registration Date"]
    const csvContent = [
      headers.join(","),
      ...filteredRegistrations.map((reg) =>
        [
          `"${reg.name}"`,
          `"${reg.class}"`,
          `"${reg.student_id}"`,
          `"${reg.phone_number}"`,
          `"${reg.school}"`,
          `"${new Date(reg.created_at).toLocaleDateString()}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `student_registrations_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <p className="text-muted-foreground">Loading registrations...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Student Registrations</CardTitle>
          <CardDescription className="text-muted-foreground">Manage student registration data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="text-foreground">
                Search Registrations
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name, class, school, or student ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input border-border text-foreground"
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button
                onClick={exportToCSV}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={filteredRegistrations.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="text-sm text-muted-foreground">
            Showing {filteredRegistrations.length} of {registrations.length} registrations
          </div>

          <div className="space-y-4">
            {filteredRegistrations.map((registration) => (
              <Card key={registration.id} className="bg-muted/50 border-border">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{registration.name}</h3>
                        <Badge variant="secondary" className="bg-accent/20 text-accent">
                          {registration.class}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Student ID:</span> {registration.student_id}
                        </div>
                        <div>
                          <span className="font-medium">Phone:</span> {registration.phone_number}
                        </div>
                        <div className="sm:col-span-2">
                          <span className="font-medium">School:</span> {registration.school}
                        </div>
                        <div className="sm:col-span-2">
                          <span className="font-medium">Registered:</span>{" "}
                          {new Date(registration.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteRegistration(registration.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRegistrations.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? "No registrations found matching your search." : "No student registrations yet."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

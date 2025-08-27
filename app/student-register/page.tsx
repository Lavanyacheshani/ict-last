"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Navigation } from "@/components/navigation"

export default function StudentRegisterPage() {
  const [name, setName] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [studentId, setStudentId] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [school, setSchool] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const classOptions = [
    { value: "2025-al", label: "2025 A/L" },
    { value: "2026-al", label: "2026 A/L" },
    { value: "2027-al", label: "2027 A/L" },
    { value: "lesson-packs", label: "Lesson Packs" },
  ]

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.from("student_registrations").insert({
        name,
        class: selectedClass,
        student_id: studentId,
        phone_number: phoneNumber,
        school,
      })

      if (error) throw error

      setSuccess(true)
      // Redirect to home page after 2 seconds
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 flex items-center justify-center p-6">
          <Card className="w-full max-w-md bg-card border-border">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Registration Successful!</h2>
              <p className="text-muted-foreground mb-4">
                ඔබගේ ලියාපදිංචිය සාර්ථකව සම්පූර්ණ කර ඇත. ඔබ ස්වයංක්‍රීයව මුල් පිටුවට යොමු කරනු ලැබේ.
              </p>
              <p className="text-sm text-muted-foreground">Redirecting to homepage in a few seconds...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <Link href="/" className="text-2xl font-bold text-foreground hover:text-accent">
                Saman Priyakara Sir
              </Link>
              <p className="text-sm text-muted-foreground mt-2">Student Registration</p>
              <p className="text-sm text-muted-foreground">ශිෂ්‍ය ලියාපදිංචිය</p>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">Register</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Fill in your details to register for classes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister}>
                  <div className="flex flex-col gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name" className="text-foreground">
                        Full Name / සම්පූර්ණ නම
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-input border-border text-foreground"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="class" className="text-foreground">
                        Class / පන්තිය
                      </Label>
                      <Select value={selectedClass} onValueChange={setSelectedClass} required>
                        <SelectTrigger className="bg-input border-border text-foreground">
                          <SelectValue placeholder="Select your class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classOptions.map((option) => (
                            <SelectItem key={option.value} value={option.label}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="studentId" className="text-foreground">
                        Student ID / ශිෂ්‍ය අංකය
                      </Label>
                      <Input
                        id="studentId"
                        type="text"
                        placeholder="Enter your student ID"
                        required
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        className="bg-input border-border text-foreground"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="phone" className="text-foreground">
                        Phone Number / දුරකථන අංකය
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="0771234567"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="bg-input border-border text-foreground"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="school" className="text-foreground">
                        School / පාසල
                      </Label>
                      <Input
                        id="school"
                        type="text"
                        placeholder="Enter your school name"
                        required
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        className="bg-input border-border text-foreground"
                      />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <Button
                      type="submit"
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Registering..." : "Register / ලියාපදිංචි වන්න"}
                    </Button>
                  </div>

                  <div className="mt-4 text-center text-sm">
                    <Link href="/" className="text-muted-foreground hover:text-accent underline underline-offset-4">
                      Back to Website / වෙබ් අඩවියට ආපසු
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

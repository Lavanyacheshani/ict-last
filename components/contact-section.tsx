"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Phone, MessageCircle, MapPin } from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    try {
      const supabase = createClient()
      const { error } = await supabase.from("contact_messages").insert([
        {
          name: formData.name,
          phone: formData.phone,
          message: formData.message,
        },
      ])

      if (error) throw error

      setSubmitMessage("Your message has been sent successfully!")
      setFormData({ name: "", phone: "", message: "" })
    } catch (error) {
      setSubmitMessage("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hello Sir, I would like to inquire about A/L ICT classes.")
    window.open(`https://wa.me/+94771234567?text=${message}`, "_blank")
  }

  return (
    <section id="contact" className="py-20 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Contact Us</h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Get in touch with us for more information about our A/L ICT classes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-foreground">
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="mt-1 bg-input border-border text-foreground"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-foreground">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="mt-1 bg-input border-border text-foreground"
                    placeholder="Your phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-foreground">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="mt-1 bg-input border-border text-foreground"
                    placeholder="Your message"
                    rows={4}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
                {submitMessage && (
                  <p className={`text-sm ${submitMessage.includes("success") ? "text-green-500" : "text-red-500"}`}>
                    {submitMessage}
                  </p>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <Phone className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Phone</h3>
                    <p className="text-muted-foreground">+94 77 123 4567</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">WhatsApp</h3>
                    <Button onClick={handleWhatsApp} className="bg-green-600 hover:bg-green-700 text-white">
                      Message on WhatsApp
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Location</h3>
                    <p className="text-muted-foreground">Colombo, Sri Lanka</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Phone, Eye, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface ContactMessage {
  id: string
  name: string
  phone: string
  message: string
  is_read: boolean
  created_at: string
}

export function ContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [])

  async function fetchMessages() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setMessages(data)
    }
    setLoading(false)
  }

  async function markAsRead(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from("contact_messages").update({ is_read: true }).eq("id", id)

    if (!error) {
      setMessages(messages.map((msg) => (msg.id === id ? { ...msg, is_read: true } : msg)))
    }
  }

  async function deleteMessage(id: string) {
    if (confirm("Are you sure you want to delete this message?")) {
      const supabase = createClient()
      const { error } = await supabase.from("contact_messages").delete().eq("id", id)

      if (!error) {
        setMessages(messages.filter((msg) => msg.id !== id))
      }
    }
  }

  function handleWhatsApp(phone: string, name: string) {
    const message = encodeURIComponent(`Hello ${name}, thank you for contacting us about A/L ICT classes.`)
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${message}`, "_blank")
  }

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="text-center">Loading messages...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Contact Messages ({messages.filter((msg) => !msg.is_read).length} unread)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No messages yet.</div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg border ${
                    message.is_read ? "bg-muted/10 border-border" : "bg-accent/5 border-accent/20"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{message.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {message.phone}
                        </p>
                      </div>
                      {!message.is_read && <Badge variant="default">New</Badge>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.created_at).toLocaleDateString()}
                      </span>
                      <div className="flex gap-1">
                        {!message.is_read && (
                          <Button size="sm" variant="outline" onClick={() => markAsRead(message.id)}>
                            <Eye className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleWhatsApp(message.phone, message.name)}
                          className="text-green-600 hover:text-green-700"
                        >
                          WhatsApp
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => deleteMessage(message.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted/20 p-3 rounded border border-border">
                    <p className="text-sm text-foreground">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

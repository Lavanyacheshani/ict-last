"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Save } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface SiteSetting {
  id: string
  key: string
  value: string
  description: string
}

export function SiteSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    const supabase = createClient()
    const { data, error } = await supabase.from("site_settings").select("*")

    if (!error && data) {
      const settingsMap = data.reduce(
        (acc, setting) => {
          acc[setting.key] = setting.value || ""
          return acc
        },
        {} as Record<string, string>,
      )
      setSettings(settingsMap)
    }
    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()

    const updates = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString(),
    }))

    for (const update of updates) {
      await supabase.from("site_settings").upsert(update, { onConflict: "key" })
    }

    setSaving(false)
  }

  function updateSetting(key: string, value: string) {
    setSettings({ ...settings, [key]: value })
  }

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="text-center">Loading settings...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Site Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="site_title" className="text-foreground">
              Site Title
            </Label>
            <Input
              id="site_title"
              value={settings.site_title || ""}
              onChange={(e) => updateSetting("site_title", e.target.value)}
              className="bg-input border-border text-foreground"
            />
          </div>

          <div>
            <Label htmlFor="hero_title_sinhala" className="text-foreground">
              Hero Title (Sinhala)
            </Label>
            <Input
              id="hero_title_sinhala"
              value={settings.hero_title_sinhala || ""}
              onChange={(e) => updateSetting("hero_title_sinhala", e.target.value)}
              className="bg-input border-border text-foreground"
            />
          </div>

          <div>
            <Label htmlFor="hero_description_sinhala" className="text-foreground">
              Hero Description (Sinhala)
            </Label>
            <Textarea
              id="hero_description_sinhala"
              value={settings.hero_description_sinhala || ""}
              onChange={(e) => updateSetting("hero_description_sinhala", e.target.value)}
              className="bg-input border-border text-foreground"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="about_title_sinhala" className="text-foreground">
              About Title (Sinhala)
            </Label>
            <Input
              id="about_title_sinhala"
              value={settings.about_title_sinhala || ""}
              onChange={(e) => updateSetting("about_title_sinhala", e.target.value)}
              className="bg-input border-border text-foreground"
            />
          </div>

          <div>
            <Label htmlFor="about_description_sinhala" className="text-foreground">
              About Description (Sinhala)
            </Label>
            <Textarea
              id="about_description_sinhala"
              value={settings.about_description_sinhala || ""}
              onChange={(e) => updateSetting("about_description_sinhala", e.target.value)}
              className="bg-input border-border text-foreground"
              rows={5}
            />
          </div>

          <div>
            <Label htmlFor="whatsapp_number" className="text-foreground">
              WhatsApp Number
            </Label>
            <Input
              id="whatsapp_number"
              value={settings.whatsapp_number || ""}
              onChange={(e) => updateSetting("whatsapp_number", e.target.value)}
              className="bg-input border-border text-foreground"
              placeholder="+94771234567"
            />
          </div>

          <div>
            <Label htmlFor="bank_details" className="text-foreground">
              Bank Details
            </Label>
            <Textarea
              id="bank_details"
              value={settings.bank_details || ""}
              onChange={(e) => updateSetting("bank_details", e.target.value)}
              className="bg-input border-border text-foreground"
              rows={4}
              placeholder="Bank: Commercial Bank&#10;Account: 1234567890&#10;Name: Saman Priyakara"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

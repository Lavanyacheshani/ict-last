"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Bell, Menu, X, User } from "lucide-react"
import Link from "next/link"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isClassesPopupOpen, setIsClassesPopupOpen] = useState(false)

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Classes", href: "#classes", hasPopup: true },
    { name: "Results", href: "#results" },
    { name: "Gallery", href: "#gallery" },
    { name: "Contact Us", href: "#contact" },
  ]

  const classOptions = [
    { name: "2025 A/L", href: "/classes/2025-al" },
    { name: "2026 A/L", href: "/classes/2026-al" },
    { name: "2027 A/L", href: "/classes/2027-al" },
    { name: "Lesson Packs", href: "/classes/lesson-packs" },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-foreground">
              Saman Priyakara Sir
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <div key={item.name} className="relative">
                  {item.hasPopup ? (
                    <div className="relative">
                      <Button
                        variant="ghost"
                        className="text-foreground hover:text-accent hover:bg-accent/10 flex items-center gap-2"
                        onClick={() => setIsClassesPopupOpen(!isClassesPopupOpen)}
                      >
                        <BookOpen className="h-4 w-4" />
                        {item.name}
                      </Button>
                      {isClassesPopupOpen && (
                        <Card className="absolute top-full left-0 mt-2 w-48 bg-card border-border shadow-lg">
                          <CardContent className="p-2">
                            {classOptions.map((option) => (
                              <Link
                                key={option.name}
                                href={option.href}
                                className="block px-3 py-2 text-sm text-foreground hover:bg-accent/10 hover:text-accent rounded-md transition-colors"
                                onClick={() => setIsClassesPopupOpen(false)}
                              >
                                {option.name}
                              </Link>
                            ))}
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-foreground hover:text-accent hover:bg-accent/10 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              <Button variant="ghost" size="icon" className="text-foreground hover:text-accent">
                <Bell className="h-4 w-4" />
              </Button>
              <Link href="/auth/login">
                <Button variant="ghost" size="icon" className="text-foreground hover:text-accent">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-foreground">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card border-t border-border">
              {navItems.map((item) => (
                <div key={item.name}>
                  {item.hasPopup ? (
                    <div>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-foreground hover:text-accent hover:bg-accent/10 flex items-center gap-2"
                        onClick={() => setIsClassesPopupOpen(!isClassesPopupOpen)}
                      >
                        <BookOpen className="h-4 w-4" />
                        {item.name}
                      </Button>
                      {isClassesPopupOpen && (
                        <div className="ml-4 mt-2 space-y-1">
                          {classOptions.map((option) => (
                            <Link
                              key={option.name}
                              href={option.href}
                              className="block px-3 py-2 text-sm text-foreground hover:bg-accent/10 hover:text-accent rounded-md transition-colors"
                              onClick={() => {
                                setIsClassesPopupOpen(false)
                                setIsMenuOpen(false)
                              }}
                            >
                              {option.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-accent hover:bg-accent/10 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              <Link
                href="/auth/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-accent hover:bg-accent/10 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

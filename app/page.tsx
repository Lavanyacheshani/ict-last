import { HeroSection } from "@/components/hero-section"
import { Navigation } from "@/components/navigation"
import { AboutSection } from "@/components/about-section"
import { ClassesSection } from "@/components/classes-section"
import { ResultsSection } from "@/components/results-section"
import { GallerySection } from "@/components/gallery-section"
import { ContactSection } from "@/components/contact-section"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ClassesSection />
      <ResultsSection />
      <GallerySection />
      <ContactSection />
    </main>
  )
}

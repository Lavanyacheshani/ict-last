import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-background">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/professional-teacher-in-modern-classroom.png"
          alt="Saman Priyakara Sir"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-background/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Sinhala Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            <span className="text-balance">සමන් ප්‍රියකර මහතා සමඟ</span>
            <br />
            <span className="text-accent">A/L ICT පන්ති</span>
          </h1>

          {/* Sinhala Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            ප්‍රවීණ ICT ගුරුවරයෙකු සමඟ ඔබේ A/L ICT සාර්ථකත්වය සහතික කරගන්න
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="#classes">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                පන්ති බලන්න
              </Button>
            </Link>
            <Link href="#contact">
              <Button
                variant="outline"
                size="lg"
                className="border-accent text-accent hover:bg-accent/10 bg-transparent"
              >
                සම්බන්ධ වන්න
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">15+</div>
              <div className="text-sm text-muted-foreground">වසර අත්දැකීම</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">500+</div>
              <div className="text-sm text-muted-foreground">සාර්ථක සිසුන්</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">95%</div>
              <div className="text-sm text-muted-foreground">සාර්ථකත්ව අනුපාතය</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import { Card, CardContent } from "@/components/ui/card"
import { Award, Users, BookOpen, Target } from "lucide-react"

export function AboutSection() {
  const features = [
    {
      icon: Award,
      title: "ප්‍රවීණ ගුරුවරයා",
      description: "වසර 15කට වැඩි ICT ඉගැන්වීම් අත්දැකීම",
    },
    {
      icon: Users,
      title: "සිසු කේන්ද්‍රීය",
      description: "සෑම සිසුවෙකුගේම අවශ්‍යතාවලට අනුකූල ඉගැන්වීම",
    },
    {
      icon: BookOpen,
      title: "නවීන ක්‍රම",
      description: "නවීන තාක්ෂණය සහ ප්‍රායෝගික ඉගැන්වීම්",
    },
    {
      icon: Target,
      title: "ප්‍රතිඵල කේන්ද්‍රීය",
      description: "ඉහළම ප්‍රතිඵල ලබා ගැනීම සඳහා කැපවීම",
    },
  ]

  return (
    <section id="about" className="py-20 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">ගුරුවරයා ගැන</h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
            වසර 15කට වැඩි අත්දැකීමක් ඇති ICT ගුරුවරයෙකු ලෙස, සමන් ප්‍රියකර මහතා සිසුන්ගේ A/L ICT සාර්ථකත්වය සඳහා කැපවී සිටී. නවීන ඉගැන්වීම් ක්‍රම සහ
            ප්‍රායෝගික අත්දැකීම් මගින් සිසුන්ට ඉහළම ප්‍රතිඵල ලබා ගැනීමට උපකාර කරයි.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card border-border hover:border-accent/50 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground text-balance">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

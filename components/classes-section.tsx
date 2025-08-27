import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import Link from "next/link"

export function ClassesSection() {
  const classes = [
    {
      title: "2025 A/L ICT",
      description: "2025 වර්ෂයේ උසස් පෙළ ICT පන්තිය",
      image: "/students-studying-ict-computer-class.png",
      features: ["සම්පූර්ණ syllabus coverage", "Monthly video lessons", "Practice papers", "Individual attention"],
      href: "/classes/2025-al",
    },
    {
      title: "2026 A/L ICT",
      description: "2026 වර්ෂයේ උසස් පෙළ ICT පන්තිය",
      image: "/modern-computer-laboratory-students.png",
      features: ["Early preparation", "Foundation building", "Practical sessions", "Regular assessments"],
      href: "/classes/2026-al",
    },
    {
      title: "2027 A/L ICT",
      description: "2027 වර්ෂයේ උසස් පෙළ ICT පන්තිය",
      image: "/teacher-explaining-programming-concepts.png",
      features: ["Basic concepts", "Programming fundamentals", "Theory & practical", "Step-by-step learning"],
      href: "/classes/2027-al",
    },
    {
      title: "Lesson Packs",
      description: "විශේෂ පාඩම් පැකේජ",
      image: "/educational-materials-books-notes.png",
      features: ["Targeted topics", "Revision materials", "Past papers", "Quick learning"],
      href: "/classes/lesson-packs",
    },
  ]

  return (
    <section id="classes" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Available Classes</h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Choose from our comprehensive A/L ICT classes designed for different academic years and learning needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {classes.map((classItem, index) => (
            <Card
              key={index}
              className="bg-card border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg"
            >
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={classItem.image || "/placeholder.svg"}
                  alt={classItem.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl text-foreground flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-accent" />
                  {classItem.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{classItem.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {classItem.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={classItem.href}>
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">View Details</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

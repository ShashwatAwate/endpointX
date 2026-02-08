import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "Quest-Based APIs",
    desc: "Solve real-world API challenges structured as quests.",
    icon: "🧩",
  },
  {
    title: "Auto Test Engine",
    desc: "Your APIs are validated automatically with generated tests.",
    icon: "🧪",
  },
  {
    title: "Instant Feedback",
    desc: "Get real-time hints, errors, and performance insights.",
    icon: "⚡",
  },
  {
    title: "Production Mindset",
    desc: "Rate limits, auth, retries, failures—learn it all.",
    icon: "🛠️",
  },
]

export default function Features() {
  return (
    <section className="py-20 px-6 bg-muted/40">
      <h2 className="text-3xl font-bold text-center mb-12">
        Why endpointX?
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
        {features.map((f) => (
          <Card key={f.title} className="hover:scale-[1.02] transition">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>{f.icon}</span>
                {f.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              {f.desc}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

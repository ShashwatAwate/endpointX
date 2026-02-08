import { Badge } from "@/components/ui/badge"

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-35 text-center font-mono">
      <Badge className="mb-4">Gamified API Development</Badge>

      <h1 className="text-5xl font-extrabold tracking-tight mb-6">
        Build APIs.
        <br />
        <span className="text-primary">Level Up Skills.</span>
        <br />
        Ship Faster.
      </h1>

      <p className="mx-auto max-w-xl text-muted-foreground text-lg mb-8">
        endpointX turns API development into a game.
        Complete quests, earn XP, unlock challenges, and master backend engineering.
      </p>
    </section>
  )
}

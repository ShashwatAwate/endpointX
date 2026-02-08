import { Button } from "@/components/ui/button"

export default function CTA() {
  return (
    <section className="py-24 text-center bg-primary text-primary-foreground">
      <h2 className="text-4xl font-bold mb-6">
        Ready to Play the Backend Game?
      </h2>
      <p className="mb-8 opacity-90">
        Stop tutorials. Start shipping APIs that actually work.
      </p>

      <Button size="lg" variant="secondary">
        Enter endpointX
      </Button>
    </section>
  )
}


import { Features } from "@/components/landing/Features";
import Hero from "@/components/landing/Hero";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

export default function LandingPage() {
  return (
    <>
      <div className="relative h-[40rem]">
        {/* Background (interactive) */}
        <div className="absolute inset-0 flex items-center justify-center z-0 blur-[1px]">
          <TextHoverEffect text="endpointX" />
        </div>

        {/* Foreground (visual only) */}
        <div className="relative z-10 pointer-events-none">
          <Hero />
        </div>
      </div>

      {/* Features Heading */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pt-14">
        <div className="text-center space-y-4">
          <span className="inline-block rounded-full border px-4 py-1 text-sm text-neutral-600 dark:text-neutral-400">
            Features
          </span>

          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white">
            Build APIs like you&apos;re playing a game
          </h2>

          <p className="mx-auto max-w-2xl text-base md:text-lg text-neutral-600 dark:text-neutral-400">
            endpointX turns backend development into quests, levels, and rewards —
            so shipping APIs actually feels fun.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <div className="mx-auto max-w-6xl px-4 py-16">
        <Features />
      </div>
    </>
  )
}

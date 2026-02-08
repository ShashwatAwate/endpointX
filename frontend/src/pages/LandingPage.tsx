import Hero from "@/components/landing/Hero";
import Navbar from "@/components/Navbar"
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

export default function LandingPage() {
  return (
    <>
      <Navbar />


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
    </>
  )
}

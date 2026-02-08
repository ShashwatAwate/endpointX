import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b bg-background font-mono">
      {/* Left side */}
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold tracking-tight">
          endpoint<span className="text-primary">X</span>
        </h1>

        <div className="flex gap-2">
          <Button variant="ghost">/features</Button>
          <Button variant="ghost">/docs</Button>
        </div>
      </div>

      {/* Right side */}
      <div className="flex gap-4">
        <Button>Get Started</Button>
        <ModeToggle />
      </div>
    </nav>
  )
}


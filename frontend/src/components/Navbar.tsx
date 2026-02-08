import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b bg-background">
      <h1 className="text-xl font-bold tracking-tight">
        endpoint<span className="text-primary">X</span>
      </h1>

      <div className="flex gap-4">
        <Button variant="ghost">Features</Button>
        <Button variant="ghost">Docs</Button>
        <Button>Get Started</Button>
        <ModeToggle />
      </div>
    </nav>
  )
}


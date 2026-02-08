import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"
import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b bg-background font-mono">
      {/* Left side */}
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold tracking-tight">
          <Link to={"/"}>
            endpoint<span className="text-primary">X</span>
          </Link>
        </h1>

        <div className="flex gap-2">
          <Button variant="ghost">/features</Button>
          <Button variant="ghost">/docs</Button>
        </div>
      </div>

      {/* Right side */}
      <div className="flex gap-4">
        <Button>
          <Link to={"/login"}>/login</Link>
        </Button>
        <Button>
          <Link to={"/signup"}>/signup</Link>
        </Button>
        <ModeToggle />
      </div>
    </nav>
  )
}


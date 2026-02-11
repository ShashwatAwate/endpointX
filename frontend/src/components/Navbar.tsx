import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"

export default function Navbar() {
  const location = useLocation()
  const { user, logout } = useAuth()
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true)
    try {
      await logout()
    } catch (err) {
      console.log("error logging out: ", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <nav className={`${location.pathname == "/" ? "fixed" : ""} h-[10vh] top-0 left-0 w-full z-50 flex items-center justify-between px-6 border-b bg-background font-mono`}>
      {/* Left side */}
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold tracking-tight">
          <Link to={"/"}>
            endpoint<span className="text-primary">X</span>
          </Link>
        </h1>

        <div className="flex gap-2">
          <Link to={"/question"}>
            <Button variant="ghost">/questions</Button>
          </Link>
          <Button variant="ghost">/daily-quest</Button>
          <Button variant="ghost">/leaderboards</Button>
        </div>
      </div>

      {/* Right side */}
      {
        user === null ?
          <div className="flex gap-4">
            <Link to={"/login"}>
              <Button>
                /login
              </Button>
            </Link>

            <Link to={"/signup"}>
              <Button>
                /signup
              </Button>
            </Link>
            <ModeToggle />
          </div> :
          <Button onClick={handleLogout} disabled={loading}>Logout</Button>
      }
    </nav>
  )
}

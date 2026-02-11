import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthCard } from "@/components/AuthCard"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import type { RegisterPayload } from "@/types/user"
import { useState } from "react"
import { Spinner } from "@/components/ui/spinner"

export default function Signup() {
  const { register: formRegister, handleSubmit } = useForm<RegisterPayload>()
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (data: RegisterPayload) => {
    setLoading(true)
    try {
      await register(data)
      navigate("/") // or dashboard
    } catch (err) {
      console.error("Signup failed", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard title="POST /auth/signup">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg p-4 font-mono text-sm text-neutral-200">
          <pre className="text-neutral-500">{`{`}</pre>

          <div className="ml-4 flex items-center gap-2">
            <span className="text-primary">"name"</span>
            <span className="text-primary">:</span>
            <Input
              placeholder='"your_name"'
              className="h-7 rounded-none bg-transparent px-1 placeholder:text-neutral-600 focus-visible:ring-0"
              {...formRegister("name", { required: true })}
            />
          </div>

          <div className="ml-4 mt-2 flex items-center gap-2">
            <span className="text-primary">"email"</span>
            <span className="text-primary">:</span>
            <Input
              type="email"
              placeholder='"you@example.com"'
              className="h-7 rounded-none bg-transparent px-1 placeholder:text-neutral-600 focus-visible:ring-0"
              {...formRegister("email", { required: true })}
            />
          </div>

          <div className="ml-4 mt-2 flex items-center gap-2">
            <span className="text-primary">"password"</span>
            <span className="text-primary">:</span>
            <Input
              type="password"
              placeholder='"••••••••"'
              className="h-7 rounded-none bg-transparent px-1 placeholder:text-neutral-600 focus-visible:ring-0"
              {...formRegister("password", { required: true })}
            />
          </div>

          <pre className="text-neutral-500 mt-2">{`}`}</pre>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Spinner />}
          Create Account
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already registered?{" "}
          <span className="cursor-pointer underline">
            <Link to={"/login"}>
              Login
            </Link>
          </span>
        </p>
      </form>
    </AuthCard>
  )
}

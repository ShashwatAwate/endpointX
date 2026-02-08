import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthCard } from "@/components/AuthCard"

type LoginForm = {
  email: string
  password: string
}

export default function Login() {
  const { register, handleSubmit } = useForm<LoginForm>()

  const onSubmit = (data: LoginForm) => {
    console.log("Login data:", data)
  }

  return (
    <AuthCard title="Login">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="you@example.com"
            {...register("email", { required: true })}
          />
        </div>

        <div className="space-y-2">
          <Label>Password</Label>
          <Input
            type="password"
            placeholder="••••••••"
            {...register("password", { required: true })}
          />
        </div>

        <Button className="w-full" type="submit">
          Login
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          Don’t have an account? <span className="underline cursor-pointer">Sign up</span>
        </p>
      </form>
    </AuthCard>
  )
}

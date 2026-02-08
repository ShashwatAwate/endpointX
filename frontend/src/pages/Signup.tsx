import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthCard } from "@/components/AuthCard"

type SignupForm = {
  name: string
  email: string
  password: string
}

export default function Signup() {
  const { register, handleSubmit } = useForm<SignupForm>()

  const onSubmit = (data: SignupForm) => {
    console.log("Signup data:", data)
  }

  return (
    <AuthCard title="Create Account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            placeholder="Aditya"
            {...register("name", { required: true })}
          />
        </div>

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
          Sign Up
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          Already have an account? <span className="underline cursor-pointer">Login</span>
        </p>
      </form>
    </AuthCard>
  )
}

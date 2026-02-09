import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthCard } from "@/components/AuthCard"
import { Link } from "react-router-dom"

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
    <AuthCard title="POST /auth/signup">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Fake JSON Editor */}
        <div className="rounded-lg p-4 font-mono text-sm text-neutral-200">
          <pre className="text-neutral-500">{`{`}</pre>

          {/* Name */}
          <div className="ml-4 flex items-center gap-2">
            <span className="text-primary">"name"</span>
            <span className="text-primary">:</span>
            <Input
              placeholder='"your_name"'
              className="h-7 rounded-none bg-transparent px-1 placeholder:text-neutral-600 focus-visible:ring-0"
              {...register("name", { required: true })}
            />
          </div>

          {/* Email */}
          <div className="ml-4 mt-2 flex items-center gap-2">
            <span className="text-primary">"email"</span>
            <span className="text-primary">:</span>
            <Input
              type="email"
              placeholder='"you@example.com"'
              className="h-7 rounded-none bg-transparent px-1 placeholder:text-neutral-600 focus-visible:ring-0"
              {...register("email", { required: true })}
            />
          </div>

          {/* Password */}
          <div className="ml-4 mt-2 flex items-center gap-2">
            <span className="text-primary">"password"</span>
            <span className="text-primary">:</span>
            <Input
              type="password"
              placeholder='"••••••••"'
              className="h-7 rounded-none bg-transparent px-1 placeholder:text-neutral-600 focus-visible:ring-0"
              {...register("password", { required: true })}
            />
          </div>

          <pre className="text-neutral-500 mt-2">{`}`}</pre>
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full">
          Create Account
        </Button>

        {/* Footer */}
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

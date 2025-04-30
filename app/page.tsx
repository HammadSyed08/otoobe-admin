import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const metadata: Metadata = {
  title: "Login | Admin Panel",
  description: "Login to the admin panel",
}

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-black">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-5"></div>
      <div className="relative z-10 w-full max-w-md space-y-8 rounded-xl border border-gray-800 bg-gray-900/60 p-8 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-white"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Admin Panel</h1>
          <p className="text-sm text-gray-400">Enter your credentials to access the admin panel</p>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email
            </Label>
            <Input
              id="email"
              placeholder="admin@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-gray-500"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Link href="#" className="text-xs text-gray-400 hover:text-white">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-gray-500"
            />
          </div>
          <Button asChild className="w-full bg-gray-100 text-black hover:bg-white">
            <Link href="/dashboard">Login</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

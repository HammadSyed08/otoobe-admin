import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "Access Terminal | OTOOBE Core",
  description: "Secure entry to OTOOBE Admin Terminal",
};

export default function LoginPage() {
  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-black">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(#4b4b4b33_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      {/* Terminal Login Card */}
      <div className="relative z-20 w-full max-w-md space-y-8 rounded-xl border border-gray-800 bg-gray-900/80 p-10 shadow-[0_0_40px_#00000077] backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-3 text-center">
          {/* Gray Logo */}
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-gray-600 bg-gray-800 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="h-8 w-8 text-gray-300"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-200 drop-shadow-md">
            OTOOBE Admin Terminal
          </h1>
          <p className="text-sm text-gray-400 tracking-wide">
            Authenticate to proceed with system commands
          </p>
        </div>

        {/* Form Inputs */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email
            </Label>
            <Input
              id="email"
              placeholder="admin@otoobe.system"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="border border-gray-700 bg-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-gray-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">
              Pssword
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="password"
              className="border border-gray-700 bg-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-gray-500"
            />
          </div>

          {/* Gray Button */}
          <Button
            asChild
            className="w-full border border-gray-600 bg-gray-200 text-black font-semibold shadow hover:bg-white"
          >
            <Link href="/dashboard">LOGIN</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

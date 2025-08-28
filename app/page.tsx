"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please enter both email and password.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast({
        title: "Login Successful",
        description: "Redirecting to dashboard...",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error?.message || "Invalid credentials or server error.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-black">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(#4b4b4b33_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      {/* Terminal Login Card */}
      <form
        onSubmit={handleSubmit}
        className="relative z-20 w-full max-w-md space-y-8 rounded-xl border border-gray-800 bg-gray-900/80 p-10 shadow-[0_0_40px_#00000077] backdrop-blur-sm"
      >
        <div className="flex flex-col items-center space-y-3 text-center">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@otoobe.system"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="border border-gray-700 bg-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-gray-500"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2 relative">
            <Label htmlFor="password" className="text-gray-300">
              Password
            </Label>
            <Input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="password"
              className="border border-gray-700 bg-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-gray-500 pr-10"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-200"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </div>
      </form>
    </div>
  );
}

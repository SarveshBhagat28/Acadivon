import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel – Brand Showcase ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-12 bg-gradient-to-br from-black via-[#0a1628] to-[#1e3a5f]">
        {/* Math pattern background */}
        <div
          className="absolute inset-0 opacity-[0.07] select-none pointer-events-none"
          aria-hidden="true"
        >
          <svg
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <defs>
              <pattern
                id="mathGrid"
                x="0"
                y="0"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="80"
                  y2="0"
                  stroke="white"
                  strokeWidth="0.5"
                />
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="80"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mathGrid)" />
          </svg>
        </div>

        {/* Floating math symbols */}
        <div
          className="absolute inset-0 overflow-hidden select-none pointer-events-none"
          aria-hidden="true"
        >
          {[
            { text: "∫", x: "10%", y: "15%", size: "4rem", opacity: 0.08 },
            { text: "Σ", x: "80%", y: "10%", size: "3.5rem", opacity: 0.07 },
            { text: "∞", x: "20%", y: "75%", size: "3rem", opacity: 0.09 },
            { text: "π", x: "70%", y: "80%", size: "4rem", opacity: 0.08 },
            { text: "√", x: "50%", y: "20%", size: "3rem", opacity: 0.06 },
            { text: "Δ", x: "85%", y: "50%", size: "3.5rem", opacity: 0.07 },
            { text: "λ", x: "5%", y: "50%", size: "3rem", opacity: 0.08 },
            { text: "∇", x: "60%", y: "65%", size: "3rem", opacity: 0.06 },
            { text: "θ", x: "35%", y: "88%", size: "2.5rem", opacity: 0.07 },
            { text: "∂", x: "90%", y: "30%", size: "3rem", opacity: 0.08 },
          ].map((sym, i) => (
            <span
              key={i}
              className="absolute font-serif text-white"
              style={{
                left: sym.x,
                top: sym.y,
                fontSize: sym.size,
                opacity: sym.opacity,
              }}
            >
              {sym.text}
            </span>
          ))}
        </div>

        {/* Brand content */}
        <div className="relative z-10 flex flex-col items-center text-center gap-6">
          <Logo size="xl" variant="white" />
          <div>
            <h1 className="text-5xl font-extrabold text-white tracking-tight">
              ACADIVON
            </h1>
            <p className="mt-3 text-lg text-blue-200/80 max-w-xs leading-relaxed">
              Your intelligent learning companion
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 w-full max-w-xs text-sm text-blue-100/60">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
              AI-powered study tools
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
              Smart attendance tracking
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
              Personalised timetable insights
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel – Authentication ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo (hidden on desktop) */}
          <div className="flex items-center justify-center gap-3 lg:hidden">
            <Logo size="lg" />
            <span className="text-2xl font-bold text-gray-900">Acadivon</span>
          </div>

          {/* Heading */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-gray-500">
              Sign in to your account to continue learning
            </p>
          </div>

          {/* Email / Password form */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input type="password" placeholder="••••••••" />
            </div>

            <Button className="w-full bg-[#1e3a5f] hover:bg-[#162d4a] text-white h-11">
              Sign In
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social login */}
          <div className="flex flex-col gap-3">
            {/* Google */}
            <Button
              variant="outline"
              className="w-full h-11 flex items-center gap-3 border-gray-200 hover:bg-gray-50"
            >
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M47.532 24.552c0-1.636-.143-3.2-.41-4.694H24v9.01h13.204c-.576 3.017-2.29 5.574-4.863 7.29v6.038h7.873c4.605-4.243 7.318-10.495 7.318-17.644z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.917-2.149 15.89-5.814l-7.873-6.038C29.917 37.74 27.12 38.64 24 38.64c-6.267 0-11.577-4.235-13.476-9.93H2.4v6.232C6.356 42.9 14.586 48 24 48z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.524 28.71A14.37 14.37 0 0 1 9.6 24c0-1.64.284-3.233.924-4.71v-6.232H2.4A23.987 23.987 0 0 0 0 24c0 3.884.917 7.56 2.4 10.942l8.124-6.232z"
                />
                <path
                  fill="#EA4335"
                  d="M24 9.36c3.533 0 6.694 1.215 9.188 3.6l6.877-6.877C35.917 2.149 30.48 0 24 0 14.586 0 6.356 5.1 2.4 13.058l8.124 6.232C12.423 13.595 17.733 9.36 24 9.36z"
                />
              </svg>
              Continue with Google
            </Button>

            {/* Apple */}
            <Button
              variant="outline"
              className="w-full h-11 flex items-center gap-3 border-gray-200 hover:bg-gray-50"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 814 1000"
                aria-hidden="true"
                fill="currentColor"
              >
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 389.4 45 315.2 45 299.3c0-154.4 102.4-236.2 202.4-236.2 53.4 0 98.4 35.2 131.9 35.2 32.2 0 82.8-37.6 144.7-37.6 24.2 0 108.2 2.6 168.6 81.3zm-325.6-87.4c6.4-31.3 21.4-65.3 53.1-91.8 28.4-23.7 61.9-38.7 96.1-38.7 2.6 0 5.2.6 7.8.6-2.6 29-12.3 57.5-32.1 81.2-17.3 21.4-50.7 41.9-84.7 41.9l-40.2-1.2 0 8z" />
              </svg>
              Continue with Apple
            </Button>
          </div>

          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";
import { brandConfig } from "@/lib/branding";

export default function RegisterPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(135deg, ${brandConfig.pageBackground} 0%, ${brandConfig.pageBackgroundSecondary} 50%, ${brandConfig.pageBackground} 100%)`,
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Logo size="lg" linkTo="/" priority={true} />
          <span className="text-3xl font-bold text-gray-900">
            {brandConfig.name}
          </span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Create account</CardTitle>
            <CardDescription className="text-center">
              Join {brandConfig.name} and supercharge your studies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <Input type="text" placeholder="John Doe" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  College / University
                </label>
                <Input type="text" placeholder="MIT" />
              </div>
            </div>

            <Button className="w-full">Create Account</Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-400">
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                Google
              </Button>
              <Button variant="outline" className="w-full">
                GitHub
              </Button>
            </div>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Receipt, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { error: authError } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      if (authError) {
        setError("Invalid email or password. Please try again.");
        setIsLoading(false);
        return;
      }

      // Redirect to home - will be routed based on role
      window.location.href = "/";
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <motion.div 
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo/Brand */}
        <motion.div 
          className="flex items-center justify-center gap-3 mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/30">
            <Receipt className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">ExpenseFlow</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Streamline your expenses</p>
          </div>
        </motion.div>

        <Card className="border-white/20 dark:border-gray-700/30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900 dark:text-white">Welcome back</CardTitle>
            <CardDescription className="text-base text-gray-600 dark:text-gray-400">Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive" className="bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isLoading}
                  className="h-11 bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={isLoading}
                  className="h-11 bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, rememberMe: checked as boolean })
                  }
                  disabled={isLoading}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300"
                >
                  Remember me
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 text-base" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>

              <div className="text-center text-sm pt-2">
                <span className="text-gray-600 dark:text-gray-400">Don't have an account? </span>
                <Link href="/sign-up" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Demo credentials */}
        <Card className="mt-4 border-white/20 dark:border-gray-700/30 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl shadow-lg">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">Demo Accounts:</p>
            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="font-medium">Employee:</span> employee@company.com / password123
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                <span className="font-medium">Manager:</span> manager@company.com / password123
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="font-medium">Admin:</span> admin@company.com / password123
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Receipt, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

type ErrorTypes = Partial<Record<string, string>>;
const errorCodes = {
  USER_ALREADY_EXISTS: "An account with this email already exists",
  WEAK_PASSWORD: "Password is too weak. Use at least 8 characters",
  INVALID_EMAIL: "Please enter a valid email address"
} satisfies ErrorTypes;

const getErrorMessage = (code: string) => {
  if (code in errorCodes) {
    return errorCodes[code as keyof typeof errorCodes];
  }
  return "Registration failed. Please try again.";
};

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const { error: authError } = await authClient.signUp.email({
        email: formData.email,
        name: formData.name,
        password: formData.password,
      });

      if (authError?.code) {
        setError(getErrorMessage(authError.code));
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/sign-in?registered=true");
      }, 2000);
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
            <CardTitle className="text-2xl text-gray-900 dark:text-white">Create your account</CardTitle>
            <CardDescription className="text-base text-gray-600 dark:text-gray-400">Sign up to get started with ExpenseFlow</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive" className="bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Account created successfully! Redirecting to sign in...
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isLoading || success}
                  className="h-11 bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isLoading || success}
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
                  disabled={isLoading || success}
                  className="h-11 bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700"
                />
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Must be at least 8 characters long
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  disabled={isLoading || success}
                  className="h-11 bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 text-base" 
                disabled={isLoading || success}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Account created!
                  </>
                ) : (
                  "Create account"
                )}
              </Button>

              <div className="text-center text-sm pt-2">
                <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
                <Link href="/sign-in" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
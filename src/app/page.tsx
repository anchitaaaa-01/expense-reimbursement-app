"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Loader2, Receipt, ArrowRight, CheckCircle, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && session?.user) {
      const email = session.user.email;
      
      if (email?.includes("admin")) {
        router.push("/admin");
      } else if (email?.includes("manager")) {
        router.push("/manager");
      } else {
        router.push("/employee");
      }
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/20 dark:bg-blue-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-blue-700 dark:text-blue-300">ExpenseFlow</h1>
                <p className="text-xs text-muted-foreground">Smart expense management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Streamline Your Expense Management
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8">
            <span className="text-foreground font-bold">AI-powered chatbot</span> assistance, <span className="text-foreground font-bold">OCR receipt scanning</span>, and <span className="text-foreground font-bold">automated approval</span> workflows 
            in one simple platform.
          </p>
          
          <div className="flex items-center justify-center gap-3">
            <Link href="/sign-up">
              <Button size="lg" className="gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Zap,
              title: "AI-Powered Chatbot",
              description: "Submit expenses, check status, and get instant answers through our intelligent chatbot assistant."
            },
            {
              icon: CheckCircle,
              title: "OCR Receipt Scanning",
              description: "Upload receipts and let our OCR technology automatically extract amounts, dates, and merchant info."
            },
            {
              icon: Shield,
              title: "Automated Approvals",
              description: "Smart approval workflows with role-based access for employees, managers, and administrators."
            }
          ].map((feature, idx) => (
            <Card key={idx} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-blue-100 dark:border-blue-900/50">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-blue-700 dark:text-blue-300">{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Roles Section */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-8">
            Built for Every Role
          </h3>
          <div className="space-y-4">
            {[
              {
                emoji: "👤",
                title: "Employee Portal",
                description: "Chatbot-only experience for effortless expense submission, status tracking, and receipt uploads."
              },
              {
                emoji: "👔",
                title: "Manager Dashboard",
                description: "Approval workflows, pending expense reviews, team analytics, plus integrated chatbot for quick actions."
              },
              {
                emoji: "⚙️",
                title: "Admin Dashboard",
                description: "Complete system control: user management, approval rules, company-wide analytics, and chatbot support."
              }
            ].map((role, idx) => (
              <Card key={idx} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-blue-100 dark:border-blue-900/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">{role.emoji}</span>
                    {role.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {role.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm mt-16 relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 ExpenseFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
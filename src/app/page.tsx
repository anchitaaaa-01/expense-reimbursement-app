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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950 relative overflow-hidden">
      {/* Animated gradient background layers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orbs */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/30 to-indigo-400/30 dark:from-blue-500/20 dark:to-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-[700px] h-[700px] bg-gradient-to-tr from-purple-400/30 to-blue-400/30 dark:from-purple-500/20 dark:to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-bl from-indigo-400/25 to-blue-400/25 dark:from-indigo-500/15 dark:to-blue-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        
        {/* Floating shapes */}
        <div className="absolute top-20 left-[15%] w-32 h-32 bg-blue-300/20 dark:bg-blue-400/10 rounded-full blur-2xl animate-bounce" style={{ animationDuration: "3s" }}></div>
        <div className="absolute bottom-32 right-[20%] w-40 h-40 bg-purple-300/20 dark:bg-purple-400/10 rounded-full blur-2xl animate-bounce" style={{ animationDuration: "4s", animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-[10%] w-24 h-24 bg-indigo-300/20 dark:bg-indigo-400/10 rounded-full blur-2xl animate-bounce" style={{ animationDuration: "5s", animationDelay: "2s" }}></div>
        
        {/* Gradient mesh effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent dark:from-gray-900/50"></div>
      </div>

      {/* Header */}
      <header className="border-b bg-white/90 dark:bg-gray-900/90 backdrop-blur-md relative z-10 shadow-sm">
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
              <Button size="lg" className="gap-2 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline" className="shadow-md hover:shadow-lg transition-all">
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
            <Card key={idx} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-blue-100 dark:border-blue-900/50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 text-blue-700 dark:text-blue-300 mb-4 shadow-md">
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
              <Card key={idx} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-blue-100 dark:border-blue-900/50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
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
      <footer className="border-t bg-white/90 dark:bg-gray-900/90 backdrop-blur-md mt-16 relative z-10 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 ExpenseFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Sophisticated organic background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Noise texture overlay for depth */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px'
        }}></div>

        {/* Organic flowing shapes */}
        <div className="absolute -top-[30%] -right-[15%] w-[70%] h-[70%] opacity-40 dark:opacity-25">
          <div className="w-full h-full bg-gradient-to-br from-blue-200 via-indigo-200 to-blue-300 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-blue-800/40 blur-[100px] animate-blob"></div>
        </div>
        
        <div className="absolute -bottom-[30%] -left-[15%] w-[70%] h-[70%] opacity-40 dark:opacity-25">
          <div className="w-full h-full bg-gradient-to-tr from-indigo-200 via-blue-200 to-indigo-300 dark:from-indigo-900/40 dark:via-blue-900/40 dark:to-indigo-800/40 blur-[100px] animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="absolute top-[20%] left-[30%] w-[50%] h-[50%] opacity-30 dark:opacity-20">
          <div className="w-full h-full bg-gradient-to-bl from-slate-200 via-blue-200 to-slate-300 dark:from-slate-800/40 dark:via-blue-900/40 dark:to-slate-800/40 blur-[80px] animate-blob animation-delay-4000"></div>
        </div>

        {/* Subtle gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-blue-50/40 dark:from-slate-950/60 dark:via-transparent dark:to-slate-900/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50/80 via-transparent to-transparent dark:from-slate-950/80 dark:via-transparent dark:to-transparent"></div>
        
        {/* Radial gradient vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(241,245,249,0.2)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,6,23,0.4)_100%)]"></div>
      </div>

      {/* Header */}
      <header className="border-b border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl relative z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">ExpenseFlow</h1>
                <p className="text-xs text-muted-foreground">Smart expense management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/sign-in">
                <Button variant="ghost" className="hover:bg-slate-100 dark:hover:bg-slate-800">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30">Get Started</Button>
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
              <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline" className="border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-lg transition-all">
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
            <Card key={idx} className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-slate-200/60 dark:border-slate-800/60 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 group">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white mb-4 shadow-lg shadow-blue-500/30 group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all">
                  <feature.icon className="w-6 h-6" />
                </div>
                <CardTitle className="bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">{feature.title}</CardTitle>
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
              <Card key={idx} className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-slate-200/60 dark:border-slate-800/60 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
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
      <footer className="border-t border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl mt-16 relative z-10 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 ExpenseFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1) rotate(120deg);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9) rotate(240deg);
          }
        }
        
        .animate-blob {
          animation: blob 20s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
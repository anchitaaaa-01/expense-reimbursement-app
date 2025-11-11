"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Loader2, Receipt, ArrowRight, CheckCircle, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && session?.user) {
      // Route based on user role (mock for now, will be from database)
      // For demo, we'll use email to determine role
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400" />
        </motion.div>
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950 relative overflow-hidden">
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
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl relative z-10">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
                <Receipt className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ExpenseFlow
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Smart expense management</p>
              </div>
            </motion.div>
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/sign-in">
                <Button variant="ghost" className="hover:bg-blue-50 dark:hover:bg-blue-950">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30">
                  Get Started
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-24 relative z-10">
        <motion.div 
          className="text-center max-w-5xl mx-auto mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Streamline Your
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                Expense Management
              </span>
            </h2>
          </motion.div>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            AI-powered chatbot assistance, OCR receipt scanning, and automated approval workflows 
            in one beautiful platform.
          </motion.p>
          
          <motion.div 
            className="flex items-center justify-center gap-4 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link href="/sign-up">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/30 text-lg px-8 py-6 h-auto">
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto border-2 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950">
                Sign In
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {[
            {
              icon: Zap,
              title: "AI-Powered Chatbot",
              description: "Submit expenses, check status, and get instant answers through our intelligent chatbot assistant.",
              gradient: "from-yellow-400 to-orange-500"
            },
            {
              icon: CheckCircle,
              title: "OCR Receipt Scanning",
              description: "Upload receipts and let our OCR technology automatically extract amounts, dates, and merchant info.",
              gradient: "from-green-400 to-emerald-500"
            },
            {
              icon: Shield,
              title: "Automated Approvals",
              description: "Smart approval workflows with role-based access for employees, managers, and administrators.",
              gradient: "from-blue-400 to-indigo-500"
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="border-white/20 dark:border-gray-700/30 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                <CardHeader>
                  <div className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white mb-4 shadow-lg`}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-xl text-gray-900 dark:text-white">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Roles Section */}
        <motion.div 
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <h3 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Built for Every Role
          </h3>
          <div className="space-y-6">
            {[
              {
                emoji: "👤",
                title: "Employee Portal",
                description: "Chatbot-only experience for effortless expense submission, status tracking, and receipt uploads.",
                gradient: "from-blue-500/10 to-indigo-500/10"
              },
              {
                emoji: "👔",
                title: "Manager Dashboard",
                description: "Approval workflows, pending expense reviews, team analytics, plus integrated chatbot for quick actions.",
                gradient: "from-purple-500/10 to-pink-500/10"
              },
              {
                emoji: "⚙️",
                title: "Admin Dashboard",
                description: "Complete system control: user management, approval rules, company-wide analytics, and chatbot support.",
                gradient: "from-green-500/10 to-emerald-500/10"
              }
            ].map((role, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + idx * 0.1 }}
                whileHover={{ scale: 1.02, x: 10 }}
              >
                <Card className={`border-white/20 dark:border-gray-700/30 bg-gradient-to-br ${role.gradient} backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl text-gray-900 dark:text-white">
                      <span className="text-3xl">{role.emoji}</span>
                      {role.title}
                    </CardTitle>
                    <CardDescription className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                      {role.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl mt-32 relative z-10">
        <div className="container mx-auto px-4 py-10">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>© 2024 ExpenseFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Loader2, LogOut, CheckCircle, Clock, XCircle, DollarSign, TrendingUp, Users, Receipt } from "lucide-react";
import Chatbot from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { authClient } from "@/lib/auth-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

interface Expense {
  id: number;
  title: string;
  amount: number;
  currency: string;
  category: string;
  status: string;
  submittedAt: string;
  user: {
    name: string;
    email: string;
  };
}

export default function ManagerPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    } else if (session?.user) {
      fetchExpenses();
    }
  }, [session, isPending, router]);

  const fetchExpenses = async () => {
    try {
      const response = await fetch("/api/expenses?status=pending&limit=10");
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    const token = localStorage.getItem("bearer_token");
    await authClient.signOut({
      fetchOptions: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    localStorage.removeItem("bearer_token");
    router.push("/sign-in");
  };

  const handleApprove = async (expenseId: number) => {
    try {
      await fetch(`/api/expenses/${expenseId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approverId: 2, comments: "Approved" }),
      });
      fetchExpenses();
    } catch (error) {
      console.error("Failed to approve expense:", error);
    }
  };

  const handleReject = async (expenseId: number) => {
    try {
      await fetch(`/api/expenses/${expenseId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approverId: 2, comments: "Rejected - insufficient documentation" }),
      });
      fetchExpenses();
    } catch (error) {
      console.error("Failed to reject expense:", error);
    }
  };

  if (isPending || isLoading) {
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

  if (!session?.user) return null;

  const stats = {
    pending: expenses.filter(e => e.status === "pending").length,
    totalAmount: expenses.reduce((sum, e) => sum + e.amount, 0),
    thisWeek: 12,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl sticky top-0 z-20 relative">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
                <Receipt className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">ExpenseFlow</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manager Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{session.user.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">Manager</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSignOut}
                className="hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <Tabs defaultValue="dashboard" className="space-y-8">
          <TabsList className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 p-1">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Dashboard</TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Assistant</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Pending Approvals", value: stats.pending, subtitle: "Awaiting your review", icon: Clock, gradient: "from-yellow-400 to-orange-500" },
                { title: "Total Amount", value: `$${stats.totalAmount.toLocaleString()}`, subtitle: "Pending expenses", icon: DollarSign, gradient: "from-green-400 to-emerald-500" },
                { title: "This Week", value: stats.thisWeek, subtitle: "Expenses processed", icon: TrendingUp, gradient: "from-blue-400 to-indigo-500" }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <Card className="border-white/20 dark:border-gray-700/30 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">{stat.title}</CardTitle>
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{stat.subtitle}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Pending Expenses */}
            <Card className="border-white/20 dark:border-gray-700/30 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">Pending Approvals</CardTitle>
                <CardDescription className="text-base text-gray-600 dark:text-gray-400">Review and approve team expense submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {expenses.length === 0 ? (
                      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                        <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg font-medium">No pending approvals</p>
                        <p className="text-sm">All caught up!</p>
                      </div>
                    ) : (
                      expenses.map((expense, idx) => (
                        <motion.div
                          key={expense.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                        >
                          <Card className="border-white/30 dark:border-gray-700/30 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                            <CardContent className="pt-6">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{expense.title}</h3>
                                    <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">{expense.category}</Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    Submitted by {expense.user.name} • {new Date(expense.submittedAt).toLocaleDateString()}
                                  </p>
                                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    {expense.currency} ${expense.amount.toFixed(2)}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900"
                                    onClick={() => handleApprove(expense.id)}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900"
                                    onClick={() => handleReject(expense.id)}
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <div className="h-[calc(100vh-200px)]">
              <Chatbot 
                userId={2} 
                userRole="manager" 
                userName={session.user.name || "Manager"}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
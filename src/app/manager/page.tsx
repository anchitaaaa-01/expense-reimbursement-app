"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Loader2, LogOut, CheckCircle, Clock, XCircle, DollarSign, TrendingUp, Receipt } from "lucide-react";
import Chatbot from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { authClient } from "@/lib/auth-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">ExpenseFlow</h1>
                <p className="text-xs text-muted-foreground">Manager Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{session.user.name}</p>
                <p className="text-xs text-muted-foreground">Manager</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSignOut}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="chat">Assistant</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Pending Approvals", value: stats.pending, subtitle: "Awaiting your review", icon: Clock },
                { title: "Total Amount", value: `$${stats.totalAmount.toLocaleString()}`, subtitle: "Pending expenses", icon: DollarSign },
                { title: "This Week", value: stats.thisWeek, subtitle: "Expenses processed", icon: TrendingUp }
              ].map((stat, idx) => (
                <Card key={idx}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pending Expenses */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Review and approve team expense submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {expenses.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="font-medium">No pending approvals</p>
                        <p className="text-sm">All caught up!</p>
                      </div>
                    ) : (
                      expenses.map((expense) => (
                        <Card key={expense.id}>
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold">{expense.title}</h3>
                                  <Badge variant="secondary">{expense.category}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                  Submitted by {expense.user.name} • {new Date(expense.submittedAt).toLocaleDateString()}
                                </p>
                                <p className="text-2xl font-bold">
                                  {expense.currency} ${expense.amount.toFixed(2)}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleApprove(expense.id)}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReject(expense.id)}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
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
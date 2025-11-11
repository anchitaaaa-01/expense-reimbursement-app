"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Loader2, LogOut, Users, Receipt, TrendingUp, DollarSign, PieChart, BarChart3 } from "lucide-react";
import Chatbot from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { authClient } from "@/lib/auth-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
}

interface Analytics {
  totalSpent: number;
  byCategory: { category: string; amount: number; count: number }[];
  byStatus: { status: string; amount: number; count: number }[];
  byCurrency: { currency: string; amount: number }[];
  monthlyTrends: { month: string; amount: number }[];
}

export default function AdminPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    } else if (session?.user) {
      fetchData();
    }
  }, [session, isPending, router]);

  const fetchData = async () => {
    try {
      const [usersRes, analyticsRes] = await Promise.all([
        fetch("/api/users?limit=100"),
        fetch("/api/analytics"),
      ]);
      const usersData = await usersRes.json();
      const analyticsData = await analyticsRes.json();
      setUsers(usersData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
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

  if (isPending || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session?.user) return null;

  const stats = {
    totalUsers: users.length,
    employees: users.filter(u => u.role === "employee").length,
    managers: users.filter(u => u.role === "manager").length,
    totalSpent: analytics?.totalSpent || 0,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-blue-700 dark:text-blue-300">ExpenseFlow</h1>
                <p className="text-xs text-muted-foreground">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{session.user.name}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
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
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="chat">Assistant</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { title: "Total Users", value: stats.totalUsers, subtitle: "Active accounts", icon: Users },
                { title: "Employees", value: stats.employees, subtitle: `${stats.managers} managers`, icon: Users },
                { title: "Total Spent", value: `$${stats.totalSpent.toLocaleString()}`, subtitle: "All approved expenses", icon: DollarSign },
                { title: "Avg per Employee", value: `$${stats.employees > 0 ? Math.round(stats.totalSpent / stats.employees) : 0}`, subtitle: "Per person", icon: TrendingUp }
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

            {/* Quick Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Expenses by Category</CardTitle>
                  <CardDescription>Breakdown of spending</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics?.byCategory.slice(0, 5).map((item) => (
                      <div key={item.category} className="flex items-center justify-between p-3 rounded-md border">
                        <div className="flex items-center gap-3">
                          <PieChart className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{item.category}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">{item.count}</Badge>
                          <span className="text-sm font-semibold">${item.amount.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Expenses by Status</CardTitle>
                  <CardDescription>Current status breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics?.byStatus.map((item) => (
                      <div key={item.status} className="flex items-center justify-between p-3 rounded-md border">
                        <div className="flex items-center gap-3">
                          <BarChart3 className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium capitalize">{item.status}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">{item.count}</Badge>
                          <span className="text-sm font-semibold">${item.amount.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage system users and their roles</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.department}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Analytics</CardTitle>
                <CardDescription>Comprehensive expense insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-semibold mb-3">Monthly Trends</h3>
                    <div className="space-y-2">
                      {analytics?.monthlyTrends.map((trend) => (
                        <div key={trend.month} className="flex items-center justify-between p-3 rounded-md border">
                          <span className="text-sm font-medium">{trend.month}</span>
                          <span className="text-sm font-semibold">${trend.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold mb-3">Currency Distribution</h3>
                    <div className="space-y-2">
                      {analytics?.byCurrency.map((curr) => (
                        <div key={curr.currency} className="flex items-center justify-between p-3 rounded-md border">
                          <span className="text-sm font-medium">{curr.currency}</span>
                          <span className="text-sm font-semibold">${curr.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <div className="h-[calc(100vh-200px)]">
              <Chatbot 
                userId={3} 
                userRole="admin" 
                userName={session.user.name || "Admin"}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
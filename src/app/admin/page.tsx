"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Loader2, LogOut, Users, Settings, TrendingUp, DollarSign, PieChart, BarChart3 } from "lucide-react";
import Chatbot from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { authClient } from "@/lib/auth-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";

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
    totalUsers: users.length,
    employees: users.filter(u => u.role === "employee").length,
    managers: users.filter(u => u.role === "manager").length,
    totalSpent: analytics?.totalSpent || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"
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
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30">
                <Settings className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">ExpenseFlow</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{session.user.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">Administrator</p>
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
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">Dashboard</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">Users</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">Analytics</TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">Assistant</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: "Total Users", value: stats.totalUsers, subtitle: "Active accounts", icon: Users, gradient: "from-blue-400 to-cyan-500" },
                { title: "Employees", value: stats.employees, subtitle: `${stats.managers} managers`, icon: Users, gradient: "from-purple-400 to-pink-500" },
                { title: "Total Spent", value: `$${stats.totalSpent.toLocaleString()}`, subtitle: "All approved expenses", icon: DollarSign, gradient: "from-green-400 to-emerald-500" },
                { title: "Avg per Employee", value: `$${stats.employees > 0 ? Math.round(stats.totalSpent / stats.employees) : 0}`, subtitle: "Per person", icon: TrendingUp, gradient: "from-orange-400 to-red-500" }
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

            {/* Quick Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-white/20 dark:border-gray-700/30 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 dark:text-white">Expenses by Category</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Breakdown of spending</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.byCategory.slice(0, 5).map((item, idx) => (
                      <motion.div
                        key={item.category}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-white/50 to-blue-50/50 dark:from-gray-900/50 dark:to-blue-950/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                            <PieChart className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.category}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">{item.count} items</Badge>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">${item.amount.toFixed(2)}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/20 dark:border-gray-700/30 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 dark:text-white">Expenses by Status</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Current status breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.byStatus.map((item, idx) => (
                      <motion.div
                        key={item.status}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-white/50 to-purple-50/50 dark:from-gray-900/50 dark:to-purple-950/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{item.status}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">{item.count} items</Badge>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">${item.amount.toFixed(2)}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="border-white/20 dark:border-gray-700/30 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">User Management</CardTitle>
                <CardDescription className="text-base text-gray-600 dark:text-gray-400">Manage system users and their roles</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-gray-900 dark:text-white font-semibold">Name</TableHead>
                        <TableHead className="text-gray-900 dark:text-white font-semibold">Email</TableHead>
                        <TableHead className="text-gray-900 dark:text-white font-semibold">Role</TableHead>
                        <TableHead className="text-gray-900 dark:text-white font-semibold">Department</TableHead>
                        <TableHead className="text-gray-900 dark:text-white font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user, idx) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.03 }}
                          className="border-b border-gray-200 dark:border-gray-700"
                        >
                          <TableCell className="font-medium text-gray-900 dark:text-white">{user.name}</TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-400">{user.email}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={user.role === "admin" ? "default" : "secondary"}
                              className={user.role === "admin" ? "bg-gradient-to-r from-purple-600 to-pink-600" : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"}
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-400">{user.department}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="hover:bg-blue-50 dark:hover:bg-blue-950">
                              Edit
                            </Button>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="border-white/20 dark:border-gray-700/30 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">Detailed Analytics</CardTitle>
                <CardDescription className="text-base text-gray-600 dark:text-gray-400">Comprehensive expense insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Monthly Trends</h3>
                    <div className="space-y-3">
                      {analytics?.monthlyTrends.map((trend, idx) => (
                        <motion.div
                          key={trend.month}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-xl border border-blue-100 dark:border-blue-900"
                        >
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{trend.month}</span>
                          <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            ${trend.amount.toFixed(2)}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Currency Distribution</h3>
                    <div className="space-y-3">
                      {analytics?.byCurrency.map((curr, idx) => (
                        <motion.div
                          key={curr.currency}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 rounded-xl border border-purple-100 dark:border-purple-900"
                        >
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{curr.currency}</span>
                          <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            ${curr.amount.toFixed(2)}
                          </span>
                        </motion.div>
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
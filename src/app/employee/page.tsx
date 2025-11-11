"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Loader2, LogOut, Sparkles, Shield, Zap } from "lucide-react";
import Chatbot from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function EmployeePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    }
  }, [session, isPending, router]);

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

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <div className="absolute inset-0 w-12 h-12 animate-ping rounded-full bg-primary/20" />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Header */}
      <header className="relative border-b border-border/40 bg-card/40 backdrop-blur-xl sticky top-0 z-10 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5" />
        <div className="relative container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600 rounded-2xl blur-md opacity-50" />
              <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-purple-600 text-primary-foreground shadow-xl">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                ExpenseFlow
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Employee Portal
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right px-4 py-2 rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
              <p className="text-sm font-semibold text-foreground">{session.user.name}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                <Zap className="w-3 h-3 text-primary" />
                Employee
              </p>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleSignOut}
              className="hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 hover:scale-105 shadow-md border-border/50"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - Full-screen Chatbot */}
      <main className="relative container mx-auto px-4 py-6 h-[calc(100vh-88px)]">
        <div className="h-full rounded-3xl overflow-hidden shadow-2xl border border-border/50 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl">
          <Chatbot 
            userId={1} 
            userRole="employee" 
            userName={session.user.name || "Employee"}
          />
        </div>
      </main>
    </div>
  );
}
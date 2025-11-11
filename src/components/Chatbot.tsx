"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Paperclip, Shield, AlertTriangle, CheckCircle, Clock, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  suggestions?: string[];
  type?: "normal" | "success" | "warning" | "info" | "fraud-check";
  receiptData?: {
    merchant: string;
    amount: string;
    date: string;
    category: string;
    currency: string;
  };
}

interface ChatbotProps {
  userId: number;
  userRole: string;
  userName: string;
}

type ConversationState = 
  | "verification_email"
  | "verification_otp"
  | "verified"
  | "expense_submission"
  | "receipt_upload"
  | "ocr_processing"
  | "ocr_result"
  | "fraud_detection"
  | "awaiting_comment"
  | "submitted";

export default function Chatbot({ userId, userRole, userName }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationState, setConversationState] = useState<ConversationState>("verification_email");
  const [userEmail, setUserEmail] = useState("");
  const [pendingReceipt, setPendingReceipt] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Welcome message with verification prompt
    const welcomeMessage: Message = {
      id: "welcome",
      text: "👋 Welcome to the Expense Portal!\n\nPlease enter your company email or Employee ID to continue.",
      sender: "bot",
      timestamp: new Date(),
      type: "info"
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addBotMessage = (text: string, type?: Message["type"], options?: Partial<Message>) => {
    const botMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "bot",
      timestamp: new Date(),
      type: type || "normal",
      ...options
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const handleVerificationFlow = (userMessage: string) => {
    if (conversationState === "verification_email") {
      // Simulate email validation
      setUserEmail(userMessage);
      setConversationState("verification_otp");
      
      setTimeout(() => {
        addBotMessage(
          "✅ Thank you!\n\nAn OTP has been sent to your registered email.\nPlease enter the OTP to verify your identity.",
          "info",
          { suggestions: ["123456", "Enter OTP"] }
        );
      }, 800);
      
    } else if (conversationState === "verification_otp") {
      // Simulate OTP verification
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setConversationState("verified");
        addBotMessage(
          `✅ Verification successful!\n\nYou are now logged in as ${userName} (${userRole === "employee" ? "Employee" : userRole === "manager" ? "Manager" : "Admin"}).\n\nHow can I help you today?`,
          "success",
          {
            suggestions: [
              "Submit new expense claim",
              "Check expense status",
              "Upload receipt"
            ]
          }
        );
      }, 1500);
    }
  };

  const handleExpenseFlow = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("submit") || lowerMessage.includes("new expense") || lowerMessage.includes("claim")) {
      setConversationState("receipt_upload");
      setTimeout(() => {
        addBotMessage(
          "Great! Please upload your receipt or take a photo.\n\nI'll extract all the details automatically using our AI-powered OCR technology. 📸",
          "info",
          { suggestions: ["Upload receipt"] }
        );
      }, 800);
      
    } else if (lowerMessage.includes("status") || lowerMessage.includes("check")) {
      setTimeout(() => {
        addBotMessage(
          "📊 Here's your expense summary:\n\n✅ Approved: 3 expenses ($1,450)\n⏳ Pending: 2 expenses ($750)\n❌ Rejected: 0\n\nWould you like details on any specific expense?",
          "info",
          { suggestions: ["Show pending", "Show approved", "View all"] }
        );
      }, 800);
      
    } else if (lowerMessage.includes("upload") || conversationState === "receipt_upload") {
      fileInputRef.current?.click();
    } else {
      setTimeout(() => {
        addBotMessage(
          "I can help you with:\n\n📝 Submit new expense claims\n📊 Check expense status\n📸 Upload receipts with AI OCR\n💰 View reimbursement history\n\nWhat would you like to do?",
          "info",
          { suggestions: ["Submit expense", "Check status", "Upload receipt"] }
        );
      }, 800);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      
      if (conversationState === "verification_email" || conversationState === "verification_otp") {
        handleVerificationFlow(input);
      } else if (conversationState === "awaiting_comment") {
        // Handle fraud risk comment
        addBotMessage(
          `Thank you. Your comment has been added.\n\n✅ Your expense is now sent for manager review.\n\nYou'll receive a notification once it's been processed.`,
          "success"
        );
        setConversationState("verified");
      } else {
        handleExpenseFlow(input);
      }
    }, 500);
  };

  const simulateFraudDetection = (receiptData: any) => {
    setConversationState("fraud_detection");
    
    // Step 1: Show fraud detection started
    const fraudCheckSteps = [
      "Checking for duplicate receipts...",
      "Validating merchant authenticity...",
      "Cross-checking amount with category...",
      "Assessing OCR confidence score..."
    ];

    addBotMessage(
      "⏳ Running Fraud Detection...\n\n" + fraudCheckSteps.join("\n"),
      "fraud-check"
    );

    // Step 2: Simulate processing time and show results
    setTimeout(() => {
      const fraudRisk = Math.random() > 0.5 ? "high" : "low";
      
      if (fraudRisk === "high") {
        addBotMessage(
          `⚠️ **Fraud Risk Detected!**\n\n• This receipt's amount (${receiptData.amount}) is much higher than the average for '${receiptData.category}' at ${receiptData.merchant}.\n• OCR detected possible tampering on amount field.\n• Merchant appears valid.\n• No duplicate found.\n\nYour claim has been **flagged for review** by the manager.\n\nWould you like to add a comment/explanation?`,
          "warning",
          {
            suggestions: [
              "Yes, add comment",
              "No, submit as is",
              "Cancel submission"
            ]
          }
        );
        setConversationState("awaiting_comment");
      } else {
        addBotMessage(
          `✅ **Fraud Check Complete**\n\n• No suspicious activity detected\n• Merchant verified\n• Amount within normal range\n• No duplicates found\n\nYour expense has been submitted for approval! 🎉`,
          "success",
          {
            suggestions: ["Submit another expense", "Check status", "View history"]
          }
        );
        setConversationState("verified");
      }
    }, 4000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: `📎 Uploaded: ${file.name}`,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setConversationState("ocr_processing");
    
    // Show OCR processing message
    addBotMessage(
      "📸 Receipt received.\n\n⏳ Extracting details with OCR...",
      "info"
    );

    // Simulate OCR processing
    setTimeout(() => {
      const mockReceiptData = {
        merchant: "Star Diner",
        amount: "₹12,000",
        date: "2025-10-02",
        category: "Meals",
        currency: "INR"
      };

      setPendingReceipt(mockReceiptData);
      setConversationState("ocr_result");

      addBotMessage(
        "✅ Here's what I found:\n\n" +
        `• **Merchant:** ${mockReceiptData.merchant}\n` +
        `• **Amount:** ${mockReceiptData.amount}\n` +
        `• **Date:** ${mockReceiptData.date}\n` +
        `• **Category:** ${mockReceiptData.category}\n` +
        `• **Currency:** ${mockReceiptData.currency}\n\n` +
        "Would you like to submit this expense?",
        "info",
        {
          receiptData: mockReceiptData,
          suggestions: ["Yes, submit", "Edit details", "Upload different receipt"]
        }
      );
    }, 2500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    const lowerSuggestion = suggestion.toLowerCase();
    
    if (lowerSuggestion.includes("yes, submit") && pendingReceipt) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: "Yes, submit.",
        sender: "user",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      
      // Start fraud detection
      setTimeout(() => {
        simulateFraudDetection(pendingReceipt);
      }, 500);
      
    } else if (lowerSuggestion.includes("upload receipt")) {
      fileInputRef.current?.click();
    } else if (lowerSuggestion.includes("add comment")) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: "Yes, this was a team dinner for an external client.",
        sender: "user",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      
      setTimeout(() => {
        addBotMessage(
          "Thank you. Your comment has been added.\n\n✅ Your expense is now sent for manager review.\n\nYou'll receive a notification once it's been processed.",
          "success",
          {
            suggestions: ["Submit another expense", "Check status", "View history"]
          }
        );
        setConversationState("verified");
      }, 1000);
    } else {
      setInput(suggestion);
    }
  };

  const getMessageIcon = (type?: Message["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "fraud-check":
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="flex flex-col h-full bg-gradient-to-br from-card via-card to-card/80 border-border/50 shadow-2xl backdrop-blur-sm">
      {/* Header */}
      <div className="relative flex items-center gap-3 p-4 border-b border-border/50 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <div className="relative">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
            <Bot className="w-6 h-6" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-card animate-pulse" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-foreground">AI Expense Assistant</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Secured with OCR & Fraud Detection
          </p>
        </div>
        <Badge variant="outline" className="text-xs gap-1 border-green-500/50 text-green-600 dark:text-green-400">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Active
        </Badge>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-transparent to-muted/20">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-2xl flex-shrink-0 shadow-md ${
                  message.sender === "user" 
                    ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground" 
                    : "bg-gradient-to-br from-muted to-muted/80 text-foreground"
                }`}>
                  {message.sender === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={`flex flex-col gap-2 max-w-[80%] ${message.sender === "user" ? "items-end" : ""}`}>
                  <div className={`rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm ${
                    message.sender === "user"
                      ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground"
                      : message.type === "success"
                      ? "bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 text-foreground"
                      : message.type === "warning"
                      ? "bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 text-foreground"
                      : message.type === "fraud-check"
                      ? "bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 text-foreground"
                      : "bg-gradient-to-br from-muted to-muted/80 text-foreground"
                  }`}>
                    {getMessageIcon(message.type) && (
                      <div className="mb-2">{getMessageIcon(message.type)}</div>
                    )}
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                    
                    {message.receiptData && (
                      <div className="mt-3 p-3 rounded-xl bg-background/50 border border-border/50">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Merchant:</span>
                            <p className="font-semibold">{message.receiptData.merchant}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Amount:</span>
                            <p className="font-semibold text-green-600 dark:text-green-400">{message.receiptData.amount}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Date:</span>
                            <p className="font-semibold">{message.receiptData.date}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Category:</span>
                            <p className="font-semibold">{message.receiptData.category}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {message.suggestions && message.suggestions.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-wrap gap-2 mt-1"
                    >
                      {message.suggestions.map((suggestion, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs h-8 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 shadow-sm"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </motion.div>
                  )}
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-muted to-muted/80 text-foreground shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-gradient-to-br from-muted to-muted/80 rounded-2xl px-4 py-3 shadow-lg">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border/50 bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 backdrop-blur-sm">
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 shadow-sm"
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1 bg-background/50 border-border/50 focus:border-primary transition-all duration-300 shadow-sm"
          />
          <Button 
            onClick={handleSend} 
            size="icon" 
            className="flex-shrink-0 bg-gradient-to-br from-primary to-primary/80 hover:scale-105 transition-all duration-300 shadow-md"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
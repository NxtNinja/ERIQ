"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb";
import { Separator } from "@workspace/ui/components/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar";
import {
  User,
  Send,
  Bot,
  UserCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";

interface Message {
  id: number;
  type: "bot" | "user";
  content: string;
  timestamp: Date | null;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      content:
        "Hello! I'm your AI Triage Assistant. I'll help you assess this patient's condition. Let's start with basic information.",
      timestamp: null,
    },
    {
      id: 2,
      type: "bot",
      content: "Could you please provide the patient's age and gender?",
      timestamp: null,
    },
  ]);

  // Initialize timestamps on client side only
  useEffect(() => {
    const now = Date.now();
    setMessages((prev: Message[]) =>
      prev.map((msg: Message, index: number) => ({
        ...msg,
        timestamp:
          msg.timestamp || new Date(now - (prev.length - index) * 1000),
      }))
    );
  }, []);

  const [inputValue, setInputValue] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleSendMessage = (): void => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev: Message[]) => [...prev, newMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        type: "bot",
        content: generateAIResponse(inputValue),
        timestamp: new Date(),
      };
      setMessages((prev: Message[]) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const responses: string[] = [
      "Thank you for that information. Could you describe the patient's primary symptoms?",
      "I understand. What are the current vital signs (blood pressure, heart rate, temperature)?",
      "Based on the symptoms, when did they first appear? Any recent changes?",
      "Does the patient have any relevant medical history or current medications?",
      "I'm analyzing the information provided. Let me assess the risk level and provide recommendations.",
      "Based on the assessment: **Risk Level: MODERATE**\n\n**Possible Diagnoses:**\n- Respiratory infection\n- Cardiac evaluation needed\n\n**Immediate Actions:**\n- Monitor vital signs every 15 minutes\n- Order chest X-ray\n- Consider ECG if chest symptoms persist",
    ];
    return (
      responses[Math.floor(Math.random() * responses.length)] ||
      "I'm sorry, I don't understand. Please try again."
    );
  };

  const formatTime = (timestamp: Date | null): string => {
    if (!timestamp) return "";
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const setQuickMessage = (message: string): void => {
    setInputValue(message);
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Priyangsu Banik
              </h1>
              <p className="text-sm text-gray-500">
                Patient Assessment in Progress
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <div className="bg-green-100 px-3 py-1 rounded-full">
              <span className="text-green-800 text-sm font-medium">
                Active Session
              </span>
            </div>
          </div>
        </header>

        {/* Chat UI */}
        <div className="flex flex-1 flex-col h-[calc(100vh-80px)]">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message: Message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.type === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === "bot" ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  {message.type === "bot" ? (
                    <Bot className="h-4 w-4 text-blue-600" />
                  ) : (
                    <UserCircle className="h-4 w-4 text-gray-600" />
                  )}
                </div>

                {/* Message Content */}
                <div
                  className={`max-w-[70%] ${
                    message.type === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.type === "bot"
                        ? "bg-gray-100 text-gray-900"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t bg-white p-4">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  value={inputValue}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setInputValue(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="Enter patient details, symptoms, vital signs..."
                  className="w-full resize-none border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px] max-h-32"
                  rows={1}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={() =>
                  setQuickMessage("Patient is experiencing chest pain")
                }
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                Chest Pain
              </button>
              <button
                onClick={() =>
                  setQuickMessage("High fever and difficulty breathing")
                }
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                Respiratory Issues
              </button>
              <button
                onClick={() => setQuickMessage("Severe abdominal pain")}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                Abdominal Pain
              </button>
              <button
                onClick={() =>
                  setQuickMessage("Patient fell and may have fracture")
                }
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                Trauma/Injury
              </button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

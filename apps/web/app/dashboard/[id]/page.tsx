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
  Loader2,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Message {
  msg_id?: number;
  msg_content: string;
  msg_type: "ai_response" | "user_prompt";
  chat_session_msgs: string; // session ID
  date_created?: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

interface SessionData {
  session_id?: string;
  id?: string;
}

const DIRECTUS_URL = "https://eriq.onrender.com";
const WS_URL = "wss://eriq.onrender.com/websocket";

export default function Page({ params }: PageProps) {
  const router = useRouter();
  const [patientId, setPatientId] = useState<string>("");
  const [doctorId, setDoctorId] = useState<string>("");
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState<boolean>(true);
  const [sessionError, setSessionError] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [patientName, setPatientName] = useState<string>("");

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize WebSocket connection
  const initializeWebSocket = (session_id: string) => {
    try {
      console.log("Attempting to connect to WebSocket:", WS_URL);
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket open");
        setIsConnected(true);
        ws.send(JSON.stringify({
          type: 'auth',
          access_token: "5Z0uTo5c3CysEUcHPzgpCy-qpgvxhxNG"
        }));

        // Subscribe to the msgs collection for this session
        ws.send(
          JSON.stringify({
            type: "subscribe",
            collection: "msgs",
            query: {
              filter: {
                chat_session_msgs: {
                  _eq: session_id,
                },
              },
            },
          })
        );
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      };

      ws.onclose = (event) => {
        console.warn("WebSocket closed:", event);
        setIsConnected(false);
        // Attempt to reconnect after 3 seconds
        setTimeout(() => {
          if (session_id) {
            initializeWebSocket(session_id);
          }
        }, 3000);
      };

      ws.onmessage = (event) => {
        console.log("WebSocket message:", event.data);
        try {
          const data = JSON.parse(event.data);
          console.log("WebSocket message received:", data);

          if (data.type === "subscription" && data.event === "create") {
            // New message created
            const newMessage = data.data[0];
            setMessages((prev) => {
              // Avoid duplicates
              if (prev.some((msg) => msg.msg_id === newMessage.msg_id)) {
                return prev;
              }
              return [...prev, newMessage].sort(
                (a, b) =>
                  new Date(a.date_created || 0).getTime() -
                  new Date(b.date_created || 0).getTime()
              );
            });
          }
        } catch (parseError) {
          console.error("Error parsing WebSocket message:", parseError);
        }
      };
    } catch (error) {
      console.error("Failed to initialize WebSocket:", error);
      setIsConnected(false);
    }
  };

  // Load existing messages for the session
  const loadExistingMessages = async (session_id: string) => {
    try {
      const response = await axios.get(
        `${DIRECTUS_URL}/items/msgs?filter[chat_session_msgs][_eq]=${session_id}&sort=date_created`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setMessages(response.data.data || []);

      // If no messages exist, add initial bot messages
      if (!response.data.data || response.data.data.length === 0) {
        await sendInitialMessages(session_id);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      // Add initial messages if loading fails
      await sendInitialMessages(session_id);
    }
  };

  // Send initial bot messages
  const sendInitialMessages = async (session_id: string) => {
    const initialMessages = [
      {
        msg_content:
          "Hello! I'm your AI Triage Assistant. I'll help you assess this patient's condition. Let's start with basic information.",
        msg_type: "ai_response" as const,
        chat_session_msgs: session_id,
      },
      {
        msg_content: "Could you please provide the patient's age and gender?",
        msg_type: "ai_response" as const,
        chat_session_msgs: session_id,
      },
    ];

    for (const message of initialMessages) {
      try {
        await axios.post(`${DIRECTUS_URL}/items/msgs`, message, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
      } catch (error) {
        console.error("Error sending initial message:", error);
      }
    }
  };

  // Extract patient_id and doctor_id from URL and create session
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const resolvedParams = await params;
        const routeId = resolvedParams.id;

        // Split the route ID to extract patient_id and doctor_id
        const ids = routeId.split("-");
        if (ids.length < 8) {
          throw new Error("Invalid route format");
        }

        // Reconstruct the UUIDs
        const patientUUID = ids.slice(0, 5).join("-");
        const doctorUUID = ids.slice(5, 10).join("-");

        setPatientId(patientUUID);
        setDoctorId(doctorUUID);

        // Create session with the API
        const response = await axios.post(
          `${DIRECTUS_URL}/items/chat_session?fields=*,doctor_chat_session.*,patient_chat_session.*,patient_chat_session.chat_sessions.*`,
          {
            doctor_chat_session: doctorUUID,
            patient_chat_session: patientUUID,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        console.log("Session creation response:", response.data);

        setPatientName(response.data.data?.patient_chat_session?.name || "");

        const sessionInfo = response.data.data || response.data;
        setSessionData(sessionInfo);
        console.log("Session created successfully:", sessionInfo);

        // Initialize WebSocket and load messages
        if (sessionInfo) {
          const sessionId = sessionInfo.id || sessionInfo.session_id;
          if (sessionId) {
            await loadExistingMessages(sessionId);
            initializeWebSocket(sessionId);
          }
        }
      } catch (error) {
        console.error("Error creating session:", error);
        setSessionError(
          error instanceof Error ? error.message : "Failed to create session"
        );
      } finally {
        setIsLoadingSession(false);
      }
    };

    initializeSession();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []); // Empty dependency array ensures this runs only once
    

  // Send message to Directus
  const sendMessageToDirectus = async (
    content: string,
    type: "user_prompt" | "ai_response"
  ) => {
    if (!sessionData?.id && !sessionData?.session_id) {
      console.error("No session ID available");
      return;
    }

    const session_id = sessionData.id || sessionData.session_id;

    try {
      const response = await axios.post(
        `${DIRECTUS_URL}/items/msgs`,
        {
          msg_content: content,
          msg_type: type,
          chat_session_msgs: session_id,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log("Message sent successfully:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  const handleSendMessage = async (): Promise<void> => {
    if (!inputValue.trim() || !sessionData || isTyping) return;

    const currentInput = inputValue;
    setInputValue("");
    setIsTyping(true);

    try {
      // Send user message
      await sendMessageToDirectus(currentInput, "user_prompt");

      // Simulate AI processing time
      setTimeout(async () => {
        try {
          const aiResponse = generateAIResponse(currentInput);
          await sendMessageToDirectus(aiResponse, "ai_response");
        } catch (error) {
          console.error("Error sending AI response:", error);
        }
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(false);
      // Add message back to input if sending failed
      setInputValue(currentInput);
    }
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

  const formatTime = (timestamp: string | undefined): string => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
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

  const handleUserClick = () => {
    router.push(`/user/${patientId}`);
  };

  // Show loading state while creating session
  if (isLoadingSession) {
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
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600 dark:text-gray-400">
                Creating session and connecting...
              </p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // Show error state if session creation failed
  if (sessionError) {
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
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-red-600" />
              <p className="text-red-600 mb-4">Failed to create session</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {sessionError}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

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
        <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b border-gray-200 dark:border-gray-800 p-4 z-10 bg-white dark:bg-[#0f172a] transition-colors">
          <SidebarTrigger className="-ml-1 text-gray-600 dark:text-gray-300" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4 bg-gray-200 dark:bg-gray-700"
          />
          <div className="flex items-center space-x-3">
            <div
              className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800/70 transition-colors"
              onClick={handleUserClick}
            >
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {patientName || "Patient Assessment"}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Patient Assessment in Progress
              </p>
              {/* Display session info for debugging */}
              <p className="text-xs text-gray-400">
                Patient: {patientId.slice(0, 8)}... | Doctor:{" "}
                {doctorId.slice(0, 8)}...
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <div
              className={`px-3 py-1 rounded-full ${isConnected
                ? "bg-green-100 dark:bg-green-900/50"
                : "bg-red-100 dark:bg-red-900/50"
                }`}
            >
              <span
                className={`text-sm font-medium ${isConnected
                  ? "text-green-800 dark:text-green-300"
                  : "text-red-800 dark:text-red-300"
                  }`}
              >
                {isConnected ? "Connected" : "Connecting..."}
              </span>
            </div>
          </div>
        </header>

        {/* Chat UI */}
        <div className="flex flex-1 flex-col h-[calc(100vh-80px)]">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[#0f172a] transition-colors">
            {messages.map((message: Message) => (
              <div
                key={message.msg_id}
                className={`flex items-start space-x-3 ${message.msg_type === "user_prompt"
                  ? "flex-row-reverse space-x-reverse"
                  : ""
                  }`}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.msg_type === "ai_response"
                    ? "bg-blue-100 dark:bg-blue-900/60"
                    : "bg-gray-100 dark:bg-gray-700"
                    }`}
                >
                  {message.msg_type === "ai_response" ? (
                    <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <UserCircle className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  )}
                </div>

                {/* Message Content */}
                <div
                  className={`max-w-[70%] ${message.msg_type === "user_prompt" ? "text-right" : "text-left"
                    }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 transition-colors ${message.msg_type === "ai_response"
                      ? "bg-white dark:bg-[#1e293b] text-gray-900 dark:text-gray-100 shadow-sm dark:shadow-gray-900/20"
                      : "bg-blue-600 dark:bg-blue-700 text-white dark:text-blue-50"
                      }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.msg_content}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatTime(message.date_created)}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/60">
                  <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="bg-white dark:bg-[#1e293b] rounded-lg px-4 py-2 shadow-sm dark:shadow-gray-900/20">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f172a] p-4 transition-colors">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  value={inputValue}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setInputValue(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="Enter patient details, symptoms, vital signs..."
                  className="w-full resize-none border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px] max-h-32 bg-white dark:bg-[#1e293b] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                  rows={1}
                  disabled={!sessionData || !isConnected}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={
                  !inputValue.trim() || isTyping || !sessionData || !isConnected
                }
                className="bg-blue-600 dark:bg-blue-700 text-white p-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                disabled={!sessionData || !isConnected}
              >
                Chest Pain
              </button>
              <button
                onClick={() =>
                  setQuickMessage("High fever and difficulty breathing")
                }
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                disabled={!sessionData || !isConnected}
              >
                Respiratory Issues
              </button>
              <button
                onClick={() => setQuickMessage("Severe abdominal pain")}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                disabled={!sessionData || !isConnected}
              >
                Abdominal Pain
              </button>
              <button
                onClick={() =>
                  setQuickMessage("Patient fell and may have fracture")
                }
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                disabled={!sessionData || !isConnected}
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
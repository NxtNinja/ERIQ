import { useRouter } from "next/router";
import { useRef, useState } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface Message {
  id?: number;
  msg_content: string;
  msg_type: "bot" | "user";
  chat_session_msgs: string; // session ID
  timestamp?: string;
  date_created?: string;
}

interface SessionData {
  sessionId?: string;
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

  const initializeWebSocket = (sessionId: string) => {
    try {
      const connection = new WebSocket(WS_URL);
      wsRef.current = connection;

      connection.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);

        // Subscribe to the msgs collection for this session
        connection.send(
          JSON.stringify({
            type: "subscribe",
            collection: "msgs",
            query: {
              filter: {
                chat_session_msgs: {
                  _eq: sessionId,
                },
              },
            },
          })
        );
      };
    } catch (error) {
      console.error("WebSocket error:", error);
    }
  };

  return <div>Enter</div>;
}

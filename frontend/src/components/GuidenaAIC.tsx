import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, AlertCircle } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "@/utils/constants";

const GuidenaAIC = ({ disableAutoScroll = false }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content:
        "Hello! I'm GuidenaAI, your AI mentorship assistant. I'm here to help you with coding questions, technical concepts, project guidance, and career advice. What would you like to learn today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!disableAutoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e: any) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${BASE_URL}/ai`,
        {
          prompt: inputValue.trim(),
        },
        { withCredentials: true }
      );

      const data = await response.data;

      if (!data) {
        throw new Error(data.message || "Failed to get AI response");
      }

      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: data.data.response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleKeyPress = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatContent = (content: string) => {
    return content.split("\n").map((line, index) => {
      if (line.startsWith("```") && line.endsWith("```")) {
        return (
          <div
            key={index}
            className="bg-deep-teal/10 rounded-md p-3 my-2 font-mono text-sm border border-deep-teal/20"
          >
            {line.slice(3, -3)}
          </div>
        );
      }
      if (line.startsWith("`") && line.endsWith("`")) {
        return (
          <span
            key={index}
            className="bg-deep-teal/10 px-2 py-1 rounded font-mono text-sm"
          >
            {line.slice(1, -1)}
          </span>
        );
      }
      return (
        line && (
          <p key={index} className="mb-2 last:mb-0">
            {line}
          </p>
        )
      );
    });
  };

  return (
    <div className="min-h-screen bg-off-white ">
      <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-120px)]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.type === "ai" && (
                <div className="w-10 h-10 rounded-full bg-medium-teal flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-off-white" />
                </div>
              )}

              <div
                className={`max-w-[70%] rounded-lg p-4 ${
                  message.type === "user"
                    ? "bg-deep-teal text-off-white"
                    : "bg-light-teal/30 text-deep-teal border border-light-teal/50"
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">
                  {formatContent(message.content)}
                </div>
                <div
                  className={`text-xs mt-2 opacity-70 ${
                    message.type === "user"
                      ? "text-light-teal"
                      : "text-medium-teal"
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>

              {message.type === "user" && (
                <div className="w-10 h-10 rounded-full bg-medium-teal flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-off-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-10 h-10 rounded-full bg-medium-teal flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-off-white" />
              </div>
              <div className="bg-light-teal/30 text-deep-teal border border-light-teal/50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">GuidenaAI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-light-teal/30 p-4 bg-off-white mb-24 md:mb-8">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about coding, tech concepts, or career advice..."
                className="w-full p-3 pr-12 rounded-lg border border-light-teal/50 focus:border-medium-teal focus:outline-none focus:ring-2 focus:ring-medium-teal/20 resize-none min-h-[50px] max-h-32 bg-off-white text-deep-teal placeholder-medium-teal/60"
                rows={1}
                disabled={isLoading}
              />
              <div className="absolute right-2 bottom-2 text-xs text-medium-teal/60">
                Enter to send, Shift+Enter for new line
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !inputValue.trim()}
              className="px-4 py-2 bg-deep-teal text-off-white rounded-lg hover:bg-deep-teal/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 self-end mb-20 md:mb-8"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidenaAIC;

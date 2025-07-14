import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import axios from "axios";
import { format } from "date-fns";
import { Send, ArrowLeft, Loader2, ClockPlus, Video } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// App imports
import { RootState } from "@/store/appStore";
import { BASE_URL } from "@/utils/constants";
import { ChatMessage, RawMessage } from "@/utils/interfaces";
import { createSocketConnection } from "@/utils/socket";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import MeetingScheduler from "@/components/MeetingScheduler";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import GuidenaAIC from "@/components/GuidenaAIC";

const Chat = () => {
  const { receiverId } = useParams();
  const user = useSelector((appStore: RootState) => appStore.user);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [receiverName, setReceiverName] = useState<string>("");
  const [receiverInitials, setReceiverInitials] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const [messageInputValue, setMessageInputValue] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [socket, setSocket] = useState<Socket<DefaultEventsMap> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  useEffect(() => {
    if (user?.data?._id) {
      setUserId(user.data._id);
    } else {
      console.error("No userID found");
    }
  }, [user]);

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const chat = await axios.get(`${BASE_URL}/chat/${receiverId}`, {
          withCredentials: true,
        });

        if (!chat.data) {
          console.log("no chat data received");
          return;
        }

        if (chat?.data?.receiverId) {
          const fullName = `${chat.data.firstName} ${chat.data.lastName}`;
          setReceiverName(fullName);
          setReceiverInitials(
            `${chat.data.firstName.charAt(0)}${chat.data.lastName.charAt(0)}`
          );
        }

        const chatmessages = chat?.data?.data?.messages?.map(
          (msg: RawMessage) => {
            return {
              senderId: msg.senderId._id,
              firstName: msg.senderId?.firstName,
              lastName: msg.senderId?.lastName,
              message: msg.message,
              timeStamp:
                msg?.createdAt ||
                msg?.timestamp ||
                msg?.timeStamp ||
                new Date().toISOString(),
            };
          }
        );

        setMessages(chatmessages);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error("Error fetching chats");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, [receiverId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!socket || !messageInputValue.trim() || !userId) {
      return;
    }

    socket.emit("sendMessage", {
      message: messageInputValue,
      firstName: user?.data.firstName,
      lastName: user?.data.lastName,
      userId: userId,
      receiverId: receiverId,
      timeStamp: Date.now().toLocaleString(),
    });

    const newMessage: ChatMessage = {
      senderId: userId,
      firstName: user?.data.firstName,
      lastName: user?.data.lastName,
      message: messageInputValue,
      timeStamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageInputValue("");
  };

  useEffect(() => {
    if (!userId) {
      console.error("No userID found");
      return;
    }

    const newSocket = createSocketConnection();
    setSocket(newSocket);

    newSocket?.emit("joinChat", {
      userId,
      receiverId,
    });

    newSocket?.on(
      "messageReceived",
      ({ message, firstName, lastName, senderId, timeStamp }) => {
        console.log(
          "message received",
          message,
          firstName,
          lastName,
          "at",
          timeStamp
        );

        setMessages((prevMessages) => {
          const existingMessagesIndex = prevMessages.findIndex(
            (msg) => msg.message === message && msg.senderId === senderId
          );
          if (existingMessagesIndex !== -1) {
            return prevMessages;
          }

          const newMessage: ChatMessage = {
            senderId,
            firstName,
            lastName,
            message,
            timeStamp: timeStamp || new Date().toISOString(),
          };
          return [...prevMessages, newMessage];
        });
      }
    );

    return () => {
      newSocket?.disconnect();
    };
  }, [userId, receiverId]);

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return format(date, "h:mm a");
    } catch (error) {
      console.error(error);
      return "";
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const navigate = useNavigate();
  const joinMeeting = (receiverId: string) => {
    alert(`Sure, you wanna start a meeting now with ${receiverName}?`);
    navigate(`/meet/${receiverId}`);
  };

  return (
    <Card className="flex flex-col h-screen border-none rounded-none">
      <CardHeader className="bg-deep-teal text-off-white py-3 px-4 flex flex-row items-center space-y-0 sticky top-12 z-10">
        <Link to="/mentorships" className="mr-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-off-white hover:bg-medium-teal"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex items-center justify-between w-full gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 bg-light-teal">
              <AvatarFallback className="text-deep-teal font-medium text-sm">
                {receiverInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-lg">
                {receiverName || "Chat"}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <Drawer>
              <DrawerTitle className="hidden">Ask Guidena</DrawerTitle>
              <DrawerTrigger className="cursor-pointer">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-off-white hover:text-white transition-colors">
                        Ask Guidena
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs text-black bg-accent rounded-md p-2 cursor-pointer">
                        Ask your doubts to GuidenaAI{" "}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DrawerTrigger>
              <DrawerContent>
                {" "}
                <GuidenaAIC />
              </DrawerContent>
            </Drawer>
            <Drawer>
              <DrawerTitle className="hidden">Meeting Scheduler</DrawerTitle>
              <DrawerTrigger className="cursor-pointer">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-off-white hover:bg-medium-teal">
                        <ClockPlus className="h-5 w-5 cursor-pointer" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs text-black bg-accent rounded-md p-2 cursor-pointer">
                        Schedule a meeting with {receiverName}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DrawerTrigger>
              <DrawerContent>
                <MeetingScheduler receiverId={receiverId!} />
              </DrawerContent>
            </Drawer>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="" onClick={() => joinMeeting(receiverId!)}>
                    <Video className="h-5 w-5 text-off-white hover:text-medium-teal cursor-pointer" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs text-black bg-accent rounded-md p-2 cursor-pointer">
                    Start a metting with {receiverName}, now!
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <div className="h-full overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full py-10">
              <Loader2 className="h-6 w-6 text-medium-teal animate-spin" />
              <span className="ml-2 text-medium-gray">Loading messages...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center items-center h-full py-10">
              <div className="text-medium-gray text-center">
                <p>No messages yet.</p>
                <p className="text-sm">Start the conversation!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => {
                const isUserMessage = message.senderId === userId;
                return (
                  <div
                    key={`${message.senderId}-${index}`}
                    className={`flex ${
                      isUserMessage ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isUserMessage && (
                      <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0 bg-light-gray">
                        <AvatarFallback className="text-slate-gray text-xs">
                          {getInitials(
                            message?.firstName || "",
                            message?.lastName || ""
                          )}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                        isUserMessage
                          ? "bg-medium-teal text-off-white rounded-br-none"
                          : "bg-light-gray text-slate-gray rounded-bl-none"
                      }`}
                    >
                      {!isUserMessage && (
                        <p className="text-xs font-medium text-medium-gray mb-1">
                          {message.firstName} {message.lastName}
                        </p>
                      )}
                      <p className="break-words">{message.message}</p>
                      <p
                        className={`text-xs mt-1 text-right ${
                          isUserMessage ? "text-light-teal" : "text-medium-gray"
                        }`}
                      >
                        {formatTime(message.timeStamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </CardContent>

      <Separator className="bg-light-gray" />

      <CardFooter className="p-3 bg-off-white sticky bottom-0 z-10">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 w-full"
        >
          <Input
            value={messageInputValue}
            onChange={(e) => setMessageInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full bg-off-white border-light-gray focus-visible:ring-medium-teal"
          />
          <Button
            type="submit"
            disabled={!messageInputValue.trim()}
            size="icon"
            className="bg-warm-coral hover:bg-warm-coral/90 text-off-white rounded-full"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default Chat;

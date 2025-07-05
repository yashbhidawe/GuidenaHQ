import { useEffect, useState } from "react";
import { ConnectionInterface } from "./Requests";
import axios from "axios";
import { BASE_URL } from "@/utils/constants";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, MessageCircleCode, UserX } from "lucide-react";
import { Link } from "react-router-dom";

const Mentorships = () => {
  const [connections, setConnections] = useState<ConnectionInterface[]>([]);

  const [isLoading, setIsLoading] = useState({
    received: false,
    sent: false,
    connections: false,
    action: false,
  });

  const getConnections = async () => {
    setIsLoading((prev) => ({ ...prev, connections: true }));
    try {
      const res = await axios.get(`${BASE_URL}/mentorship/connections`, {
        withCredentials: true,
      });
      console.log("connections", res.data.data);
      setConnections(res.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading((prev) => ({ ...prev, connections: false }));
    }
  };

  const terminateMentorship = async (connection: ConnectionInterface) => {
    setIsLoading((prev) => ({ ...prev, action: true }));
    try {
      alert(
        "Are you sure you want to terminate this mentorship? This action cannot be undone."
      );
      await axios.patch(
        `${BASE_URL}/mentorship/terminate/${connection.connectionId}`,
        {},
        { withCredentials: true }
      );
      toast.success("Mentorship terminated successfully");
      getConnections();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  useEffect(() => {
    getConnections();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 text-center">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-deep-teal mb-2">
          Your Connections
        </h1>
        <p className="text-medium-teal text-lg">
          Manage your connections and chat with them!
        </p>
      </div>

      {isLoading.connections ? (
        <div className="flex justify-center py-20">
          <p className="text-lg text-slate-600">Loading mentorships...</p>
        </div>
      ) : connections.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {connections.map((connection) => (
            <Card
              key={connection.connectionId}
              className="shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <CardHeader className="pb-6">
                <div className="flex items-center gap-5">
                  <Avatar className="h-16 w-16 rounded-full overflow-hidden border-2 border-slate-200">
                    {connection?.user?.avatar ? (
                      <AvatarImage
                        src={connection.user.avatar}
                        alt="Profile picture"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <AvatarFallback className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-700 font-semibold text-lg">
                        {getInitials(
                          connection.user.firstName,
                          connection.user.lastName
                        )}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900">
                      {connection.user.firstName} {connection.user.lastName}
                    </h3>
                    <Badge
                      variant="outline"
                      className="outline outline-deep-teal text-deep-teal mt-2 px-3 py-1"
                    >
                      Active
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="flex gap-3  border-t border-slate-100 pt-4">
                <Link to={`/chat/${connection.user._id}`} className="flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center justify-center gap-2 h-10"
                  >
                    <MessageCircleCode className="h-4 w-4" />
                    Chat
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex items-center gap-2 h-10 px-4"
                  onClick={() => terminateMentorship(connection)}
                  disabled={isLoading.action}
                >
                  <UserX className="h-4 w-4" />
                  Terminate
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="h-12 w-12 text-slate-400 mb-6" />
          <h3 className="text-xl font-semibold text-slate-900 mb-3">
            No active mentorships
          </h3>
          <p className="text-slate-500 max-w-md text-lg">
            You don't have any active mentorships at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default Mentorships;

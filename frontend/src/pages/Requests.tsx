import { BASE_URL } from "@/utils/constants";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  UserX,
  MessageCircleCode,
} from "lucide-react";
import { Link } from "react-router-dom";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  skillsWanted: string[];
  avatar: string;
  userRating: number;
}

interface RequestInterface {
  _id: string;
  mentee: User;
  mentor: User;
  pitchMessage: string;
  status: string;
  isActive: boolean;
  feedback: string;
}

interface ConnectionInterface {
  connectionId: string;
  user: {
    firstName: string;
    lastName: string;
    avatar: string;
    bio: string;
    experience: string;
    email: string;
    skillsOffered?: string[];
    skillsWanted?: string[];
  };
}

const Requests = () => {
  const [receivedRequests, setReceivedRequests] = useState<RequestInterface[]>(
    []
  );
  const [sentRequests, setSentRequests] = useState<RequestInterface[]>([]);
  const [connections, setConnections] = useState<ConnectionInterface[]>([]);
  const [isLoading, setIsLoading] = useState({
    received: false,
    sent: false,
    connections: false,
    action: false,
  });

  const getRequests = async () => {
    setIsLoading((prev) => ({ ...prev, received: true }));
    try {
      const res = await axios.get(`${BASE_URL}/mentorship/request/received`, {
        withCredentials: true,
      });
      setReceivedRequests(res.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading((prev) => ({ ...prev, received: false }));
    }
  };

  const getSentRequests = async () => {
    setIsLoading((prev) => ({ ...prev, sent: true }));
    try {
      const res = await axios.get(`${BASE_URL}/mentorship/request/sent`, {
        withCredentials: true,
      });
      setSentRequests(res.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading((prev) => ({ ...prev, sent: false }));
    }
  };

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

  const reviewRequest = async (request: RequestInterface, status: string) => {
    setIsLoading((prev) => ({ ...prev, action: true }));
    try {
      await axios.post(
        `${BASE_URL}/mentorship/request/review/${status}/${request._id}`,
        {},
        { withCredentials: true }
      );
      toast.success(`Request ${status} successfully`);
      getRequests();
      getSentRequests(); // Refresh both lists
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

  useEffect(() => {
    getRequests();
    getSentRequests();
    getConnections();
  }, []);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Mentorship Requests</h1>

      <Tabs defaultValue="requestsReceived" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="requestsReceived">Requests Received</TabsTrigger>
          <TabsTrigger value="requestsSent">Requests Sent</TabsTrigger>
          <TabsTrigger value="allMentorships">Active Mentorships</TabsTrigger>
        </TabsList>

        <TabsContent value="requestsReceived">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Requests Received</h2>
              <Button
                variant="outline"
                onClick={getRequests}
                disabled={isLoading.received}
              >
                Refresh
              </Button>
            </div>

            {isLoading.received ? (
              <div className="flex justify-center py-10">
                <p>Loading requests...</p>
              </div>
            ) : receivedRequests.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {receivedRequests.map((request) => (
                  <Card key={request._id} className="overflow-hidden">
                    <CardHeader className="bg-slate-50">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 border-2 border-white">
                          {request.mentee.avatar ? (
                            <AvatarImage
                              src={request.mentee.avatar}
                              alt="Profile picture"
                            />
                          ) : (
                            <AvatarFallback>
                              {getInitials(
                                request.mentee.firstName,
                                request.mentee.lastName
                              )}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-medium">
                            {request.mentee.firstName} {request.mentee.lastName}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {request.mentee.email}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-slate-500 mb-2">
                          Message:
                        </h4>
                        <p className="text-slate-700">{request.pitchMessage}</p>
                      </div>

                      {request.mentee.skillsWanted?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-slate-500 mb-2">
                            Skills Wanted:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {request.mentee.skillsWanted.map((skill, index) => (
                              <Badge key={index} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3 bg-slate-50 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => reviewRequest(request, "rejected")}
                        disabled={isLoading.action}
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => reviewRequest(request, "accepted")}
                        disabled={isLoading.action}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Accept
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <AlertCircle className="h-10 w-10 text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-900">
                  No requests received
                </h3>
                <p className="text-slate-500 max-w-md mt-2">
                  You don't have any pending mentorship requests at the moment.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="requestsSent">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Requests Sent</h2>
              <Button
                variant="outline"
                onClick={getSentRequests}
                disabled={isLoading.sent}
              >
                Refresh
              </Button>
            </div>

            {isLoading.sent ? (
              <div className="flex justify-center py-10">
                <p>Loading requests...</p>
              </div>
            ) : sentRequests.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {sentRequests.map((request) => (
                  <Card key={request._id} className="overflow-hidden">
                    <CardHeader className="bg-slate-50">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 border-2 border-white">
                          {request.mentor.avatar ? (
                            <AvatarImage
                              src={request.mentor.avatar}
                              alt="Profile picture"
                            />
                          ) : (
                            <AvatarFallback>
                              {getInitials(
                                request.mentor.firstName,
                                request.mentor.lastName
                              )}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-medium">
                            {request.mentor.firstName} {request.mentor.lastName}
                          </h3>
                          <Badge className="mt-1">{request.status}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-slate-500 mb-2">
                          Your Message:
                        </h4>
                        <p className="text-slate-700">{request.pitchMessage}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3 bg-slate-50 mt-4">
                      {request.status === "pending" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => reviewRequest(request, "revoked")}
                          disabled={isLoading.action}
                        >
                          <XCircle className="h-4 w-4" />
                          Revoke Request
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <AlertCircle className="h-10 w-10 text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-900">
                  No requests sent
                </h3>
                <p className="text-slate-500 max-w-md mt-2">
                  You haven't sent any mentorship requests yet.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="allMentorships">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Active Mentorships</h2>
              <Button
                variant="outline"
                onClick={getConnections}
                disabled={isLoading.connections}
              >
                Refresh
              </Button>
            </div>

            {isLoading.connections ? (
              <div className="flex justify-center py-10">
                <p>Loading mentorships...</p>
              </div>
            ) : connections.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-3">
                {connections.map((connection) => (
                  <Card
                    key={connection.connectionId}
                    className="overflow-hidden"
                  >
                    <CardHeader className="bg-slate-50">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 border-2 border-white">
                          {connection?.user?.avatar ? (
                            <AvatarImage
                              src={connection.user.avatar}
                              alt="Profile picture"
                            />
                          ) : (
                            <AvatarFallback>
                              {getInitials(
                                connection.user.firstName,
                                connection.user.lastName
                              )}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-medium">
                            {connection.user.firstName}{" "}
                            {connection.user.lastName}
                          </h3>
                          <Badge variant="outline" className="mt-1">
                            Active
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardFooter className="flex justify-between bg-slate-50 mt-4">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => terminateMentorship(connection)}
                        disabled={isLoading.action}
                      >
                        <UserX className="h-4 w-4" />
                        Terminate Mentorship
                      </Button>
                      <Link to={`/chat/${connection.connectionId}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <MessageCircleCode className="h-4 w-4" />
                          Chat
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <AlertCircle className="h-10 w-10 text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-900">
                  No active mentorships
                </h3>
                <p className="text-slate-500 max-w-md mt-2">
                  You don't have any active mentorships at the moment.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Requests;

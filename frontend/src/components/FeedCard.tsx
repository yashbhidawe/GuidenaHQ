import { FC, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Send, X, BookOpen, Lightbulb } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "@/utils/constants";
import { Link } from "react-router-dom";

interface FeedCardProps {
  _id: string;
  firstName: string;
  lastName: string;
  experience: string;
  skillsOffered: string[];
  skillsWanted: string[];
  avatar: string;
  userId: string;
}

const FeedCard: FC<FeedCardProps> = ({
  _id,
  firstName,
  lastName,
  experience,
  skillsOffered,
  skillsWanted,
  avatar,
  userId,
}) => {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const [isRequestSent, setIsRequestSent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pitchMessage, setPitchMessage] = useState<string>("");
  const [mentorshipRequestId, setMentorshipRequestId] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const sendRequest = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/mentorship/request/send/${_id}`,
        { pitchMessage },
        {
          withCredentials: true,
        }
      );
      setMentorshipRequestId(res.data.data._id);
      setIsRequestSent(true);
      toast.success(`Request sent to ${firstName} ${lastName}`);
      setIsDialogOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const revokeRequest = async () => {
    setIsLoading(true);
    try {
      await axios.delete(
        `${BASE_URL}/mentorship/request/revoke/${mentorshipRequestId}`,
        {
          withCredentials: true,
        }
      );
      setIsRequestSent(false);
      setMentorshipRequestId("");
      toast.info("Request revoked successfully");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-l-teal-500">
      <div className="p-6">
        <Link to={`/profile/${userId}`} key={userId}>
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16 ring-2 ring-offset-2 ring-teal-500">
              <AvatarImage src={avatar} alt={`${firstName} ${lastName}`} />
              <AvatarFallback className="bg-gradient-to-br from-teal-400 to-teal-600 text-white text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-800">
                  {firstName} {lastName}
                </h3>
                {isRequestSent && (
                  <Badge className="bg-teal-100 text-teal-800">
                    Request Sent
                  </Badge>
                )}
              </div>
              <p className="text-gray-500 text-sm mt-1">{experience}</p>
            </div>
          </div>
        </Link>
        <CardContent className="p-0 space-y-4">
          {skillsOffered.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={16} className="text-teal-500" />
                <h4 className="font-semibold text-gray-700">Can teach</h4>
              </div>
              <div className="flex flex-wrap gap-2 ml-4">
                {skillsOffered.map((skill, index) => (
                  <Badge
                    key={`offered-${index}`}
                    className="bg-teal-50 hover:bg-teal-100 text-teal-700 border-teal-200 py-1"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {skillsWanted.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={16} className="text-purple-500" />
                <h4 className="font-semibold text-gray-700">Wants to learn</h4>
              </div>
              <div className="flex flex-wrap gap-2 ml-4">
                {skillsWanted.map((skill, index) => (
                  <Badge
                    key={`wanted-${index}`}
                    className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 py-1"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </div>

      <CardFooter className="bg-gray-50 p-4 flex justify-center items-center border-t">
        {isRequestSent ? (
          <Button
            variant="outline"
            className="w-full text-red-500 hover:bg-red-50 border-red-200 flex items-center justify-center gap-2"
            onClick={revokeRequest}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <X size={16} />
            )}
            Revoke Request
          </Button>
        ) : (
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white flex items-center justify-center gap-2">
                <Send size={16} />
                Connect with {firstName}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white sm:max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl text-gray-800">
                  Connect with{" "}
                  <span className="text-teal-600">{firstName}</span>
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-600">
                  Explain how you can help each other grow. What specific value
                  can you bring to this connection?
                </AlertDialogDescription>
                <Textarea
                  placeholder="I noticed you're interested in learning AWS. I've been working with AWS for 3 years and would love to share my knowledge while learning React from you..."
                  value={pitchMessage}
                  onChange={(e) => setPitchMessage(e.target.value)}
                  className="mt-2 h-32 border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                />
                <div className="text-xs text-gray-500 mt-1 flex justify-between">
                  <span>{pitchMessage.length} characters</span>
                  <span>
                    {pitchMessage.length > 0
                      ? "Looking good!"
                      : "Please write a message"}
                  </span>
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-2">
                <AlertDialogCancel className="mt-0 bg-gray-100 hover:bg-gray-200 text-gray-700">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                  onClick={() => {
                    if (pitchMessage.length < 10) {
                      toast.error(
                        "Please write a more detailed message (at least 10 characters)"
                      );
                      return;
                    }
                    sendRequest();
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : null}
                  Send Request
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  );
};

export default FeedCard;

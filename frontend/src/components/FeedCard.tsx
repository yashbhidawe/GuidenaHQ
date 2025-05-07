import { FC, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { BASE_URL } from "@/utils/constants";

interface FeedCardProps {
  _id: string;
  firstName: string;
  lastName: string;
  experience: string;
  skillsOffered: string[];
  skillsWanted: string[];
  avatar: string;
}

const FeedCard: FC<FeedCardProps> = ({
  _id,
  firstName,
  lastName,
  experience,
  skillsOffered,
  skillsWanted,
  avatar,
}) => {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const [isRequestSent, setIsRequestSent] = useState<boolean>(false);
  const [mentorshipRequestId, setMentorshipRequestId] = useState<string>("");
  //   const [mentorshipRequestStatus, setMentorshipRequestStatus] =
  //     useState<string>("");

  const sendRequest = async () => {
    const res = await axios.post(
      `${BASE_URL}/mentorship/request/send/${_id}`,
      {},
      {
        withCredentials: true,
      }
    );
    setMentorshipRequestId(res.data.data._id);
  };

  const revokeRequest = async () => {
    await axios.delete(
      `${BASE_URL}/mentorship/request/revoke/${mentorshipRequestId}`,
      {
        withCredentials: true,
      }
    );
  };
  return (
    <Card className="w-full overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-l-teal-500">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16 ring-2 ring-offset-2 ring-teal-500">
            <AvatarImage src={avatar} alt={`${firstName} ${lastName}`} />
            <AvatarFallback className="bg-gradient-to-br from-teal-400 to-teal-600 text-white text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {firstName} {lastName}
            </h3>
            <p className="text-gray-500 text-sm mt-1">{experience}</p>
          </div>
        </div>

        <CardContent className="p-0 space-y-4">
          {skillsOffered.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-teal-500"></div>
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
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
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
            className="w-full text-teal-500 hover:bg-teal-50"
            onClick={() => {
              revokeRequest();
              setIsRequestSent(false);
            }}
          >
            Revoke Request
          </Button>
        ) : (
          <Button
            variant="default"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white"
            onClick={() => {
              sendRequest();
              setIsRequestSent(true);
            }}
          >
            Send Request
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default FeedCard;

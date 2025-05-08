import { BASE_URL } from "@/utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FeedCard from "../components/FeedCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelector } from "react-redux";
import { RootState } from "@/store/appStore";

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  experience: string;
  skillsOffered: string[];
  skillsWanted: string[];
  avatar: string;
  relationshipType?: "mentor" | "mentee";
}

interface BothFeedData {
  mentors: UserData[];
  mentees: UserData[];
}

const Feed = () => {
  const [mentorUsers, setMentorUsers] = useState<UserData[]>([]);
  const [menteeUsers, setMenteeUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const currentUser = useSelector((state: RootState) => state.user);
  const userRole = currentUser?.role || "both";

  const getFeed = async () => {
    try {
      setLoading(true);

      if (userRole === "mentor") {
        const res = await axios.get(`${BASE_URL}/teach`, {
          withCredentials: true,
        });
        setMenteeUsers(res.data.data);
      } else if (userRole === "mentee") {
        const res = await axios.get(`${BASE_URL}/learn`, {
          withCredentials: true,
        });
        setMentorUsers(res.data.data);
      } else if (userRole === "both") {
        const res = await axios.get(`${BASE_URL}/both`, {
          withCredentials: true,
        });
        const bothData = res.data.data as BothFeedData;
        setMentorUsers(bothData.mentors);
        setMenteeUsers(bothData.mentees);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unauthorized";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, [userRole]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ">
      <Tabs defaultValue="mentors" className="w-full">
        <TabsList className="grid w-full md:w-80 grid-cols-2">
          <TabsTrigger value="mentors">Find Mentors</TabsTrigger>
          <TabsTrigger value="mentees">Find Mentees</TabsTrigger>
        </TabsList>

        <TabsContent value="mentors" className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            People Who Can Mentor You
          </h2>
          {mentorUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No mentors found
              </h3>
              <p className="text-gray-500">
                We couldn't find any mentors matching your skill interests at
                the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentorUsers.map((user) => (
                <FeedCard
                  key={user._id}
                  _id={user._id}
                  firstName={user.firstName}
                  lastName={user.lastName}
                  experience={user.experience}
                  skillsOffered={user.skillsOffered}
                  skillsWanted={user.skillsWanted}
                  avatar={user.avatar}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="mentees" className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            People You Can Mentor
          </h2>
          {menteeUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No mentees found
              </h3>
              <p className="text-gray-500">
                We couldn't find any mentees who need your skills at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menteeUsers.map((user) => (
                <FeedCard
                  key={user._id}
                  _id={user._id}
                  firstName={user.firstName}
                  lastName={user.lastName}
                  experience={user.experience}
                  skillsOffered={user.skillsOffered}
                  skillsWanted={user.skillsWanted}
                  avatar={user.avatar}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Feed;

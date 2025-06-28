import { BASE_URL } from "@/utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FeedCard from "../components/FeedCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store/appStore";
import { Link } from "react-router-dom";
import { Users, GraduationCap, BookOpen } from "lucide-react";

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
  const userRole = currentUser?.data?.role || "both";

  const skillsWanted = currentUser?.data?.skillsWanted?.length || 0;
  const skillsOffered = currentUser?.data?.skillsOffered?.length || 0;

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
        if (!res.data || !res.data.data) {
          throw new Error("No data found");
        }

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
      <div className="flex flex-col justify-center items-center min-h-[500px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-deep-teal"></div>
        <p className="text-gray-600 animate-pulse">Loading your community...</p>
      </div>
    );
  }

  if (skillsWanted === 0 && skillsOffered === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-16 px-4">
        <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 bg-deep-teal/10 rounded-full flex items-center justify-center mb-6">
              <Users className="w-10 h-10 text-deep-teal" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Your Community
            </h2>
            <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
              Add the skills you want to learn or skills you can teach others to
              discover your mentoring community and start meaningful
              connections.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-deep-teal hover:bg-deep-teal/90 shadow-lg"
            >
              <Link to="/profile/edit">
                <BookOpen className="w-5 h-5 mr-2" />
                Complete Your Profile
              </Link>
            </Button>
            <p className="text-sm text-gray-500 mt-6">
              Once you update your profile, you'll see relevant mentors and
              mentees here.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <Tabs defaultValue="mentors" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto h-12 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger
            value="mentors"
            className="data-[state=active]:bg-deep-teal data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200 rounded-md font-medium"
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            Find Mentors
          </TabsTrigger>
          <TabsTrigger
            value="mentees"
            className="data-[state=active]:bg-deep-teal data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200 rounded-md font-medium"
          >
            <Users className="w-4 h-4 mr-2" />
            Find Mentees
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mentors" className="mt-10">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Mentors Ready to Guide You
              </h2>
              <p className="text-gray-600 text-lg">
                Learn from experienced professionals in your field
              </p>
            </div>

            {mentorUsers.length === 0 ? (
              <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="flex flex-col items-center justify-center p-16 text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                    <GraduationCap className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No mentors found
                  </h3>
                  <p className="text-gray-600 max-w-md text-lg leading-relaxed">
                    We couldn't find any mentors matching your skill interests
                    at the moment. Check back soon for new matches!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mentorUsers.map((user) => (
                  <FeedCard
                    _id={user._id}
                    firstName={user.firstName}
                    lastName={user.lastName}
                    experience={user.experience}
                    skillsOffered={user.skillsOffered}
                    skillsWanted={user.skillsWanted}
                    avatar={user.avatar}
                    userId={user._id}
                    key={user._id}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="mentees" className="mt-10">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                People Ready to Learn from You
              </h2>
              <p className="text-gray-600 text-lg">
                Share your knowledge and help others grow
              </p>
            </div>

            {menteeUsers.length === 0 ? (
              <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="flex flex-col items-center justify-center p-16 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <Users className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No mentees found
                  </h3>
                  <p className="text-gray-600 max-w-md text-lg leading-relaxed">
                    We couldn't find any mentees who need your skills at the
                    moment. New learners join regularly!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {menteeUsers.map((user) => (
                  <FeedCard
                    _id={user._id}
                    firstName={user.firstName}
                    lastName={user.lastName}
                    experience={user.experience}
                    skillsOffered={user.skillsOffered}
                    skillsWanted={user.skillsWanted}
                    avatar={user.avatar}
                    userId={user._id}
                    key={user._id}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Feed;

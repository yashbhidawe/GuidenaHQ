import { BASE_URL } from "@/utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface UserInterface {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  avatar: string;
  experience: string;
  skillsOffered: string[];
  skillsWanted: string[];
}

const Profile = () => {
  const { userID } = useParams<{ userID: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInterface | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getUserProfile = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching profile for user ID:", userID);

      const response = await axios.get(`${BASE_URL}/profile/${userID}`, {
        withCredentials: true,
      });

      console.log("Profile response:", response.data);

      if (response.data.data) {
        setUser(response.data.data);
        setIsOwnProfile(response.data.isOwnProfile);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);

      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.message || "Failed to fetch profile";
        toast.error(errorMsg);

        // Handle authentication errors
        if (error.response?.status === 401) {
          toast.error("Please log in to view profiles");
          navigate("/auth");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userID) {
      getUserProfile();
    }
  }, [userID]); // Re-fetch when userID changes

  const handleEditProfile = () => {
    navigate("/profile/edit");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {user ? (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${user.firstName}'s avatar`}
                    className="w-24 h-24 rounded-full object-cover mr-6"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mr-6">
                    <span className="text-3xl text-gray-500">
                      {user.firstName.charAt(0)}
                      {user.lastName.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              {isOwnProfile && (
                <button
                  onClick={handleEditProfile}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Bio</h3>
                <p className="text-gray-700">{user.bio || "No bio provided"}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Experience</h3>
                <p className="text-gray-700">
                  {user.experience || "No experience information provided"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Skills</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  Skills Offered
                </h4>
                {user.skillsOffered && user.skillsOffered.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.skillsOffered.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No skills offered</p>
                )}
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  Skills Wanted
                </h4>
                {user.skillsWanted && user.skillsWanted.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.skillsWanted.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No skills wanted</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold text-gray-700">No user found</h2>
          <p className="text-gray-500 mt-2">
            The user profile you're looking for doesn't exist or has been
            removed.
          </p>
        </div>
      )}
    </div>
  );
};

export default Profile;

import { BASE_URL } from "@/utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
//TODO: apne ko kal subah uthke edit ki functionality bnani, aur phir chat aur scheduling pe kaam karna hai kal se isi hafte chat ka kaam ho jana chahiye
const Profile = () => {
  interface userInterface {
    firstName: string;
    lastName: string;
    email: string;
    bio: string;
    avatar: string;
    experience: string;
    skillsOffered: string[];
    skillsWanted: string[];
  }

  const { userID } = useParams<{ userID: string }>();
  const [user, setUser] = useState<userInterface>();
  //   const loggedInUser = useSelector(
  //     (state: { user: { user: { id: string } } }) => state.user.user._id
  //   );
  const getUserProfile = async () => {
    try {
      //   console.log("Logged in user ID:", loggedInUser);
      //   console.log("User ID from URL:", userID);
      //   let isOwnProfile = false;
      // userID === loggedInUser._id ? isOwnProfile = true : (isOwnProfile = false);

      const response = await axios.get(`${BASE_URL}/profile/${userID}`);
      setUser(response.data.data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "unable to edit";
      console.log(errorMessage);
    }
  };
  useEffect(() => {
    getUserProfile();
  }, []);
  return (
    <div>
      <h1>Profile</h1>
      {user ? (
        <div>
          <h2>
            {user.firstName} {user.lastName}
          </h2>
          <p>Email: {user.email}</p>
          <p>Bio: {user.bio}</p>
          <p>Experience: {user.experience}</p>
          <p>Skills Offered: {user.skillsOffered.join(", ")}</p>
          <p>Skills Wanted: {user.skillsWanted.join(", ")}</p>
        </div>
      ) : (
        <div>
          <h2>No user found</h2>
        </div>
      )}
    </div>
  );
};

export default Profile;

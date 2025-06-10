import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { RootState } from "@/store/appStore";
import { BASE_URL } from "@/utils/constants";
import { toast } from "react-toastify";
import { addUser } from "@/store/slices/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loader } from "@/components/Loader";

const EditProfile: React.FC = () => {
  const user = useSelector((appStore: RootState) => appStore.user);
  console.log("User data in EditProfile:", user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  interface FormData {
    firstName: string;
    lastName: string;
    bio: string;
    experience: string;
    skillsOffered: string;
    skillsWanted: string;
  }
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    bio: "",
    experience: "",
    skillsOffered: "",
    skillsWanted: "",
  });
  const formatSkills = (skills: string[] | undefined): string => {
    return Array.isArray(skills) ? skills.join(", ") : "";
  };
  useEffect(() => {
    if (user) {
      console.log("Setting form data from user:", user);
      setFormData({
        firstName: user?.data?.firstName || "",
        lastName: user?.data?.lastName || "",
        bio: user?.data?.bio || "",
        experience: user?.data?.experience || "",
        skillsOffered: formatSkills(user.data.skillsOffered),
        skillsWanted: formatSkills(user.data.skillsWanted),
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Process the skills arrays before sending
      const updatedData = {
        ...formData,
        skillsOffered: formData.skillsOffered
          ? formData.skillsOffered
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        skillsWanted: formData.skillsWanted
          ? formData.skillsWanted
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      };

      console.log("Sending updated data:", updatedData);

      const response = await axios.patch(
        `${BASE_URL}/profile/edit`,
        updatedData,
        { withCredentials: true }
      );

      console.log("Profile updated:", response.data);
      toast.success("Profile updated successfully");

      dispatch(addUser(response.data));

      navigate(`/profile/${user?.data._id}`);
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update profile");
    }
  };

  if (!user) return <Loader />;

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
          />
        </div>

        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
          />
        </div>

        <div>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Bio"
          />
        </div>

        <div>
          <label htmlFor="experience">Experience</label>
          <input
            id="experience"
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Experience"
          />
        </div>

        <div>
          <label htmlFor="skillsOffered">Skills Offered</label>
          <input
            id="skillsOffered"
            type="text"
            name="skillsOffered"
            value={formData.skillsOffered}
            onChange={handleChange}
            placeholder="Skills Offered (comma separated)"
          />
        </div>

        <div>
          <label htmlFor="skillsWanted">Skills Wanted</label>
          <input
            id="skillsWanted"
            type="text"
            name="skillsWanted"
            value={formData.skillsWanted}
            onChange={handleChange}
            placeholder="Skills Wanted (comma separated)"
          />
        </div>

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default EditProfile;

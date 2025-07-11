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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EditProfile: React.FC = () => {
  const user = useSelector((appStore: RootState) => appStore.user);
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
      setFormData({
        firstName: user?.data?.firstName || "",
        lastName: user?.data?.lastName || "",
        bio: user?.data?.bio || "",
        experience: user?.data?.experience || "",
        skillsOffered: formatSkills(user.data?.skillsOffered),
        skillsWanted: formatSkills(user.data?.skillsWanted),
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

      if (
        !updatedData.skillsOffered.length &&
        !updatedData.skillsWanted.length
      ) {
        toast.error("Please provide at least one skill offered or wanted");
        return;
      }

      const response = await axios.patch(
        `${BASE_URL}/profile/edit`,
        updatedData,
        { withCredentials: true }
      );

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
    <div className="max-w-2xl mx-auto p-4">
      <Card className="border-light-teal shadow-lg">
        <CardHeader className="bg-gradient-to-r from-medium-teal to-deep-teal text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      user?.data?.avatar ||
                      "https://avatar.iran.liara.run/public/boy?username=Ash"
                    }
                    alt="Profile"
                    className="w-16 h-16 rounded-full border border-light-teal"
                  />
                  <Button
                    asChild
                    className="bg-light-teal hover:bg-medium-teal text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                  >
                    <label htmlFor="profilePicture" className="cursor-pointer">
                      Change Picture
                    </label>
                  </Button>
                  <input
                    type="file"
                    id="profilePicture"
                    name="profilePicture"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        toast.info("Uploading profile picture...");
                        const formData = new FormData();
                        formData.append("avatar", file);
                        try {
                          const response = await axios.patch(
                            `${BASE_URL}/profile/edit`,
                            formData,
                            { withCredentials: true }
                          );
                          dispatch(addUser(response.data));
                          toast.success("Profile picture updated successfully");
                        } catch (error) {
                          console.error(
                            "Error uploading profile picture:",
                            error
                          );
                          toast.error("Failed to update profile picture");
                        }
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-deep-teal font-medium"
                  >
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    className="border-light-teal focus:border-medium-teal focus:ring-medium-teal"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-deep-teal font-medium"
                  >
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    className="border-light-teal focus:border-medium-teal focus:ring-medium-teal"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-deep-teal font-medium">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  className="border-light-teal focus:border-medium-teal focus:ring-medium-teal min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="experience"
                  className="text-deep-teal font-medium"
                >
                  Experience
                </Label>
                <Input
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Years of experience or expertise level"
                  className="border-light-teal focus:border-medium-teal focus:ring-medium-teal"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="skillsOffered"
                  className="text-deep-teal font-medium"
                >
                  Skills Offered
                </Label>
                <Input
                  id="skillsOffered"
                  name="skillsOffered"
                  value={formData.skillsOffered}
                  onChange={handleChange}
                  placeholder="React, Node.js, Python (comma separated)"
                  className="border-light-teal focus:border-medium-teal focus:ring-medium-teal"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="skillsWanted"
                  className="text-deep-teal font-medium"
                >
                  Skills Wanted
                </Label>
                <Input
                  id="skillsWanted"
                  name="skillsWanted"
                  value={formData.skillsWanted}
                  onChange={handleChange}
                  placeholder="Machine Learning, Design, Marketing (comma separated)"
                  className="border-light-teal focus:border-medium-teal focus:ring-medium-teal"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-deep-teal hover:bg-medium-teal text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                Update Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProfile;

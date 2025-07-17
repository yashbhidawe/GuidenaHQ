//SingupFrom.tsx
import { addUser } from "@/store/slices/userSlice";
import { BASE_URL } from "@/utils/constants";
import { tokenManager } from "@/utils/tokenManager";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

interface SignupFormProps {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSignUp: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  experience: string;
  password: string;
  skillsOffered: string[];
  skillsWanted: string[];
  avatar?: File | null;
  previewUrl?: string;
}
const SignupForm: React.FC<SignupFormProps> = ({
  isLoading,
  setIsLoading,
  setIsSignUp,
}) => {
  const [signUpFormData, setSignUpFormData] = useState<SignUpFormData>({
    firstName: "",
    lastName: "",
    email: "",
    role: "mentee",
    experience: "",
    password: "",
    avatar: null,
    previewUrl: "",
    skillsOffered: [],
    skillsWanted: [],
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB!");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type");
        return;
      }
      setSignUpFormData((prev) => ({
        ...prev,
        avatar: file,
        previewUrl: URL.createObjectURL(file),
      }));
    }
  };

  const dispatch = useDispatch();

  //   const removeImage = () => {
  //   setSignUpFormData((prev) => ({
  //     ...prev,
  //     avatar: null,
  //     previewUrl: "",
  //   }));
  // };
  const handleSignup = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (
        !signUpFormData.firstName ||
        !signUpFormData.lastName ||
        !signUpFormData.email ||
        !signUpFormData.password
      ) {
        console.log("Please fill in all fields");
        toast.error("Please fill in all fields");
        return;
      }
      setIsLoading(true);

      const formData = new FormData();
      formData.append("firstName", signUpFormData.firstName);
      formData.append("lastName", signUpFormData.lastName);
      formData.append("email", signUpFormData.email);
      formData.append("role", signUpFormData.role);
      formData.append("experience", signUpFormData.experience);
      formData.append("password", signUpFormData.password);
      formData.append(
        "skillsOffered",
        JSON.stringify(signUpFormData.skillsOffered)
      );
      formData.append(
        "skillsWanted",
        JSON.stringify(signUpFormData.skillsWanted)
      );

      if (signUpFormData.avatar) {
        formData.append("avatar", signUpFormData.avatar);
      }

      const response = await axios.post(`${BASE_URL}/signup`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("User created successfully");

        tokenManager.setToken(response.data.token);
        dispatch(addUser(response.data.data));
        localStorage.setItem(
          "loggedInUser",
          JSON.stringify(response.data.data)
        );

        setIsSignUp(false);
        setIsLoading(false);
        setSignUpFormData({
          firstName: "",
          lastName: "",
          email: "",
          role: "both",
          experience: "",
          password: "",
          previewUrl: "",
          avatar: null,
          skillsOffered: [],
          skillsWanted: [],
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unauthorized";
      console.log(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form className="space-y-4" onSubmit={handleSignup}>
        <div className="space-y-2 flex">
          <span>
            {" "}
            <label
              htmlFor="signup-name"
              className="block text-slate-700 font-medium"
            >
              First Name
            </label>
            <input
              id="signup-name"
              type="text"
              value={signUpFormData.firstName}
              onChange={(e) =>
                setSignUpFormData({
                  ...signUpFormData,
                  firstName: e.target.value,
                })
              }
              placeholder="Enter your first name"
              className="w-full px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-700"
            />
          </span>

          <span>
            <label
              htmlFor="signup-last-name"
              className="block text-slate-700 font-medium"
            >
              Last Name
            </label>
            <input
              id="signup-name"
              type="text"
              value={signUpFormData.lastName}
              onChange={(e) =>
                setSignUpFormData({
                  ...signUpFormData,
                  lastName: e.target.value,
                })
              }
              placeholder="Enter your first name"
              className="w-full px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-700"
            />
          </span>
        </div>
        {signUpFormData.previewUrl ? (
          <div className="relative">
            <img
              src={signUpFormData.previewUrl}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300"></div>
        )}
        <div className="space-y-2">
          <label htmlFor="profilePicture" className="mt-2 cursor-pointer">
            <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              Upload Photo
            </span>
            <input
              id="profilePicture"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="signup-email"
            className="block text-slate-700 font-medium"
          >
            Email Address
          </label>
          <input
            id="signup-email"
            type="email"
            value={signUpFormData.email}
            onChange={(e) =>
              setSignUpFormData({
                ...signUpFormData,
                email: e.target.value,
              })
            }
            placeholder="your@email.com"
            className="w-full px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-700"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="signup-password"
            className="block text-slate-700 font-medium"
          >
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            value={signUpFormData.password}
            onChange={(e) =>
              setSignUpFormData({
                ...signUpFormData,
                password: e.target.value,
              })
            }
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-700"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="signup-experience"
            className="block text-slate-700 font-medium"
          >
            Experience (in years)
          </label>
          <input
            id="signup-experience"
            type="number"
            min="0"
            step="1"
            value={signUpFormData.experience}
            onChange={(e) =>
              setSignUpFormData({
                ...signUpFormData,
                experience: e.target.value,
              })
            }
            placeholder="0"
            className="w-full px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-700"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="signup-skills-offered"
            className="block text-slate-700 font-medium"
          >
            Skills you offer (comma separated)
          </label>
          <input
            id="signup-skills-offered"
            type="text"
            value={signUpFormData.skillsOffered.join(", ")}
            onChange={(e) =>
              setSignUpFormData({
                ...signUpFormData,
                skillsOffered: e.target.value
                  .split(",")
                  .map((skill) => skill.trim()),
              })
            }
            placeholder="eg. React, Javascript, Firebase"
            className="w-full px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-700"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="signup-skills-wanted"
            className="block text-slate-700 font-medium"
          >
            Skills you would like to learn (comma separated)
          </label>
          <input
            id="signup-skills-wanted"
            type="text"
            value={signUpFormData.skillsWanted.join(", ")}
            onChange={(e) =>
              setSignUpFormData({
                ...signUpFormData,
                skillsWanted: e.target.value
                  .split(",")
                  .map((skill) => skill.trim()),
              })
            }
            placeholder="eg. FastAPI, Django, Laravel"
            className="w-full px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-700"
          />
        </div>
        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-teal-700 hover:bg-teal-800 text-white font-medium py-3 px-4 rounded-md transition-colors duration-300"
            disabled={isLoading}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;

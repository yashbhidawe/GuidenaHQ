//SingupFrom.tsx
import { BASE_URL } from "@/utils/constants";
import axios from "axios";
import React from "react";
import { toast } from "react-toastify";

interface SignupFormProps {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSignUp: React.Dispatch<React.SetStateAction<boolean>>;
}
const SignupForm: React.FC<SignupFormProps> = ({
  isLoading,
  setIsLoading,
  setIsSignUp,
}) => {
  const [signUpFormData, setSignUpFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "mentee",
    experience: "",
    password: "",
  });

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
        return;
      }
      setIsLoading(true);
      const response = await axios.post(`${BASE_URL}/signup`, signUpFormData, {
        withCredentials: true,
      });
      if (response.status === 200) {
        toast.success("User created successfully");
      }

      setIsSignUp(false);
      setIsLoading(false);
      setSignUpFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: "mentee",
        experience: "",
        password: "",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unauthorized";
      console.log(errorMessage);
      toast.error(errorMessage);
    }
  };
  return (
    <div>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          handleSignup(e);
        }}
      >
        <div className="space-y-2">
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
        </div>
        <div className="space-y-2">
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

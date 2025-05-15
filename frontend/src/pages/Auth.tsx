import React from "react";
import axios from "axios";
import { BASE_URL } from "@/utils/constants";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addUser } from "@/store/slices/userSlice";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isSignUp, setIsSignUp] = React.useState(false);

  const [loginFormData, setLoginFormData] = React.useState({
    email: "",
    password: "",
  });

  const [signUpFormData, setSignUpFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "mentee",
    experience: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const handleLogout = async () => {
  //   try {
  //     const response = await axios.get(`${BASE_URL}/logout`, {
  //       withCredentials: true,
  //     });
  //     if (response.status === 200) {
  //       toast.success("Logged out successfully");
  //       dispatch({ type: "REMOVE_USER" });
  //     }
  //   } catch (error) {
  //     const errorMessage =
  //       error instanceof Error ? error.message : "Unauthorized";
  //     console.log(errorMessage);
  //     toast.error(errorMessage);
  //   }
  // };

  const handleLogin = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (!loginFormData.email || !loginFormData.password) {
        console.log("Please fill in all fields");
        return;
      }
      const response = await axios.post(`${BASE_URL}/login`, loginFormData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success("Logged in successfully");
      }

      dispatch(addUser(response.data.data));
      localStorage.setItem("loggedInUser", JSON.stringify(response.data.data));
      navigate("/");
      console.log("Response:", response);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unauthorized";
      console.log(errorMessage);
      toast.error(errorMessage);
    }
  };

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
      const response = await axios.post(`${BASE_URL}/signup`, signUpFormData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success("User created successfully");
      }

      setIsSignUp(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unauthorized";
      console.log(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border-t-4 border-teal-700">
        <h2 className="text-3xl font-bold mb-6 text-teal-800 text-center">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h2>

        {isSignUp ? (
          <div className="space-y-4">
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
                onClick={handleSignup}
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-medium py-3 px-4 rounded-md transition-colors duration-300"
              >
                Sign Up
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="login-email"
                className="block text-slate-700 font-medium"
              >
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                value={loginFormData.email}
                onChange={(e) =>
                  setLoginFormData({ ...loginFormData, email: e.target.value })
                }
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-700"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="login-password"
                className="block text-slate-700 font-medium"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={loginFormData.password}
                onChange={(e) =>
                  setLoginFormData({
                    ...loginFormData,
                    password: e.target.value,
                  })
                }
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-700"
              />
            </div>

            <div className="flex justify-end">
              <button className="text-teal-700 hover:text-teal-800 text-sm">
                Forgot Password?
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={handleLogin}
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-medium py-3 px-4 rounded-md transition-colors duration-300"
              >
                Log In
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-slate-600">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
            >
              {isSignUp ? "Log In" : "Sign Up"}
            </button>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-500 text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;

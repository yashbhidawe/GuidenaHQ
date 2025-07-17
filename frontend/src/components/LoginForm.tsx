//LoginForm.tsx

import { addUser } from "@/store/slices/userSlice";
import { BASE_URL } from "@/utils/constants";
import { tokenManager } from "@/utils/tokenManager";
import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface LoginFormProps {
  isLoading?: boolean;
  setIsLoading: (value: boolean) => void;
}
const LoginForm: React.FC<LoginFormProps> = ({ isLoading, setIsLoading }) => {
  const [loginFormData, setLoginFormData] = React.useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      if (!loginFormData.email || !loginFormData.password) {
        toast.error("Please fill in all fields");
        return;
      }

      const response = await axios.post(`${BASE_URL}/login`, loginFormData);

      if (response.status === 200) {
        toast.success("Logged in successfully");
        tokenManager.setToken(response.data.token);

        dispatch(addUser(response.data.data));
        localStorage.setItem(
          "loggedInUser",
          JSON.stringify(response.data.data)
        );

        setIsLoading(false);
        setLoginFormData({ email: "", password: "" });
        navigate("/");
      }
    } catch (error) {
      setIsLoading(false);
      const errorMessage =
        error instanceof Error ? error.message : "Unauthorized";
      console.log(errorMessage);
      toast.error(errorMessage);
    }
  };
  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg ">
      <form
        className=""
        onSubmit={(e) => {
          handleLogin(e);
        }}
      >
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
            type="submit"
            className="w-full bg-teal-700 hover:bg-teal-800 text-white font-medium py-3 px-4 rounded-md transition-colors duration-300"
            disabled={isLoading}
          >
            Log In
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;

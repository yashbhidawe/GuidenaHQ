//Auth.tsx

import React from "react";

import SignupForm from "@/components/SingupForm";
import LoginForm from "@/components/LoginForm";
import { Button } from "@/components/ui/button";

const Auth = () => {
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border-t-4 border-teal-700">
        <h2 className="text-3xl font-bold mb-6 text-teal-800 text-center">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h2>

        {isSignUp ? (
          <SignupForm
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setIsSignUp={setIsSignUp}
          />
        ) : (
          <LoginForm isLoading={isLoading} setIsLoading={setIsLoading} />
        )}
        <div>
          <Button>Continue with Google</Button>
        </div>

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

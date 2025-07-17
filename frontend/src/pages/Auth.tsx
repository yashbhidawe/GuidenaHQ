import React, { useEffect } from "react";
import SignupForm from "@/components/SingupForm";
import LoginForm from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { BASE_URL } from "@/utils/constants";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "react-toastify";
import { setupAxiosInterceptors } from "@/utils/axios";
import { tokenManager } from "@/utils/tokenManager";

const Auth = () => {
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const error = urlParams.get("error");

    console.log("URL params:", urlParams.toString());
    console.log("Token from URL:", token);
    console.log("Error from URL:", error);

    if (token) {
      console.log("about to set tokens:", token);

      tokenManager.setToken(token); // This automatically sets up axios interceptors
      localStorage.setItem("token", token);

      setupAxiosInterceptors();

      setTimeout(() => {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
        toast.success("Successfully logged in with Google!");
      }, 500);
    }

    if (error) {
      let errorMessage = "Login failed. Please try again.";
      if (error === "auth_failed") {
        errorMessage = "Google authentication failed. Please try again.";
      } else if (error === "auth_processing_failed") {
        errorMessage = "Authentication processing failed. Please try again.";
      }
      toast.error(errorMessage);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  const handleGoogleLogin = () => {
    setIsLoading(true);
    try {
      window.location.href = `${BASE_URL}/google`;
    } catch (error) {
      console.error("Google login failed:", error);
      toast.error("Failed to initiate Google login. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
        <div className="w-full max-w-lg space-y-6">
          <div className="flex justify-center">
            <Badge variant="outline" className="px-4 py-2 text-sm font-medium ">
              <Sparkles className="w-4 h-4 mr-2" />
              {isSignUp ? "Join likeminded learners" : "Welcome back"}
            </Badge>
          </div>

          <Card className=" border-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <CardHeader className="space-y-1 text-center pb-4">
              <CardTitle className="text-3xl font-bold tracking-tight">
                {isSignUp ? "Create your account" : "Sign in to your account"}
              </CardTitle>
              <CardDescription className="text-base">
                {isSignUp
                  ? "Start your skill-sharing journey and connect with amazing people"
                  : "Welcome back! We're excited to see you again"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <Button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                variant="outline"
                size="lg"
                className="w-full h-12 font-medium text-base border-2 hover:bg-accent hover:text-accent-foreground transition-all duration-200 group"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <FcGoogle className="w-5 h-5" />
                    <span>Continue with Google</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-4 text-muted-foreground font-medium tracking-wider">
                    Or continue with email
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                {isSignUp ? (
                  <SignupForm
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    setIsSignUp={setIsSignUp}
                  />
                ) : (
                  <LoginForm
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                  />
                )}
              </div>

              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  {isSignUp
                    ? "Already have an account?"
                    : "Don't have an account?"}
                </p>
                <Button
                  variant="link"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="p-0 h-auto font-semibold text-primary hover:text-primary/80"
                >
                  {isSignUp ? "Sign in instead" : "Create an account"}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="bg-muted/30 border-0">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-center text-muted-foreground leading-relaxed">
                  By continuing, you agree to our{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-xs underline"
                  >
                    Terms of Service
                  </Button>{" "}
                  and{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-xs underline"
                  >
                    Privacy Policy
                  </Button>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Auth;

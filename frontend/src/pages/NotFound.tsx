import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-light-teal to-white p-4">
      <Card className="border-light-teal shadow-xl max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <h1 className="text-8xl font-bold text-deep-teal mb-2">404</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-medium-teal to-deep-teal mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold text-deep-teal mb-2">
              Page Not Found
            </h2>
            <p className="text-gray-600">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleGoHome}
              className="w-full bg-deep-teal hover:bg-medium-teal text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;

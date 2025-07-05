import { BASE_URL } from "@/utils/constants";
import axios from "axios";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, LogOut, Edit, User2 } from "lucide-react";
import { Link } from "react-router-dom";
import SearchComponent from "./SearchComponent";
import { useSelector } from "react-redux";
import { RootState } from "@/store/appStore";

const Navbar = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
      localStorage.removeItem("loggedInUser");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  const user = useSelector((appStore: RootState) => appStore.user?.data);

  return (
    <nav className="bg-deep-teal border-b border-deep-teal/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <a
            href="/"
            className="text-white text-lg font-semibold hover:text-white/80 transition-colors flex-shrink-0"
          >
            GuidenaHQ
          </a>

          <div className="flex-1 max-w-lg mx-8 hidden md:block">
            <SearchComponent />
          </div>

          <div className="hidden md:flex items-center space-x-6 flex-shrink-0">
            <Link
              to="/mentorships"
              className="text-white/90 hover:text-white text-sm font-medium transition-colors"
            >
              Chats
            </Link>
            <Link
              to="/requests"
              className="text-white/90 hover:text-white text-sm font-medium transition-colors"
            >
              Requests
            </Link>
            <Link
              to="/guidena-ai"
              className="text-white/90 hover:text-white text-sm font-medium transition-colors"
            >
              Talk to GuidenaAI
            </Link>
          </div>

          {user && (
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full hover:bg-white/10"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user?.avatar}
                        alt={user?.firstName || "User"}
                      />
                      <AvatarFallback className="bg-white/20 text-white text-xs">
                        {user?.firstName ? (
                          user.firstName.charAt(0).toUpperCase()
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user?.firstName && (
                        <p className="font-medium">
                          {user.firstName + user.lastName}
                        </p>
                      )}
                      {user?.email && (
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to={`/profile/${user?._id}`}
                      className="flex items-center cursor-pointer"
                    >
                      <User2 className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/profile/edit"
                      className="flex items-center cursor-pointer"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="md:hidden ml-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/10"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <div className="p-2">
                      <SearchComponent />
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <a href="/mentorships" className="cursor-pointer">
                        Chat
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="/requests" className="cursor-pointer">
                        Requests
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="/gidena-ai" className="cursor-pointer">
                        Talk to GuidenaAI
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

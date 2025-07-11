import { Separator } from "@radix-ui/react-separator";
import { BookOpen, Globe, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="min-h-screen bg-off-white flex items-center justify-center px-4">
      <div className="w-full max-w-6xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-deep-teal mb-6 leading-tight">
            Learn Anything.
            <span className="block text-medium-teal">Teach Everything.</span>
            <span className="block text-light-teal">Connect Directly.</span>
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Join a community where knowledge flows freely. Find your perfect
            mentor or share your expertise with learners worldwide.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <Link to="/auth">
            <button className="w-full sm:w-auto bg-medium-teal hover:bg-medium-teal/90 text-white px-8 sm:px-24 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
              Join Now
            </button>
          </Link>
        </div>

        <div className="hidden sm:flex flex-row items-center justify-center gap-6 text-gray-600">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span className="text-sm sm:text-base">Growing Community</span>
          </div>
          <Separator
            orientation="vertical"
            className="h-6 w-[2px] bg-gray-300 mx-2"
          />
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            <span className="text-sm sm:text-base">Any Skill</span>
          </div>
          <Separator
            orientation="vertical"
            className="h-6 w-[2px] bg-gray-300 mx-2"
          />
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            <span className="text-sm sm:text-base">Worldwide</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

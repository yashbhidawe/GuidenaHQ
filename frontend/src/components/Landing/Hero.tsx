import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="w-full h-72 flex items-center justify-center flex-col bg-light-teal text-off-white gap-4">
      <h1 className="font-bold text-5xl">
        Welcome to <span className="text-deep-teal ">GuidenaHQ</span>
        <span className="after:w-4 after:h-4 "></span>
      </h1>
      <p className="text-2xl">Your one stop destination for mentorships</p>

      <Link to="/auth">
        {" "}
        <button
          type="button"
          className="bg-medium-teal hover:bg-deep-teal px-5 py-2 border rounded-xl border-none text-off-white cursor-pointer transition-all "
        >
          Get Started
        </button>
      </Link>
    </div>
  );
};

export default Hero;

import { Bot } from "lucide-react";
import GuidenaAIC from "../components/GuidenaAIC";
const GuidenaAI = () => {
  return (
    <div className="flex flex-col min-h-screen bg-light-teal text-off-white">
      {" "}
      <div className="bg-deep-teal text-off-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Bot className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">GuidenaAI</h1>
            <p className="text-light-teal">Your AI Development Mentor</p>
          </div>
        </div>
      </div>
      <GuidenaAIC disableAutoScroll={true} />
    </div>
  );
};

export default GuidenaAI;

import React from "react";
import { Button } from "./components/ui/button";

const App = () => {
  const [count, setCount] = React.useState(0);
  return (
    <div className="text-4xl flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-deep-teal">GuidenaHQ is coming soon!</h1>
      <h2 className="text-2xl text-gray-700">
        Excitement is: Excientment X {count}
      </h2>
      <Button
        variant="default"
        onClick={() => setCount(count + 1)}
        className="mt-2 cursor-pointer"
      >
        {" "}
        Excited?{" "}
      </Button>
    </div>
  );
};

export default App;

import React from "react";

export const Spinner = () => {
  return (
    <div className="flex flex-row gap-2 items-center justify-center">
      <div className="w-4 h-4 rounded-full bg-green-500 animate-bounce [animation-delay:.7s]"></div>
      <div className="w-4 h-4 rounded-full bg-green-500 animate-bounce [animation-delay:.3s]"></div>
      <div className="w-4 h-4 rounded-full bg-green-500 animate-bounce [animation-delay:.7s]"></div>
    </div>
  );
};

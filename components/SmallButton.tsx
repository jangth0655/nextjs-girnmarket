import React from "react";

interface SmallButtonProps {
  children?: React.ReactNode;
  text: string;
}

const SmallButton: React.FC<SmallButtonProps> = ({ text, children }) => {
  return (
    <button className="rounded-lg text-sm p-1 flex justify-center items-center w-full transition-all bg-red-400 text-white hover:bg-red-500 cursor-pointer">
      {text} {children ? children : null}
    </button>
  );
};

export default SmallButton;

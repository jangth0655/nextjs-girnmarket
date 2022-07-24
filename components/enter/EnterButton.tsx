import { cls } from "@libs/client/cls";
import React from "react";

interface ButtonProps {
  text: string;
  loading?: boolean;
  errorState?: boolean;
}

const EnterButton: React.FC<ButtonProps> = ({ text, loading, errorState }) => {
  return (
    <button
      className={cls(
        errorState ? "opacity-50" : "",
        "w-full bg-red-200 rounded-md py-2 text-white hover:bg-red-500 transition-all cursor-pointer"
      )}
    >
      {loading ? "Loading..." : text}
    </button>
  );
};

export default EnterButton;

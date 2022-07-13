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
        "w-full bg-pink-500 rounded-md py-2 text-white"
      )}
    >
      {loading ? "Loading..." : text}
    </button>
  );
};

export default EnterButton;

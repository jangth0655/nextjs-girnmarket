import { cls } from "@libs/client/cls";
import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  text: string;
  id?: string;
  placeholder: string;
  register?: UseFormRegisterReturn;
  errorState?: boolean;
}

const EnterInput: React.FC<InputProps> = ({
  text,
  id,
  placeholder,
  register,
  errorState,
}) => {
  return (
    <>
      <label className="text-lg font-bold mb-2" htmlFor={id}>
        {text}
      </label>
      <input
        {...register}
        className={cls(
          "bg-gray-100 placeholder:text-sm pl-2 rounded-md py-1 focus:ring-2 focus:ring-offset-2 focus:ring-pink-300 text-gray-700",
          errorState ? "focus:ring-red-500 bg-red-300" : ""
        )}
        id={id}
        type="text"
        placeholder={placeholder}
      />
    </>
  );
};

export default EnterInput;

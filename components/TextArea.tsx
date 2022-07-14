import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface TextAreaProps {
  label: string;
  register?: UseFormRegisterReturn;
}

const TextArea: React.FC<TextAreaProps> = ({ label, register }) => {
  return (
    <div className="flex flex-col pb-2">
      <label
        htmlFor="description"
        className="text-lg font-bold mb-2 cursor-pointer"
      >
        {label}
      </label>
      <textarea
        {...register}
        id="description"
        rows={8}
        className="border-2 border-dotted rounded-md focus:border-pink-400 transition-all p-2"
      ></textarea>
    </div>
  );
};

export default TextArea;

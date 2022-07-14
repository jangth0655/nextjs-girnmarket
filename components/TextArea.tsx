import React from "react";

interface TextAreaProps {
  label: string;
}

const TextArea: React.FC<TextAreaProps> = ({ label }) => {
  return (
    <div className="flex flex-col pb-2">
      <label
        htmlFor="description"
        className="text-lg font-bold mb-2 cursor-pointer"
      >
        {label}
      </label>
      <textarea
        name=""
        id="description"
        rows={8}
        className="border-2 border-dotted rounded-md focus:border-pink-400 transition-all p-2"
      ></textarea>
    </div>
  );
};

export default TextArea;

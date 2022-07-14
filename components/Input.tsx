import React from "react";

type Type = "text" | "number";

interface InputProps {
  id: string;
  label: string;
  placeholder: string;
  type: Type;
}

const Input: React.FC<InputProps> = ({ label, placeholder, type, id }) => {
  return (
    <>
      {type === "text" && (
        <div className="flex flex-col w-full">
          <label htmlFor={id} className="text-lg font-bold mb-2 cursor-pointer">
            {label}
          </label>
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            className="pl-2 placeholder:text-sm rounded-md bg-slate-100 text-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-pink-300 transition-all py-2"
          />
        </div>
      )}
      {type === "number" && (
        <div className="flex flex-col ">
          <label htmlFor={id} className="text-lg font-bold mb-2 cursor-pointer">
            {label}
          </label>
          <div className="relative flex items-center w-full">
            <input
              id={id}
              type={type}
              placeholder={placeholder}
              className="w-full pl-10 placeholder:text-sm rounded-md bg-slate-100 text-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-pink-300 transition-all py-2 "
            />
            <span className="absolute left-3 ">₩</span>
            <span className="absolute right-0  w-10 bg-slate-100">원</span>
          </div>
        </div>
      )}
    </>
  );
};
export default Input;

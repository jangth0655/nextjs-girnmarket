import { cls } from "@libs/client/cls";
import Image from "next/image";
import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import picture from "../public/image/icons/picture.png";

interface UploadImageProps {
  register?: UseFormRegisterReturn;
  imageRequired?: boolean;
}

const UploadImage: React.FC<UploadImageProps> = ({
  register,
  imageRequired,
}) => {
  return (
    <label
      htmlFor="image"
      className={cls(
        "group flex w-full h-full cursor-pointer m-auto justify-center items-center hover:border-red-400 transition-all border-dashed border-2 rounded-lg",
        imageRequired ? "border-red-500" : ""
      )}
    >
      <div className="w-24 h-24 relative transition-all group-hover:scale-110">
        <Image
          src={picture}
          layout="fill"
          objectFit="cover"
          alt="image"
        ></Image>
      </div>
      <input
        {...register}
        id="image"
        type="file"
        accept="image/*"
        className="hidden"
      />
    </label>
  );
};
export default UploadImage;

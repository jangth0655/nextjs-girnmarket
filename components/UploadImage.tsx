import Image from "next/image";
import React from "react";
import picture from "../public/image/icons/picture.png";

interface UploadImageProps {}

const UploadImage: React.FC<UploadImageProps> = ({}) => {
  return (
    <label
      htmlFor="image"
      className="group flex w-full h-full cursor-pointer m-auto justify-center items-center hover:border-red-400 transition-all border-dashed border-2 rounded-lg"
    >
      <div className="w-24 h-24 relative transition-all group-hover:scale-110">
        <Image
          src={picture}
          layout="fill"
          objectFit="cover"
          alt="image"
        ></Image>
      </div>
      <input id="image" type="file" accept="image/*" className="hidden" />
    </label>
  );
};
export default UploadImage;

import { deliveryFile } from "@libs/client/deliveryImage";
import Image from "next/image";
import React from "react";
import { ReviewWithUser } from "./Reviews";

interface ReviewProps {
  review: ReviewWithUser;
}

const ReviewItem: React.FC<ReviewProps> = ({ review }) => {
  return (
    <div className="flex items-center space-x-5  mb-2">
      <div className="flex flex-col justify-center items-center">
        <div className="w-8 h-8 rounded-full bg-gray-400 flex justify-center items-center relative">
          {review.user.avatar ? (
            <Image
              src={deliveryFile(review.user.avatar)}
              layout="fill"
              objectFit="cover"
              alt=""
              className="rounded-full"
            />
          ) : (
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>
        <span className="text-sm">{review.user.username}</span>
      </div>
      <div className="">
        <span>{review.review}</span>
      </div>
    </div>
  );
};
export default ReviewItem;

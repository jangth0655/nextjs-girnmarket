import { Review, User } from "@prisma/client";
import React, { useRef, useState } from "react";
import useSWR from "swr";
import ReviewItem from "./ReviewItem";

export interface ReviewWithUser extends Review {
  user: User;
}

interface ReviewResponse {
  ok: boolean;
  productReviews: {
    reviews: ReviewWithUser[];
  };
}

interface ReviewPorps {
  id: number;
}

const Reviews: React.FC<ReviewPorps> = ({ id }) => {
  const [page, setPage] = useState(1);
  const { data } = useSWR<ReviewResponse>(
    id ? `/api/products/${id}/reviews?page=${page}` : ""
  );

  const totalReviews = data?.productReviews?.reviews
    ? data?.productReviews?.reviews.length
    : 0;

  const maxReivew = 9;
  const onNext = () => {
    setPage((prev) => (totalReviews < maxReivew ? 1 : page + 1));
  };

  const onBack = () => {
    setPage((prev) => (prev === 1 ? 1 : prev - 1));
  };

  return (
    <div>
      {data?.productReviews?.reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
      <div className="my-4 flex justify-center space-x-5 text-gray-400 ">
        <div onClick={() => onBack()} className="">
          <svg
            className="h-6 w-6 transition-all hover:text-gray-700 cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
        </div>
        <div onClick={() => onNext()}>
          <svg
            className="h-6 w-6 transition-all hover:text-gray-700 cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </div>
  );
};
export default Reviews;

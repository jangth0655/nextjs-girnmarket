import { deliveryFile } from "@libs/client/deliveryImage";
import useMutation from "@libs/client/mutation";
import useUser from "@libs/client/useUser";
import Image from "next/image";
import React from "react";
import { ReviewWithUser } from "./Reviews";

interface ReviewProps {
  review: ReviewWithUser;
  productId: number;
}

const ReviewItem: React.FC<ReviewProps> = ({ review, productId }) => {
  const { user } = useUser({ isPrivate: false });
  const [deleteReview, { data: deleteData }] = useMutation(
    review.id && productId ? `/api/products/${productId}/reviews/remove` : ""
  );

  const confirmUser = review.user.id === user?.id;

  const onDeleteReview = () => {
    if (deleteData) return;
    deleteReview({ reviewId: review.id });
  };

  return (
    <div className="items-center  mb-8">
      <div className="flex w-full items-center justify-between">
        <div className="flex justify-center items-center">
          <div className="w-8 h-8 rounded-full bg-gray-400 flex justify-center items-center relative mr-1">
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

        {confirmUser && (
          <div>
            <svg
              onClick={() => onDeleteReview()}
              className="h-5 w-5 text-red-300 hover:text-red-500 transition-all cursor-pointer"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="ml-10 mt-1">
        <span>{review.review}</span>
      </div>
    </div>
  );
};
export default ReviewItem;

import ErrorMessage from "@components/enter/ErrorMessage";
import useMutation from "@libs/client/mutation";
import useUser from "@libs/client/useUser";
import { Review } from "@prisma/client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSWRConfig } from "swr";

interface ProductReviewProps {
  id?: number;
}

interface ReviewForm {
  review: string;
}

interface CreateReviewMutation {
  ok: boolean;
  reivew: Review;
}

const CreateReview: React.FC<ProductReviewProps> = ({ id }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewForm>();
  const { user } = useUser({ isPrivate: false });
  const { mutate } = useSWRConfig();

  const [createReview, { data, loading }] = useMutation<CreateReviewMutation>(
    id ? `/api/products/${id}/reviews` : ""
  );

  const onValid = (data: ReviewForm) => {
    if (loading) return;
    createReview(data);
    reset();
  };

  useEffect(() => {
    if (data && data.ok) {
    }
  }, [data, id, mutate, user]);

  return (
    <div>
      <form onSubmit={handleSubmit(onValid)}>
        <div className="relative flex items-center h-8 space-x-1 w-[90%]">
          <input
            {...register("review", {
              required: "Required.",
              minLength: {
                value: 2,
                message: "Please two more than",
              },
            })}
            id="review"
            type="text"
            placeholder="Review..."
            className="pl-3 pr-14 py-3 w-full rounded-lg bg-gray-100 "
          />
          <button className="bg-pink-200  h-full rounded-full right-3 px-2 hover:bg-pink-500 hover:text-white transition-all  cursor-pointer text-pink-500 absolute flex items-center justify-center">
            {loading ? (
              "Loading..."
            ) : (
              <svg
                className="h-5 w-5 rotate-90"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </form>
      {errors.review?.message && (
        <ErrorMessage errorText={errors.review.message} />
      )}
    </div>
  );
};
export default CreateReview;

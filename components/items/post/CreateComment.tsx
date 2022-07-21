import ErrorMessage from "@components/enter/ErrorMessage";
import useMutation from "@libs/client/mutation";
import React from "react";
import { useForm } from "react-hook-form";

interface CreateCommentProps {
  id: number;
}

interface CreateForm {
  answer?: string;
}

const CreateComment: React.FC<CreateCommentProps> = ({ id }) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CreateForm>();

  const [
    createComment,
    { loading: createCommentLoading, data: createCommentData },
  ] = useMutation(`/api/posts/${id}/comments`);

  const onValid = (formData: CreateForm) => {
    if (createCommentLoading) return;
    createComment(formData);
    reset();
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onValid)}>
        <div className="relative flex items-center h-8 space-x-1 w-[90%]">
          <input
            {...register("answer", {
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
            {createCommentLoading ? (
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
      {errors.answer?.message && (
        <ErrorMessage errorText={errors.answer.message} />
      )}
    </div>
  );
};
export default CreateComment;

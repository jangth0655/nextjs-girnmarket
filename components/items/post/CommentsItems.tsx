import { Comment, User } from "@prisma/client";
import React, { useState } from "react";
import useSWR from "swr";
import CommentItem from "./CommentItem";

interface CommentsProps {
  id: number;
}

export interface CommentWithUser extends Comment {
  user: User;
}

interface CommentsResponse {
  ok: boolean;
  postComments: {
    comments: CommentWithUser[];
  };
}

const CommentsItems: React.FC<CommentsProps> = ({ id }) => {
  const { data, error } = useSWR<CommentsResponse>(
    id ? `/api/posts/${id}/comments` : null,
    {
      refreshInterval: 1000,
    }
  );

  const [page, setPage] = useState(1);

  const totalReviews = data?.postComments?.comments
    ? data?.postComments?.comments.length
    : 0;

  const maxReivew = 10;
  const onNext = () => {
    setPage((prev) => (totalReviews < maxReivew ? 1 : page + 1));
  };

  const onBack = () => {
    setPage((prev) => (prev === 1 ? 1 : prev - 1));
  };

  return (
    <div>
      {data?.postComments?.comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} postId={id} />
      ))}
      {data?.postComments?.comments.length === 0 ? null : (
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
      )}
    </div>
  );
};
export default CommentsItems;

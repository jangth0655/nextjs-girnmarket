import { cls } from "@libs/client/cls";
import { deliveryFile } from "@libs/client/deliveryImage";
import useMutation from "@libs/client/mutation";
import Image from "next/image";
import { PostWithUserWithCount } from "pages/community";
import React, { useEffect } from "react";
import useSWR from "swr";

interface PostLiProps {
  post: PostWithUserWithCount;
  postId: number;
}

interface PostDetailResponse {
  ok: boolean;
  isLikePost: boolean;
  isMine: boolean;
  post: PostWithUserWithCount;
}

const PostLi: React.FC<PostLiProps> = ({ postId }) => {
  const { data, error, mutate } = useSWR<PostDetailResponse>(
    `/api/posts/${postId}`
  );

  const [likePost, { data: likePostData, loading: likePostLoading }] =
    useMutation(`/api/posts/${postId}/likePost`);

  const onLikePost = () => {
    if (likePostLoading) return;
    mutate((prev) => prev && { ...prev, isLikePost: !prev.isLikePost }, false);
    likePost({});
  };

  useEffect(() => {
    if (likePostData && likePostData.ok) {
      mutate();
    }
  }, [likePostData, mutate]);

  return (
    <div
      className={cls(
        "last:mb-0 mb-28 shadow-md px-2 pt-2 bg-slate-100 rounded-lg max-w-4xl m-auto",
        data?.post.image ? "h-72 " : ""
      )}
    >
      <div className="flex items-center space-x-1 justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full relative">
            {data?.post?.user?.avatar ? (
              <Image
                src={deliveryFile(data?.post.user.avatar)}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
                alt=""
              />
            ) : (
              <div className="w-full h-full flex justify-center items-center bg-gray-500 rounded-full">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
          </div>
          <span className="text-sm font-bold">{data?.post.user.username}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div
            onClick={() => onLikePost()}
            className={cls(
              "text-gray-500 hover:text-red-500 transition-all cursor-pointer"
            )}
          >
            <svg
              className={cls("h-5 w-5", data?.isLikePost ? "text-red-500" : "")}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-sm">{data?.post._count.likePost}</span>
        </div>
      </div>

      <div className="w-[90%] h-[85%] flex mt-2 ml-10 py-2 items-center">
        {data?.post.image && (
          <div className="w-[100%] h-[80%] md:h-[90%] sm:w-[50%] md:w-[40%] relative rounded-md mr-8">
            <Image
              src={deliveryFile(data?.post.image)}
              layout="fill"
              objectFit="cover"
              alt=""
              className="rounded-md"
            />
          </div>
        )}
        <div className="h-[85%] overflow-y-scroll w-full">
          <p>{data?.post.question}</p>
        </div>
      </div>
    </div>
  );
};

export default PostLi;

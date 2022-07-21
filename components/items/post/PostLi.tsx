import { cls } from "@libs/client/cls";
import { deliveryFile } from "@libs/client/deliveryImage";
import useMutation from "@libs/client/mutation";
import Image from "next/image";
import { useRouter } from "next/router";
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
  const router = useRouter();
  const { data, error, mutate } = useSWR<PostDetailResponse>(
    postId ? `/api/posts/${postId}` : null
  );

  const [likePost, { data: likePostData, loading: likePostLoading }] =
    useMutation(`/api/posts/${postId}/likePost`);

  const onLikePost = () => {
    if (likePostLoading) return;
    mutate((prev) => prev && { ...prev, isLikePost: !prev.isLikePost }, false);
    likePost({});
  };

  const onUserProfile = (username?: string) => {
    router.push(`/users/${username}/profile`);
  };

  const onPostDetail = (postId?: number) => {
    router.push(`/community/${postId}`);
  };

  useEffect(() => {
    if (likePostData && likePostData.ok) {
      mutate();
    }
  }, [likePostData, mutate]);

  return (
    <div
      className={cls(
        "last:mb-0 mb-14 shadow-md px-2 pt-2 bg-slate-100 rounded-lg max-w-4xl m-auto",
        data?.post.image ? "h-72 " : ""
      )}
    >
      <div className="flex items-center space-x-1 justify-between">
        <div className="flex items-center space-x-2">
          <div
            onClick={() => onUserProfile(data?.post.user.username)}
            className="w-8 h-8 rounded-full relative cursor-pointer"
          >
            {data?.post?.user?.avatar ? (
              <Image
                src={deliveryFile(data?.post.user.avatar)}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
                alt=""
              />
            ) : (
              <div className="w-full h-full flex justify-center items-center bg-gray-400 rounded-full">
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
          <span
            onClick={() => onUserProfile(data?.post.user.username)}
            className="text-sm font-bold cursor-pointer"
          >
            {data?.post.user.username}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <div
            onClick={() => onPostDetail(data?.post.id)}
            className="mr-3 cursor-pointer hover:text-pink-500 transition-all text-gray-400"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
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

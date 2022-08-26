import CommentsItems from "@components/items/post/CommentsItems";

import CreateComment from "@components/items/post/CreateComment";
import Layout from "@components/Layout";
import { cls } from "@libs/client/cls";
import { deliveryFile } from "@libs/client/deliveryImage";
import useMutation from "@libs/client/mutation";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import useSWR from "swr";
import { PostWithUserWithCount } from "..";

interface PostDetailResponse {
  ok: boolean;
  isLikePost: boolean;
  isMine: boolean;
  post: PostWithUserWithCount;
}

const PostDetail: NextPage = () => {
  const router = useRouter();
  const { data, error, mutate } = useSWR<PostDetailResponse>(
    router.query.id ? `/api/posts/${router.query.id}` : null,
    {}
  );

  const loading = !data && !error;

  const [likePost, { data: likePostData, loading: likePostLoading }] =
    useMutation(`/api/posts/${Number(router.query.id)}/likePost`);

  const onLikePost = useCallback(() => {
    if (likePostLoading) return;
    mutate((prev) => prev && { ...prev, isLikePost: !prev.isLikePost }, false);
    likePost({});
  }, [likePost, likePostLoading, mutate]);

  useEffect(() => {
    if (likePostData && likePostData.ok) {
      mutate();
    }
  }, [likePostData, mutate]);

  const onEditPost = (postId?: number) => {
    router.push(`/users/edits/post/${postId}`);
  };
  return (
    <Layout title="Community" head="Community">
      {loading ? (
        "Loading..."
      ) : (
        <main className="max-w-3xl m-auto">
          <div className="h-[33rem]">
            <div className="h-[5%] flex items-center justify-between mb-10">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full relative">
                  {data?.post?.user?.avatar ? (
                    <Image
                      src={deliveryFile(data?.post?.user?.avatar)}
                      layout="fill"
                      objectFit="cover"
                      alt=""
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-400 flex justify-center items-center">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <span>{data?.post?.user?.username}</span>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                {data?.isMine && (
                  <div
                    onClick={() => onEditPost(data.post.id)}
                    className="mr-6 px-2 rounded-lg bg-pink-300 hover:bg-pink-500 transition-all cursor-pointer"
                  >
                    <button className="text-white text-sm">Edit</button>
                  </div>
                )}
                <svg
                  onClick={() => onLikePost()}
                  className={cls(
                    "h-5 w-5  hover:text-red-500 transition-all cursor-pointer",
                    data?.isLikePost ? "text-red-500" : "text-gray-500"
                  )}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">{data?.post?._count.likePost}</span>
              </div>
            </div>

            <div className={cls("ml-6", data?.post?.image ? "h-full" : "")}>
              {data?.post?.image ? (
                <div className="h-[60%] w-[70%] sm:w-[40%] rounded-md">
                  <div className="relative w-full h-full">
                    <Image
                      src={deliveryFile(data?.post?.image)}
                      layout="fill"
                      objectFit="cover"
                      alt=""
                      className="rounded-md"
                    />
                  </div>
                </div>
              ) : null}
              <div className="mt-4 overflow-y-scroll">
                <p>{data?.post?.question}</p>
              </div>
            </div>
          </div>
          {/* comments */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <h1 className="font-bold text-lg">Comments</h1>
            </div>
            <div>
              <CommentsItems id={Number(data?.post?.id)} />
            </div>
            <div>{<CreateComment id={Number(data?.post?.id)} />}</div>
          </div>
        </main>
      )}
    </Layout>
  );
};
export default PostDetail;

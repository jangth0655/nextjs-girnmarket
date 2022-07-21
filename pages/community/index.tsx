import PostUl from "@components/items/post/PostUl";
import Layout from "@components/Layout";
import { Post, User } from "@prisma/client";
import { NextPage } from "next";
import useSWR from "swr";

export interface PostWithUserWithCount extends Post {
  _count: {
    comments: number;
    likePost: number;
  };
  user: User;
}

interface PostResponse {
  ok: boolean;
  posts: PostWithUserWithCount[];
}

const Community: NextPage = () => {
  const { data, error } = useSWR<PostResponse>("/api/posts");

  const loading = !data && !error;

  return (
    <Layout>
      <PostUl
        loading={loading}
        posts={data?.posts}
        title="Welcome to Community"
      />
    </Layout>
  );
};

export default Community;

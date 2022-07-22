import Pagination from "@components/items/Pagination";
import PostUl from "@components/items/post/PostUl";
import Layout from "@components/Layout";
import { Post, User } from "@prisma/client";
import { NextPage } from "next";
import { useState } from "react";
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
  const [page, setPage] = useState(1);
  const { data, error } = useSWR<PostResponse>(`/api/posts?page=${page}`);

  const loading = !data && !error;

  return (
    <Layout title="Community" head="Community">
      <PostUl
        loading={loading}
        posts={data?.posts}
        title="Welcome to Community"
      />
      <div className="mt-32">
        <Pagination count={data?.posts?.length} page={page} setPage={setPage} />
      </div>
    </Layout>
  );
};

export default Community;

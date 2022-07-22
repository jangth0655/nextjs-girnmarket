import Pagination from "@components/items/Pagination";
import PostUl from "@components/items/post/PostUl";
import Layout from "@components/Layout";
import { Post, User } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import useSWR, { SWRConfig } from "swr";
import client from "@libs/server/client";

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
    <Layout title="Community" head="Community" showingSearchIcon={false}>
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

const Page: NextPage<{ posts: PostWithUserWithCount[] }> = ({ posts }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/posts": {
            ok: true,
            posts,
          },
        },
      }}
    >
      <Community />
    </SWRConfig>
  );
};

const getServerSideProps: GetServerSideProps = async () => {
  const posts = await client.post.findMany({
    include: {
      user: {
        select: {
          id: true,
          avatar: true,
          username: true,
        },
      },
      _count: {
        select: {
          comments: true,
          likePost: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
    },
  };
};

export default Page;

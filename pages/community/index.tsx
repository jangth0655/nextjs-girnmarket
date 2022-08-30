import PostUl from "@components/items/post/PostUl";
import Layout from "@components/Layout";
import { Post, User } from "@prisma/client";
import { GetStaticProps, NextPage } from "next";

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

const Community: NextPage<{ posts: PostWithUserWithCount[] }> = ({ posts }) => {
  return (
    <Layout title="Community" head="Community" showingSearchIcon={false}>
      <PostUl posts={posts} title="Welcome to Community" />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
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

export default Community;

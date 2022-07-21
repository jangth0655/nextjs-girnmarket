import PageTitle from "@components/PageTitle";
import { PostWithUserWithCount } from "pages/community";

import React from "react";
import PostLi from "./PostLi";

interface PostUlProps {
  posts?: PostWithUserWithCount[];
  title: string;
  loading: boolean;
}

const PostUl: React.FC<PostUlProps> = ({ title, posts, loading }) => {
  return (
    <div>
      <PageTitle title={title} />
      <main className="mt-16 m-auto min-h-screen">
        {loading ? (
          "Loading..."
        ) : (
          <div>
            {posts?.map((post) => (
              <PostLi post={post} postId={post.id} key={post.id} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PostUl;

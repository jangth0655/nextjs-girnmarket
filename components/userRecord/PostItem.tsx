import { Post, User } from "@prisma/client";
import React from "react";
import useSWR from "swr";
import Items from "./Items";

interface PostItemProps {
  username?: string;
}

export interface UserWithPost extends User {
  posts: Post[];
}

interface PostItemResponse {
  ok: boolean;
  posts: UserWithPost;
}

const PostItem: React.FC<PostItemProps> = ({ username }) => {
  const { data, error } = useSWR<PostItemResponse>(
    `/api/users/${username}/post`
  );

  const loading = !data && !error;

  return (
    <div className="w-ful">
      {loading ? "Loading" : <Items posts={data?.posts} />}
    </div>
  );
};

export default PostItem;

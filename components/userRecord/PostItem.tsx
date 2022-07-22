import Pagination from "@components/items/Pagination";
import { Post, User } from "@prisma/client";
import React, { useState } from "react";
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
  const [page, setPage] = useState(1);
  const { data, error } = useSWR<PostItemResponse>(
    `/api/users/${username}/post?page=${page}`
  );

  const loading = !data && !error;

  return (
    <div className="w-full">
      {loading ? "Loading" : <Items posts={data?.posts} />}
      <div className="mt-10">
        <Pagination
          count={data?.posts.posts.length}
          page={page}
          setPage={setPage}
        />
      </div>
    </div>
  );
};

export default PostItem;

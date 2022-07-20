import React from "react";

interface PostLiProps {
  post: any;
}

const PostLi: React.FC<PostLiProps> = ({ post }) => {
  return <h1>PostLi</h1>;
};

export default PostLi;

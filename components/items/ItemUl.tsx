import PageTitle from "@components/PageTitle";
import { WithPhotoWithCountWithUser } from "pages";
import React from "react";
import PostLi from "./PostLi";
import ProductLi from "./ProductLi";

interface ItemUlProps {
  title: string;
  products?: WithPhotoWithCountWithUser[];
  posts?: any;
  loading: boolean;
}

const ItemUl: React.FC<ItemUlProps> = ({ title, posts, products, loading }) => {
  return (
    <>
      <PageTitle title={title} />
      <main className="m-auto mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 sm:space-y-0 space-y-8">
          {loading
            ? "Loading..."
            : products &&
              products.map((product) => (
                <ProductLi key={product.id} product={product} />
              ))}

          {loading
            ? "Loading..."
            : posts &&
              posts.map((post: any) => <PostLi key={post.id} post={post} />)}
        </div>
      </main>
    </>
  );
};
export default ItemUl;

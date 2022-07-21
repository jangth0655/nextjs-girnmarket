import PageTitle from "@components/PageTitle";
import { ProductListResponse, WithPhotoWithCountWithUser } from "pages";
import { PostWithUserWithCount } from "pages/community";
import React from "react";
import { KeyedMutator } from "swr";
import PostLi from "../post/PostLi";
import ProductLi from "./ProductLi";

interface ItemUlProps {
  title: string;
  products?: WithPhotoWithCountWithUser[];
  loading: boolean;
  mutate?: KeyedMutator<ProductListResponse>;
}

const ProductUl: React.FC<ItemUlProps> = ({ title, products, loading }) => {
  return (
    <>
      <PageTitle title={title} />
      <main className="m-auto mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 sm:space-y-0 space-y-8">
          {products &&
            products.map((product) => (
              <ProductLi key={product.id} productId={product.id} />
            ))}
        </div>
      </main>
    </>
  );
};
export default ProductUl;

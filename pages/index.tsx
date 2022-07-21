import ProductUl from "@components/items/Product/ProductUl";
import Layout from "@components/Layout";
import { Photo, Product, User } from "@prisma/client";
import type { NextPage } from "next";
import useSWR from "swr";

export interface WithPhotoWithCountWithUser extends Product {
  _count: {
    favs: number;
  };
  user: User;
  photos: Photo[];
}

export interface ProductListResponse {
  ok: boolean;
  products: WithPhotoWithCountWithUser[];
}

const Home: NextPage = () => {
  const { data, error, mutate } = useSWR<ProductListResponse>("/api/products");
  const loading = !data && !error;

  return (
    <Layout>
      <ProductUl
        title="Choose your favorite"
        products={data?.products}
        loading={loading}
        mutate={mutate}
      />
    </Layout>
  );
};

export default Home;

import ItemUl from "@components/items/ItemUl";
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

interface ProductListResponse {
  ok: boolean;
  products: WithPhotoWithCountWithUser[];
}

const Home: NextPage = () => {
  const { data, error } = useSWR<ProductListResponse>("/api/products");

  const loading = !data && !error;

  return (
    <Layout>
      <ItemUl
        title="Choose your favorite"
        products={data?.products}
        loading={loading}
      />
    </Layout>
  );
};

export default Home;

import Pagination from "@components/items/Pagination";
import ProductUl from "@components/items/Product/ProductUl";
import Layout from "@components/Layout";
import { Photo, Product, User } from "@prisma/client";
import type { NextPage } from "next";
import { useState } from "react";
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
  const [page, setPage] = useState(1);
  const { data, error, mutate } = useSWR<ProductListResponse>(
    `/api/products?page=${page}`
  );
  const loading = !data && !error;

  return (
    <Layout head="Mart" title="Product">
      {loading ? (
        "Loading.."
      ) : (
        <>
          <div className="">
            <ProductUl
              title="Choose your favorite"
              products={data?.products}
              loading={loading}
              mutate={mutate}
            />
          </div>
          <div className="mt-32">
            <Pagination
              count={data?.products?.length}
              page={page}
              setPage={setPage}
            />
          </div>
        </>
      )}
    </Layout>
  );
};

export default Home;

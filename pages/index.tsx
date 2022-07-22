import Pagination from "@components/items/Pagination";
import ProductUl from "@components/items/Product/ProductUl";
import Layout from "@components/Layout";
import client from "@libs/server/client";
import { Photo, Product, User } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import useSWR, { SWRConfig } from "swr";

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
    <Layout head="Main">
      {loading ? (
        "loading.."
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

const Page: NextPage<{ products: WithPhotoWithCountWithUser[] }> = ({
  products,
}) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/products": {
            ok: true,
            products,
          },
        },
      }}
    >
      <Home />
    </SWRConfig>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const products = await client.product.findMany({
    include: {
      user: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      _count: {
        select: {
          favs: true,
        },
      },
      photos: {
        select: {
          url: true,
          id: true,
        },
      },
    },
  });
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
};

export default Page;

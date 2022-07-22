import Pagination from "@components/items/Pagination";
import ProductUl from "@components/items/Product/ProductUl";
import Layout from "@components/Layout";
import { Product, User } from "@prisma/client";
import { useRouter } from "next/router";
import { WithPhotoWithCountWithUser } from "pages";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

interface SearchResponse {
  ok: boolean;
  products: WithPhotoWithCountWithUser[];
}

const SearchItems: React.FC = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const keyword = String(router.query.keyword) || undefined;
  const { data, error } = useSWR<SearchResponse>(
    router.query.keyword && `/api/search?keyword=${keyword}&page=${page}`
  );
  const loading = !data && !error;
  useEffect(() => {
    if (!data?.ok) {
      <h1>Not found</h1>;
    }
  }, [data]);

  return (
    <Layout title={keyword} head={keyword}>
      <ProductUl
        loading={loading}
        products={data?.products}
        title={keyword}
      ></ProductUl>
      <div className="mt-20">
        <Pagination
          page={page}
          setPage={setPage}
          count={data?.products.length}
        />
      </div>
    </Layout>
  );
};
export default SearchItems;

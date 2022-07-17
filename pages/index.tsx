import Layout from "@components/Layout";
import PageTitle from "@components/PageTitle";
import { Product } from "@prisma/client";
import type { NextPage } from "next";
import useSWR from "swr";

interface ProductWithCount extends Product {
  _count: {
    favs: number;
  };
}

interface ProductListResponse {
  ok: boolean;
  products: ProductWithCount[];
}

const Home: NextPage = () => {
  const { data, error } = useSWR<ProductListResponse>("/api/products");
  console.log(data);
  return (
    <Layout>
      <PageTitle title="Choose your favorite" />
      <main>
        <div className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {data?.products.map((product) => (
            // component
            <div key={product.id}>{product.name}</div>
          ))}
        </div>
      </main>
    </Layout>
  );
};

export default Home;

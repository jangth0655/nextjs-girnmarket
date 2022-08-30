import ProductUl from "@components/items/Product/ProductUl";
import Layout from "@components/Layout";
import { Photo, Product, User } from "@prisma/client";
import type { GetStaticProps, NextPage } from "next";
import client from "@libs/server/client";

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

const Home: NextPage<{ products: WithPhotoWithCountWithUser[] }> = ({
  products,
}) => {
  return (
    <Layout head="Mart" title="Product">
      <>
        <div className="">
          <ProductUl title="Choose your favorite" products={products} />
        </div>
      </>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
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

export default Home;

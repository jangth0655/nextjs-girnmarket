import { Photo, Product, User } from "@prisma/client";
import React from "react";
import useSWR from "swr";
import Items from "./Items";

interface ProductItemProps {
  username?: string;
}

export interface ProductWithCount extends Product {
  _count: {
    favs: number;
  };
  photos: Photo[];
}

export interface UserWithProduct {
  products: ProductWithCount[];
  id: number;
  username: string;
}

interface ProductResponse {
  ok: boolean;
  products: UserWithProduct;
}

const ProductItem: React.FC<ProductItemProps> = ({ username }) => {
  const { data, error } = useSWR<ProductResponse>(
    `/api/users/${username}/product`
  );

  const loading = !data && !error;

  return (
    <div className="w-ful">
      {loading ? "Loading" : <Items myProducts={data?.products} />}
    </div>
  );
};

export default ProductItem;

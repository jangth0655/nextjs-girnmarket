import { Product, User } from "@prisma/client";
import React from "react";
import useSWR from "swr";
import Items from "./Items";

/* export interface UserWithProduct extends User {
  products: ProductWithCount[];
} */

interface SaleItemProps {
  username?: string;
}

interface ProductWithCount extends Product {
  _count: {
    favs: number;
  };
}

interface ProductResponse {
  ok: boolean;
  sales: ProductWithUser[];
}

interface ProductWithUser {
  product: ProductWithCount;
  user: User;
}

interface ProductWithCount extends Product {
  _count: {
    favs: number;
  };
}

const SaleItem: React.FC<SaleItemProps> = ({ username }) => {
  const { data, error } = useSWR<ProductResponse>(
    `/api/users/me/record?kind=sale`
  );

  const loading = !data && !error;
  return (
    <div className="w-ful">
      {loading ? "Loading" : <Items mySales={data?.sales} />}
    </div>
  );
};

export default SaleItem;

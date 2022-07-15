import { Product, User } from "@prisma/client";
import React from "react";
import useSWR from "swr";
import Items from "./Items";

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
  purchases: ProductWithUser[];
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

const PurchaseItem: React.FC<SaleItemProps> = ({ username }) => {
  const { data, error } = useSWR<ProductResponse>(
    `/api/users/me/record?kind=purchase`
  );

  const loading = !data && !error;
  return (
    <div className="w-ful">
      {loading ? "Loading" : <Items myPurchase={data?.purchases} />}
    </div>
  );
};

export default PurchaseItem;

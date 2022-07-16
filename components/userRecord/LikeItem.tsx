import { Product, User } from "@prisma/client";
import React from "react";
import useSWR from "swr";
import Items from "./Items";

interface LikeItemProps {
  username?: string;
}

interface ProductWithCount extends Product {
  _count: {
    favs: number;
  };
}

interface ProductResponse {
  ok: boolean;
  favList: ProductWithUser[];
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

const LikeItem: React.FC<LikeItemProps> = ({ username }) => {
  const { data, error } = useSWR<ProductResponse>(
    `/api/users/me/record?kind=favList`
  );

  const loading = !data && !error;

  return (
    <div className="w-full">
      {loading ? "Loading" : <Items myFav={data?.favList} />}
    </div>
  );
};

export default LikeItem;

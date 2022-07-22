import { deliveryFile } from "@libs/client/deliveryImage";
import { Photo, Product } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

interface ItemProps {
  item: ProductWithCountWithPhoto;
}

interface ProductWithCountWithPhoto extends Product {
  _count: {
    favs: number;
  };
  photos: Photo[];
}

const Item: React.FC<ItemProps> = ({ item }) => {
  const router = useRouter();
  const onProductDetail = (id: number) => {
    router.push(`/products/${id}`);
  };
  return (
    <div
      className="w-[100%] md:h-72 h-96 shadow-md rounded-md flex flex-col justify-center"
      key={item?.id}
    >
      <div className="relative w-full h-[90%] rounded-t-md">
        <Image
          src={deliveryFile(item.photos[0].url)}
          layout="fill"
          objectFit="cover"
          alt=""
        />
      </div>
      <div className="flex justify-between items-center py-2">
        <span
          onClick={() => onProductDetail(item?.id)}
          className="cursor-pointer hover:font-bold px-2 transition-all"
        >
          {item?.name}
        </span>

        <div className="flex items-center space-x-2 px-2">
          <svg
            className="h-4 w-4 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="text-sm text-gray-500">
            {item?._count.favs ? item?._count.favs : 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Item;

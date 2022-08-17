import { cls } from "@libs/client/cls";
import { deliveryFile } from "@libs/client/deliveryImage";
import useUser from "@libs/client/useUser";
import { Photo, Product, User } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import Item from "./Item";
import { UserWithPost } from "./PostItem";
import { UserWithProduct } from "./ProductItem";

interface ItemsProps {
  myProducts?: UserWithProduct;
  myPurchase?: ProductWithUser[];
  mySales?: ProductWithUser[];
  myFav?: ProductWithUser[];
  posts?: UserWithPost;
}

interface ProductWithUser {
  product: ProductWithCountWithPhoto;
  user: User;
}

interface ProductWithCountWithPhoto extends Product {
  _count: {
    favs: number;
  };
  photos: Photo[];
}

const Items: React.FC<ItemsProps> = ({
  myPurchase,
  posts,
  myProducts,
  mySales,
  myFav,
}) => {
  const router = useRouter();
  const { user } = useUser({ isPrivate: false });
  const onProductDetail = (id: number) => {
    router.push(`/products/${id}`);
  };

  const relevantUser = myProducts?.username === user?.username;
  const editProduct = (productId?: number) => {
    router.push(`/users/edits/product/${productId}`);
  };

  return (
    <div className="w-full grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10">
      {myPurchase &&
        myPurchase?.map((item) => (
          <Item key={item.product.id} item={item.product} />
        ))}

      {mySales &&
        mySales?.map((item) => (
          <Item key={item.product.id} item={item.product} />
        ))}

      {myFav &&
        myFav?.map((item) => (
          <Item key={item.product.id} item={item.product} />
        ))}

      {myProducts &&
        myProducts.products.map((item) => (
          <div
            className="w-[100%] md:h-72 h-96 shadow-md rounded-md flex flex-col justify-center cursor-pointer relative"
            key={item?.name}
          >
            {relevantUser && (
              <div
                onClick={() => editProduct(item?.id)}
                className="absolute py-1 px-2  rounded-md bg-red-400 hover:bg-red-600 transition-all right-2 top-2 z-10 text-white text-xs"
              >
                Edit
              </div>
            )}

            <div
              onClick={() => onProductDetail(item?.id)}
              className="relative w-full h-[90%] rounded-t-md"
            >
              {item.photos ? (
                <Image
                  src={deliveryFile(item.photos[0]?.url)}
                  layout="fill"
                  objectFit="cover"
                  alt=""
                  className="rounded-t-md"
                />
              ) : (
                <div className="w-full h-full bg-slate-400 rounded-t-md"></div>
              )}
            </div>
            <div className="flex justify-between items-center  py-2">
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
        ))}

      {posts &&
        posts?.posts?.map((item) => (
          <div
            className={cls(
              "w-[100%] shadow-md rounded-t-md border-[1px] overflow-y-scroll",
              item.image ? "h-[33rem]" : "h-64"
            )}
            key={item.id}
          >
            {item.image ? (
              <div className="relative w-full h-[60%] rounded-t-md">
                <Image
                  src={deliveryFile(item.image)}
                  layout="fill"
                  objectFit="cover"
                  alt=""
                />
              </div>
            ) : null}

            <div className={cls("p-2", item.image ? "h-[40%]" : "h-[100%]")}>
              <div className="font-bold">{posts.username}</div>
              <div className="mt-4 mb-2 w-full h-[1px] bg-gray-300" />
              <div>
                <p className="text-sm">{item.question}</p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};
export default Items;

{
  /* <div
className="w-[100%] md:h-72 h-96 shadow-md rounded-md flex flex-col justify-center"
key={item.product.id}
>
<div className="relative w-full h-[90%] rounded-t-md">
  <div className="w-full h-full bg-slate-400 rounded-t-md"></div>
</div>
<div className="flex justify-between items-center py-2">
  <span
    onClick={() => onProductDetail(item?.product?.name)}
    className="cursor-pointer hover:font-bold px-2 transition-all"
  >
    {item?.product?.name}
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
      {item?.product?._count.favs ? item?.product?._count.favs : 0}
    </span>
  </div>
</div>
</div> */
}

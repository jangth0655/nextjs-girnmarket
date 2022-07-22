import { cls } from "@libs/client/cls";
import { deliveryFile } from "@libs/client/deliveryImage";
import useMutation from "@libs/client/mutation";
import { Photo, Product, User } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import useSWR from "swr";

interface ProductLiProps {
  productId: number;
}

interface ProductWithCountWithUser extends Product {
  photos: Photo[];
  _count: {
    favs: number;
  };
  user: User;
}

interface ProductResponse {
  ok: boolean;
  product: ProductWithCountWithUser;
  isLiked: boolean;
  isLikedProduct: boolean;
}

const ProductLi: React.FC<ProductLiProps> = ({ productId }) => {
  const router = useRouter();
  const [hover, setHover] = useState(false);
  const { data, error, mutate } = useSWR<ProductResponse>(
    `/api/products/${productId}`
  );

  const [favList, { data: favListData, loading: favListLoading }] = useMutation(
    `/api/products/${productId}/favList`
  );
  const [fav, { data: favData, loading: favLoading }] = useMutation(
    `/api/products/${productId}/fav`
  );

  const onFavList = async () => {
    if (favListLoading) return;
    favList({});
    mutate(
      (data) => data && { ...data, isLikedProduct: !data.isLikedProduct },
      false
    );
  };

  const onFav = async () => {
    if (favLoading) return;
    fav({});
    mutate((data) => data && { ...data, isLiked: !data.isLiked }, false);
  };

  useEffect(() => {
    if (favListData && favListData.ok) {
      mutate();
    }
    if (favData && favData.ok) {
      mutate();
    }
  }, [mutate, favData, favListData]);

  const handleOver = useCallback(() => {
    setHover(true);
  }, []);

  const handleLeave = useCallback(() => {
    setHover(false);
  }, []);

  const onProductDetail = (id?: number) => {
    if (!id) return;
    router.push(`/products/${id}`);
  };

  const onUserProfile = (username?: string) => {
    router.push(`/users/${username}/profile`);
  };

  return (
    <>
      <div
        onMouseOver={handleOver}
        onMouseLeave={handleLeave}
        key={data?.product.id}
        className="h-96 shadow-sm rounded-md relative cursor-pointer transition-all"
      >
        {hover ? (
          <div className="absolute bg-gradient-to-t from-black w-full h-[30%] bottom-0 z-10 rounded-md transition-all">
            <div className="px-4 h-full flex justify-between items-center">
              <span className="z-10 text-white ">{data?.product?.name}</span>
              <div
                onClick={() => onFavList()}
                className={cls(
                  "rounded-md p-1 transition-all",
                  data?.isLikedProduct ? "bg-red-500" : " hover:bg-gray-400 "
                )}
              >
                <svg
                  className={cls(
                    "z-20 h-5 w-5",
                    data?.isLikedProduct ? "text-white" : " text-white"
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        ) : null}

        <div
          onClick={() => onProductDetail(data?.product?.id)}
          className="relative w-full h-full"
        >
          <Image
            className="rounded-md"
            src={deliveryFile(data?.product.photos[0].url)}
            layout="fill"
            objectFit="cover"
            alt=""
            priority
          />
        </div>

        <div className="flex justify-between items-center py-1">
          <div className="flex items-center ">
            <div
              onClick={() => onUserProfile(data?.product?.user?.username)}
              className="relative w-6 h-6 rounded-full mr-2"
            >
              {data?.product?.user.avatar ? (
                <Image
                  src={deliveryFile(data.product?.user?.avatar)}
                  layout="fill"
                  objectFit="cover"
                  alt=""
                  className="rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-500 flex justify-center items-center">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <div onClick={() => onUserProfile(data?.product?.user?.username)}>
              <span>{data?.product?.user.username}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <svg
              onClick={() => onFav()}
              className={cls(
                "h-5 w-5 hover:scale-110 transition-all",
                data?.isLiked ? "text-red-500" : "text-gray-500"
              )}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              {data?.product?._count.favs ? data?.product?._count.favs : 0}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductLi;

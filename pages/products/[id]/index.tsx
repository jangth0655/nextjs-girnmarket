import EnterButton from "@components/enter/EnterButton";
import Layout from "@components/Layout";
import { cls } from "@libs/client/cls";
import { deliveryFile } from "@libs/client/deliveryImage";
import useMutation from "@libs/client/mutation";
import { Photo, Product, Review, User } from "@prisma/client";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import useSWR from "swr";

interface ProductWithUserWithPhotoWithCount extends Product {
  user: User;
  photos: Photo[];
  reviews: Review[];
  _count: {
    favs: number;
    purchases: number;
    reviews: number;
  };
}

interface ProductDetailResponse {
  ok: boolean;
  product: ProductWithUserWithPhotoWithCount;
  isLiked: boolean;
  isLikedProduct: boolean;
  isPurchaseProduct: boolean;
}

const ProductDetail: NextPage = () => {
  const router = useRouter();
  const [hover, setHover] = useState(false);
  const { data, error, mutate } = useSWR<ProductDetailResponse>(
    `/api/products/${router.query.id}`
  );

  const [fav, { data: favData, loading: favLoading }] = useMutation(
    `/api/products/${router?.query?.id}/fav`
  );

  const [favList, { data: favLilstData, loading: favListLoading }] =
    useMutation(`/api/products/${router?.query?.id}/favList`);

  const [buy, { data: purchaseData, loading: purchaseLoading }] = useMutation(
    `/api/products/${router.query.id}/purchase`
  );

  const loading = !data && !error;

  const onHover = useCallback(() => {
    setHover(true);
  }, []);
  const onLeave = useCallback(() => {
    setHover(false);
  }, []);

  const onFav = () => {
    fav({});
    mutate((data) => data && { ...data, isLiked: !data.isLiked }, false);
  };

  const onFavList = () => {
    favList({});
    mutate(
      (data) => data && { ...data, isLikedProduct: !data.isLikedProduct },
      false
    );
  };

  const onBuy = () => {
    console.log("buy");
    window.confirm("Do you really want to buy something");
    buy({});
    mutate(
      (data) => data && { ...data, isPurchaseProduct: !data.isPurchaseProduct },
      false
    );
  };

  return (
    <Layout title="">
      {loading
        ? "Loading..."
        : router.query.id && (
            <div className="max-w-3xl m-auto">
              <div className="space-y-4 w-[100%] m-auto">
                <h1 className="font-bold text-2xl">{data?.product?.name}</h1>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="w-10 h-10 rounded-full bg-gray-400 flex justify-center items-center relative">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="hover:text-gray-800 hover:font-bold transition-all cursor-pointer">
                      {data?.product?.user?.username}
                    </span>
                  </div>

                  <div className="flex space-x-4">
                    <div
                      onClick={() => onFavList()}
                      className="p-[2px] text-gray-400 hover:text-red-500 transition-all cursor-pointer"
                    >
                      <svg
                        className={cls(
                          "h-5 w-5 ",
                          data?.isLikedProduct ? "text-red-500" : ""
                        )}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>

                    <div
                      onClick={() => onFav()}
                      className="p-[2px] text-gray-400 hover:text-red-500 transition-all cursor-pointer"
                    >
                      <svg
                        className={cls(
                          "h-6 w-6 ",
                          data?.isLiked ? "text-red-500" : ""
                        )}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* product image & info */}
              <div className="mt-1">
                <div
                  onMouseOver={onHover}
                  onMouseLeave={onLeave}
                  className="sm:h-[36rem] rounded-md relative w-[100%] h-[30rem] m-auto"
                >
                  {hover && (
                    <div className="z-10 absolute w-full bg-gradient-to-t from-black h-[100%] flex items-end">
                      <div className="h-[40%] w-[40%] px-2">
                        <div className="flex flex-col text-white font-bold space-y-8">
                          <div className="w-full ">
                            <span className="mr-10">Price :</span>
                            <span>{data?.product?.price} ₩</span>
                          </div>
                          <div className="overflow-y-scroll">
                            <p>{data?.product?.description.slice(0, 100)}...</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <Image
                    className="rounded-md"
                    src={deliveryFile(data?.product?.photos[0]?.url)}
                    layout="fill"
                    objectFit="cover"
                    alt=""
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-2 mt-2">
                    <div
                      onClick={() => onBuy()}
                      className={cls(
                        "transition-all cursor-pointer rounded-full p-1 bg-red-300 hover:bg-red-500",
                        data?.isPurchaseProduct ? "bg-red-500" : ""
                      )}
                    >
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    {data?.isPurchaseProduct ? (
                      <span
                        className={cls(
                          "font-bold",
                          data.isPurchaseProduct ? "text-red-500" : ""
                        )}
                      >
                        Purchase complete
                      </span>
                    ) : (
                      <span className="font-bold">
                        Buy {data?.product?.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* reivew & input */}
              <div className="mt-10 space-y-2">
                <h1 className="font-bold text-lg">Reviews</h1>
                <div>
                  <div className="h-96"></div>
                  <form className="">
                    <div className="relative flex items-center h-8 space-x-1 w-[80%]">
                      <input
                        id="review"
                        type="text"
                        placeholder="Review..."
                        className="pl-3 pr-14 py-3 w-full rounded-lg bg-gray-100 "
                      />
                      <button className="bg-pink-200  h-full rounded-full right-3 px-2 hover:bg-pink-500 hover:text-white transition-all  cursor-pointer text-pink-500 absolute flex items-center justify-center">
                        <svg
                          className="h-5 w-5 rotate-90"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
    </Layout>
  );
};
export default ProductDetail;

import { deliveryFile } from "@libs/client/deliveryImage";
import Image from "next/image";
import { WithPhotoWithCountWithUser } from "pages";
import React from "react";

interface ProductLiProps {
  product: WithPhotoWithCountWithUser;
}

const ProductLi: React.FC<ProductLiProps> = ({ product }) => {
  return (
    <div key={product.id} className="h-96 shadow-sm rounded-md">
      <div className="relative w-full h-full">
        <Image
          className="rounded-md"
          src={deliveryFile(product?.photos[0]?.url)}
          layout="fill"
          objectFit="cover"
          alt=""
        />
      </div>
      <div className="flex justify-between items-center py-1">
        <div className="flex items-center ">
          <div className="relative w-6 h-6 rounded-full mr-2">
            {product.user.avatar ? (
              <Image
                src={deliveryFile(product?.user?.avatar)}
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
          <div>
            <span>{product.user.username}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <svg
            className="h-5 w-5 text-gray-500 hover:text-red-500 transition-all"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
          <span>{product._count.favs ? product._count.favs : 0}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductLi;

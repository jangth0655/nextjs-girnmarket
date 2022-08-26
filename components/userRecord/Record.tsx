import { MarkType } from "pages/users/[username]/profile";
import React, { Suspense } from "react";

import dynamic from "next/dynamic";

const DynamicProducts = dynamic(() => import("./ProductItem"), {
  suspense: true,
});

const DynamicPurchaseItem = dynamic(() => import("./PurchaseItem"), {
  suspense: true,
});

const DynamicPostItem = dynamic(() => import("./PostItem"), {
  suspense: true,
});

const DynamicLikeItem = dynamic(() => import("./LikeItem"), {
  suspense: true,
});

const DynamicSaleItem = dynamic(() => import("./SaleItem"), {
  suspense: true,
});
const DynamicAboutItem = dynamic(() => import("./AboutItem"), {
  suspense: true,
});

interface RecordProps {
  mark?: MarkType;
  username?: string;
}

const Record: React.FC<RecordProps> = ({ mark, username }) => {
  return (
    <div className="w-ful">
      {mark === "product" && (
        <Suspense fallback={"Loading..."}>
          <DynamicProducts username={username} />
        </Suspense>
      )}
      {mark === "post" && (
        <Suspense fallback={"Loading..."}>
          <DynamicPostItem username={username} />
        </Suspense>
      )}
      {mark === "purchase" && (
        <Suspense fallback={"Loading..."}>
          <DynamicPurchaseItem username={username} />
        </Suspense>
      )}
      {mark === "favList" && (
        <Suspense fallback={`Loading....`}>
          <DynamicLikeItem username={username} />
        </Suspense>
      )}
      {mark === "sale" && (
        <Suspense fallback={"Loading..."}>
          <DynamicSaleItem />
        </Suspense>
      )}
      {mark === "about" && (
        <Suspense fallback={"Loading..."}>
          <DynamicAboutItem username={username} />
        </Suspense>
      )}
    </div>
  );
};
export default Record;

import { MarkType } from "pages/users/[username]/profile";
import React from "react";
import LikeItem from "./LikeItem";
import PostItem from "./PostItem";
import ProductItem from "./ProductItem";
import PurchaseItem from "./PurchaseItem";
import SaleItem from "./SaleItem";

interface RecordProps {
  mark?: MarkType;
  username?: string;
}

const Record: React.FC<RecordProps> = ({ mark, username }) => {
  return (
    <div className="w-ful">
      {mark === "product" && <ProductItem username={username} />}
      {mark === "post" && <PostItem username={username} />}
      {mark === "purchase" && <PurchaseItem username={username} />}
      {mark === "favList" && <LikeItem username={username} />}
      {mark === "sale" && <SaleItem username={username} />}
    </div>
  );
};
export default Record;

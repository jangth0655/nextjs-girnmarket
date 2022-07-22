import React, { Dispatch, SetStateAction } from "react";

interface PaginationProps {
  count?: number;
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
}

const Pagination: React.FC<PaginationProps> = ({ count, setPage, page }) => {
  let pageNumberArray = [];
  pageNumberArray.push(page);

  const totalPage = count ? count : 0;
  const offset = 5;
  const maxPage = Math.ceil(totalPage / offset);

  const onNext = () => {
    console.log("next");
    setPage((prev) => (prev === maxPage ? maxPage : prev + 1));
  };

  const onBack = () => {
    console.log("back");
    setPage((prev) => (prev === 1 ? 1 : prev - 1));
  };
  return (
    <div className="flex justify-center items-center space-x-5">
      <div
        onClick={() => onBack()}
        className="bg-gray-300 rounded-sm hover:bg-gray-500 transition-all cursor-pointer"
      >
        <svg
          className="h-4 w-4 text-white"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div>
        {pageNumberArray.map((page, i) => (
          <span className="font-bold text-sm" key={i}>
            {page}
          </span>
        ))}
      </div>
      <div
        onClick={() => onNext()}
        className="bg-gray-300 rounded-sm hover:bg-gray-500 transition-all cursor-pointer"
      >
        <svg
          className="h-4 w-4 text-white"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};
export default Pagination;

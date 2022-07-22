import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

const searchVariant: Variants = {
  initial: {
    scaleX: 0,
  },
  animate: {
    scaleX: 1,
  },
};

interface SearchForm {
  keyword: string;
}

const SearchIcon: React.FC = () => {
  const router = useRouter();
  const [showingSearch, setShowingSearch] = useState(false);
  const { register, handleSubmit, reset } = useForm<SearchForm>();
  const [keyword, setKeyword] = useState("");

  const onValid = (formData: SearchForm) => {
    setKeyword(formData.keyword);
    reset();
  };

  useEffect(() => {
    if (keyword) {
      router.push({
        pathname: `/products/search`,
        query: {
          keyword,
        },
      });
    }
  }, [keyword, router]);
  return (
    <form
      onSubmit={handleSubmit(onValid)}
      className="flex items-center relative"
    >
      {showingSearch ? (
        <motion.input
          {...register("keyword", {
            required: true,
          })}
          variants={searchVariant}
          initial="initial"
          animate="animate"
          type="text"
          transition={{ type: "linear" }}
          placeholder="Search"
          className="border-2 pl-10 rounded-lg origin-right border-gray-200 placeholder:text-sm text-gray-700 focus:border-pink-400"
        />
      ) : null}
      <motion.svg
        onClick={() => setShowingSearch((prev) => !prev)}
        className="h-5 w-5 text-gray-500 absolute right-2 cursor-pointer"
        animate={{ x: showingSearch ? -178 : 0 }}
        transition={{ type: "linear" }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </motion.svg>
    </form>
  );
};

export default SearchIcon;

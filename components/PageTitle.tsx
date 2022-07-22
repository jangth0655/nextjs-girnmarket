import React from "react";

interface PageTitleProps {
  title: string;
  subTitle?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, subTitle }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-2xl md:text-4xl font-bold mb-3">{title}</h1>
      <h3 className="text-gray-500">{subTitle}</h3>
    </div>
  );
};

export default PageTitle;

import React from "react";

interface NavTitleProps {
  title?: string;
}

const NavTitle: React.FC<NavTitleProps> = ({ title }) => {
  return (
    <div>
      <h1 className="text-lg md:text-2xl font-bold text-black">{title}</h1>
    </div>
  );
};
export default NavTitle;

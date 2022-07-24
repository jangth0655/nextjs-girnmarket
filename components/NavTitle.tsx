import React from "react";

interface NavTitleProps {
  title?: string;
}

const NavTitle: React.FC<NavTitleProps> = ({ title }) => {
  return (
    <div>
      <h1 className="text-base md:text-lg font-bold text-black">{title}</h1>
    </div>
  );
};
export default NavTitle;

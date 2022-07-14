import React from "react";

interface NavTitleProps {
  title?: string;
}

const NavTitle: React.FC<NavTitleProps> = ({ title }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
};
export default NavTitle;

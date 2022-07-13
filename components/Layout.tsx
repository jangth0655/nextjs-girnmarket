import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <section>
      <nav></nav>
      <main>{children}</main>
    </section>
  );
};

export default Layout;

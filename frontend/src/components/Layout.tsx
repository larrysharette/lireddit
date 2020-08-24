import React from "react";
import Wrapper from "./Wrapper";
import Navbar from "./Navbar";

interface LayoutProps {
  variant?: "small" | "regular";
}

const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  return (
    <>
      <Navbar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};

export default Layout;

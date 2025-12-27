import ModalProvider from "@/providers/modal-provider";
import React from "react";

const SubCategoryLayout = ({ children }: { children: React.ReactNode }) => {
  return <ModalProvider>{children}</ModalProvider>;
};

export default SubCategoryLayout;

import ModalProvider from "@/providers/modal-provider";
import React, { ReactNode } from "react";

const ShippingLayout = ({ children }: { children: ReactNode }) => {
  return <ModalProvider>{children}</ModalProvider>;
};

export default ShippingLayout;

// app/layout.tsx หรือ app/(dashboard)/layout.tsx
import ModalProvider from "@/providers/modal-provider";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ModalProvider>{children}</ModalProvider>;
}

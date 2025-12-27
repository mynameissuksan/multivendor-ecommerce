import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const SellerDashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = await currentUser();
  if (user?.privateMetadata.role !== "SELLER") redirect("/");

  return <div>{children}</div>;
};

export default SellerDashboardLayout;

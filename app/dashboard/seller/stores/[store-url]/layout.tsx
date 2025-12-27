import Header from "@/components/dashboard/header/header";
import Sidebar from "@/components/dashboard/sidebar/sidebar";
import { getAllStoreByUserId } from "@/queries/store";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

const SellerStoreDashboardLayout = async ({
  children,
}: {
  children: ReactNode;
}) => {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const stores = await getAllStoreByUserId(user?.id);

  return (
    <div className="w-full h-full flex">
      <Sidebar stores={stores} />
      <div className="w-full ml-75">
        <Header />
        <div className="w-full mt-18.75 p-4">{children}</div>
      </div>
    </div>
  );
};

export default SellerStoreDashboardLayout;

import Header from "@/components/dashboard/header/header";
import Sidebar from "@/components/dashboard/sidebar/sidebar";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

const AdminDashboardLayout = async ({ children }: { children: ReactNode }) => {
  // Block non admins from accessing the admin dashboard
  const user = await currentUser();
  if (!user || user.privateMetadata.role !== "ADMIN") redirect("/");
  return (
    <div className="w-full h-full">
      {/* Sidebar */}
      <Sidebar isAdmin />
      <div className="ml-75">
        {/* Header */}
        <Header />
        <div className="w-full mt-18.75 p-4">{children}</div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;

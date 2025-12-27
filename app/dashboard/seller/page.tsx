import { getAllStoreByUserId } from "@/queries/store";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const SellerDashboardPage = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const stores = await getAllStoreByUserId(user?.id);

  if (stores.length === 0) {
    redirect("/dashboard/seller/stores/new");
  }

  redirect(`/dashboard/seller/stores/${stores[0].url}`);
};

export default SellerDashboardPage;

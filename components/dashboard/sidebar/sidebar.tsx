import Logo from "@/components/shared/logo";
import { currentUser } from "@clerk/nextjs/server";
import UserInfo from "./user-info";
import SidebarNavAdmin from "./nav-admin";
import {
  adminDashboardSidebarOptions,
  sellerDashboardSidebarOptions,
} from "@/constants/data";
import SidebarNavSeller from "./nav-seller";
import { StoreModel } from "@/models/store-model";

interface SidebarProps {
  isAdmin?: boolean;
  stores?: StoreModel[];
}

const Sidebar: React.FC<SidebarProps> = async ({ isAdmin }) => {
  const user = await currentUser();
  return (
    <div className="w-75 border-r h-screen p-4 flex flex-col fixed top-0 left-0 bottom-0">
      <Logo width="100%" height="100px" />
      <span className="mt-3" />
      {user && <UserInfo user={user} />}
      {isAdmin ? (
        <SidebarNavAdmin menuLinks={adminDashboardSidebarOptions} />
      ) : (
        <SidebarNavSeller menuLinks={sellerDashboardSidebarOptions} />
      )}
    </div>
  );
};

export default Sidebar;

import CaegoriesHeader from "@/components/store/layout/categories-header/categories-header";
import Footer from "@/components/store/layout/footer/footer";
import Header from "@/components/store/layout/header/header";
import { ReactNode } from "react";

const StoreLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="">
      <Header />
      <CaegoriesHeader />
      <div className="h-256">{children}</div>
      {/* Footer */}
      <div className="bg-red-200">
        <Footer />
      </div>
    </div>
  );
};

export default StoreLayout;

import ThemeToggle from "@/components/shared/theme-toggle";
import { UserButton } from "@clerk/nextjs";
import React from "react";

const Header = () => {
  return (
    <div className="fixed z-20 md:left-75 left-0 right-0 top-0 p-4 bg-background backdrop-blur-md flex gap-4 items-center border-b">
      <div className="flex items-center gap-2 ml-auto">
        <UserButton afterSwitchSessionUrl="/" />
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Header;

import Link from "next/link";
import React from "react";
import UserMenu from "./user-menu/user-menu";
import Cart from "./cart";
import DownloadApp from "./download-app";
import Search from "./search/search";
import { cookies } from "next/headers";
import { Country } from "@/models/country-model";
import CountryLanguageCurrenSelector from "./current-country-selector";
import ThemeToggle from "@/components/shared/theme-toggle";

const Header = async () => {
  // get cookie from the store
  const cookieStore = await cookies();
  const userCountryCookie = cookieStore.get("userCountry");

  let userCountry: Country = {
    name: "United States",
    city: "",
    code: "US",
    region: "",
  };

  // if cookie existing, update the user country
  if (userCountryCookie) {
    userCountry = JSON.parse(userCountryCookie.value) as Country;
  }

  return (
    <div className="bg-linear-to-r from-slate-500 to-slate-800">
      <div className="h-full w-full lg:flex text-white px-4 lg:px-12">
        <div className="flex lg:w-full lg:flex-1 flex-col lg:flex-row gap-3 py-3">
          <div className="flex item-center justify-between">
            <Link href="/">
              <h1 className="font-extrabold text-3xl font-mono">Shop</h1>
            </Link>

            <div className="flex lg:hidden">
              <UserMenu />
              <Cart />
            </div>
          </div>
          {/* Search Input */}
          <Search />
        </div>

        <div className="hidden lg:flex w-full lg:w-fit lg:mt-2 justify-end mt-1.5 pl-6 space-x-5">
          <div className="lg:flex">
            {/* Download App */}
            <DownloadApp />
          </div>
          {/* Country selector */}
          <CountryLanguageCurrenSelector userCountry={userCountry} />
          <Cart />
          <UserMenu />

          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default Header;

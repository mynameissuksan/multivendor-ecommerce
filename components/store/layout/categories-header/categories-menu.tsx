"use client";

import { cn } from "@/lib/utils";
import { CategoryInput } from "@/models/category-model";
import { ChevronDown, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { Dispatch, SetStateAction, useState } from "react";

const CategoriesMenu = ({
  categories,
  open,
  setOpen,
}: {
  categories: CategoryInput[];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);

  const toggleMenu = (state: boolean) => {
    setOpen(state);

    // Display showing the dropdown untill the trigger  has finished expanding

    if (state) {
      setTimeout(() => {
        setDropdownVisible(true);
      }, 100);
    } else {
      setDropdownVisible(false);
    }
  };

  return (
    <div
      className="relative w-10 h-10 xl:w-[256px] z-50"
      onMouseEnter={() => toggleMenu(true)}
      onMouseLeave={() => toggleMenu(false)}
    >
      <div className="relative">
        {/* Trigger */}
        <div
          className={cn(
            "w-12 xl:w-[256px] h-12 rounded-full -translate-y-1 xl:translate-y-0 xl:h-11 bg-[#535353] text-white text-[20px] relative flex items-center cursor-pointer transition-all duration-100 ease-in-out",
            {
              "w-[256px] bg-[#f5f5f5] text-black text-base rounded-t-4xl rounded-b-none  scale-100":
                open,
              "scale-75": !open,
            }
          )}
        >
          {/* Menu Icon with transition to move right when open */}
          <Menu
            className={cn("absolute top-1/2 -translate-y-1/2 xl:ml-1", {
              "left-5": open,
              "left-3": !open,
            })}
          />
          <span
            className={cn("hidden xl:inline-flex xl:ml-11", {
              "inline-flex ml-14!": open,
            })}
          >
            All Categories
          </span>
          <ChevronDown
            className={cn("hidden xl:inline-flex scale-75 absolute right-3", {
              "inline-flex": open,
            })}
          />
        </div>

        {/* Dropdown */}
        <ul
          className={cn(
            "scrollbar absolute top-10 left-0 w-[256px] bg-[#f5f5f5] transition-all duration-100 ease-in-out overflow-y-auto ",
            {
              "max-h-0 opacity-0": !dropdownVisible,
              "max-h-130.75 opacity-100": dropdownVisible,
            }
          )}
        >
          {categories.map((c) => (
            <Link
              href={`/browse?category=${c.url}`}
              key={c.id}
              className="text-[#222]"
            >
              <li className="relative flex items-center m-0 p-3 pl-6 hover:bg-white">
                <Image
                  src={c.image ?? ""}
                  alt={c.name ?? ""}
                  className="w-4.5 h-4.5"
                  width={100}
                  height={100}
                />
                <span className="text-sm font-normal ml-2 overflow-hidden line-clamp-2 break-word text-black">
                  {c.name}
                </span>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoriesMenu;

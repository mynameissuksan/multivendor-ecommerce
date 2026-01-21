import { AppIcon } from "@/components/store/icons";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// Icon store
import PlayStoreImg from "@/public/assets/icons/google-play.webp";
import AppStoreImg from "@/public/assets/icons/app-store.webp";

const DownloadApp = () => {
  return (
    <div className="relative group">
      <div className="relative">
        <div className="flex h-11 items-center px-2 cursor-pointer">
          <div className="text-[32px]">
            <AppIcon />
          </div>
          <div className="ml-1">
            <div className="max-w-22.5 inline-block font-medium text-xs text-white">
              Download App
            </div>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="absolute hidden top-0 group-hover:block ">
        {/* Trigger */}
        <div className="w-0 h-0 absolute left-4.5 top-10 right-24 border-l-10! border-l-transparent! border-r-10! border-r-transparent! border-b-10! border-b-white"></div>
        <div className="relative mt-12 -ml-44 w-75 bg-white rounded-3xl text-black pt-2 px-1 pb-6 z-50">
          <div className="py-3 px-1 break-word">
            <div className="mx-3">
              <h3 className="font-bold text-[20px] text-black m-0 max-w-0 mx-auto">
                Download App
              </h3>
              <div className="mt-4 flex items-center gap-x-2">
                <Link
                  href=""
                  className="rounded-3xl bg-black grid place-items-center px-4 py-3"
                >
                  <Image src={AppStoreImg} alt="App store" />
                </Link>
                <Link
                  href=""
                  className="rounded-3xl bg-black grid place-items-center px-4 py-3"
                >
                  <Image src={PlayStoreImg} alt="Play store" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadApp;

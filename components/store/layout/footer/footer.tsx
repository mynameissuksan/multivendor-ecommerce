import React from "react";
import NewsLetter from "./news-letter";
import ContactLink from "./contact-links";
import Links from "./links";
import { getSubcategories } from "@/queries/sub-category";

const Footer = async () => {
  const subs = await getSubcategories(7, true);
  return (
    <div className="w-full bg-white">
      {/* New Letter */}
      <NewsLetter />

      {/* Footer links */}
      <div className="max-w-357.5 mx-auto">
        <div className="p-5">
          <div className="grid md:grid-cols-2 md:gap-x-5">
            <ContactLink />
            {/* Links */}
            <Links subs={subs} />
          </div>
        </div>
      </div>

      {/* Rights */}
      <div className="bg-linear-to-r from-slate-500 to-slate-800 px-2 text-white">
        <div className="max-w-357.5 mx-auto flex items-center h-7">
          <span className="text-sm">
            <b>© Deekrub</b> - 2025 All Rights Reserved 
          </span>
        </div>
      </div>
    </div>
  );
};

export default Footer;

import React from "react";
import NewsLetter from "./news-letter";
import ContactLink from "./contact-links";
import Links from "./links";

const Footer = () => {
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
            <Links />
          </div>
        </div>
      </div>

      {/* Rights */}
    </div>
  );
};

export default Footer;

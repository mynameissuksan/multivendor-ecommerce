"use client";

import { Headset } from "lucide-react";
import { SocialLogo } from "social-logos";

const ContactLink = () => {
  return (
    <div className="flex flex-col gap-y-5">
      {/* Question */}
      <div className="space-y-2">
        <div className="flex items-center gap-x-6">
          <Headset className="scale-[190%] stroke-slate-400" />
          <span className="text-[#59645f] text-sm">
            Got Questions? Call us 27/7!
          </span>
          <span className="text-xl">0999999999, 0987654321</span>
        </div>
      </div>
      {/* info  */}
      <b>Contact info</b>
      <div className="text-sm">Udon Thailand 41000</div>
      <div className="flex flex-wrap gap-2 mt-4">
        <SocialLogo
          icon="facebook"
          className="cursor-pointer hover:fill-slate-600"
          size={28}
          fill="#7f7f7f"
        />
      </div>
    </div>
  );
};

export default ContactLink;

interface Props {
  countryName: string;
  countryCode: string;
  city: string | undefined;
}

import { MapPin } from "lucide-react";
import React from "react";

const ShipTo: React.FC<Props> = ({ countryName, countryCode, city }) => {
  return (
    <div className="flex justify-between h-7">
      <div className="flex items-center font-bold mr-2 whitespace-nowrap">
        <span>Ship to</span>
      </div>
      <div className="flex items-center overflow-hidden">
        <MapPin className="w-4 mb-1 text-gray-800" />
        <span className="text-gray-500 text-sm cursor-pointer max-w-50 overflow-hidden pl-0.5 truncate whitespace-normal">
          {countryName}, {city}, {countryCode}
        </span>
      </div>
    </div>
  );
};

export default ShipTo;

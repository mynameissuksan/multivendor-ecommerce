"use client";

import "@/node_modules/flag-icons/css/flag-icons.min.css";

import { Country } from "@/models/country-model";
import { ChevronDown } from "lucide-react";
import CountrySelector from "@/components/shared/country-selector";
import { useState } from "react";

import COUNTRIES from "@/data/countries.json";
import { SelectMenuOption } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function CountryLanguageCurrenSelector({
  userCountry,
}: {
  userCountry: Country;
}) {
  const router = useRouter();

  // State to manage countries dropdown visibility
  const [show, setShow] = useState(false);

  const handleCountryClick = async (country: string) => {
    // find the country data based on the selected country name
    const countryData = COUNTRIES.find((c) => c.name === country);

    if (countryData) {
      const data: Country = {
        name: countryData.name,
        code: countryData.code,
        city: "",
        region: "",
      };

      try {
        // Send a POST request to your API endpoint to set the cookie
        const response = await fetch("/api/set-user-country-in-cookies", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userCountry: data }),
        });

        if (response.ok) {
          router.refresh();
        }
      } catch (error) {
        console.log("Error in handle country click", error);
      }
    }
  };

  return (
    <div className="relative inline-block group">
      {/* Trigger */}
      <div className="flex items-center h-11 py-0 px-2 cursor-pointer">
        <span className="mr-5 h-8.25 grid place-items-center">
          {/* Flags*/}
          <span className={`fi fi-${userCountry.code.toLowerCase()}`}></span>
        </span>
        <div className="ml-1">
          {/* Country name */}
          <span className="block text-xs text-white leading-3 mt-2">
            {userCountry.name}
          </span>
          <b className="text-xs font-bold text-white">
            THB
            <span className="text-white scale-[60%] align-middle inline-block">
              <ChevronDown />
            </span>
          </b>
        </div>
      </div>
      {/* Content */}
      <div className="absolute hidden top-0 group-hover:block cursor-pointer">
        {/* Triangle */}
        <div className="relative mt-12 -ml-32 w-75 bg-white rounded-[24px] text-black pt-2 px-6 pb-6 z-50">
          <div className="absolute -top-1.5 right-24 w-0 h-0  border-l-10 border-l-transparent border-r-10 border-r-transparent border-b-10 border-b-white" />
          <div className="mt-4 leading-6 text-[20px] font-bold">Ship to</div>
          <div className="mt-2">
            <div className="relative text-black bg-white rounded-lg">
              <CountrySelector
                id={"country-selector"}
                open={show}
                onToggle={() => setShow(!show)}
                onChange={(value) => {
                  console.log('value === ',value)
                  handleCountryClick(value);
                }}
                selectedValue={
                  (COUNTRIES.find(
                    (option) => option.name === userCountry.name,
                  ) as SelectMenuOption) || COUNTRIES[0]
                }
              />
              {/* Languages */}
              <div className="mt-4 leading-6 text-[20px] font-bold">
                Languages
              </div>
              <div className="relative mt-2.5 h-10 py-0 px-3 border flex items-center rounded-md border-gray-300 shadow-lg">
                <div className="align-middle text-xs">English</div>
                <span className="absolute right-2">
                  <ChevronDown className="text-black scale-75" />
                </span>
              </div>
              {/* Currency */}
              <div className="mt-4 leading-6 text-[20px] font-bold">
                Currency
              </div>
              <div className="relative mt-2.5 h-10 py-0 px-3 border flex items-center rounded-md border-gray-300 shadow-lg">
                <div className="align-middle text-xs">USD (US Dollar)</div>
                <span className="absolute right-2">
                  <ChevronDown className="text-black scale-75" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

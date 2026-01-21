"use client";

import { cn } from "@/lib/utils";
import { OfferTagModel } from "@/models/offer-tag-model";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

const OfferTagsLinks = ({
  offerTags,
  open,
}: {
  offerTags: OfferTagModel[];
  open: boolean;
}) => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const useBreakpoint = () => {
    const isPhone = useMediaQuery({ query: "(max-width: 640px)" });
    const isSm = useMediaQuery({ query: "(min-width: 640px)" });
    const isMd = useMediaQuery({ query: "(min-width: 768px)" });
    const isLg = useMediaQuery({ query: "(min-width: 1024px)" });
    const is2xl = useMediaQuery({ query: "(min-width: 1536px)" });

    let splitPoint = 1;
    if (is2xl) splitPoint = 7;
    else if (isLg) splitPoint = 6;
    else if (isMd) splitPoint = 4;
    else if (isSm) splitPoint = 3;
    else if (isPhone) splitPoint = 2;

    return splitPoint;
  };

  const splitPoint = useBreakpoint();

  if (!mounted) return null;

  return (
    <div className="relative w-fit">
      <div
        className={cn(
          "flex items-center flex-wrap xl:-translate-x-6 transition-all duration-100 ease-in-out",
          {
            "translate-x-0 sm:translate-x-50": open,
          }
        )}
      >
        {offerTags.slice(0, splitPoint).map((tag, i) => (
          <Link
            key={tag.id}
            href={`/browse?offer=${tag.url}`}
            className={cn(
              "font-bold text-center text-white px-4 leading-10 rounded-4xl hover:bg-[#ffffff33]",
              {
                "text-orange-600": i === 0,
              }
            )}
          >
            {tag.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OfferTagsLinks;

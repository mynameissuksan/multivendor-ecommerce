"use client";
import React from "react";
import { Rating } from "react-simple-star-rating";

const ProductRatingCard = ({ rating }: { rating: number }) => {
  const fixed_rating = Number(rating.toFixed(2));
  return (
    <div className="h-44 flex-1">
      <div className="p-6 bg-[#f5f5f5] flex flex-col h-full justify-center overflow-hidden rounded-lg">
        <div className="text-6xl font-bold">{fixed_rating ?? ""}</div>
        <div className="py-1.5">
          <Rating
            className=""
            size={24}
            initialValue={Number(fixed_rating ?? 0)}
            SVGclassName="inline-block"
            readonly
            allowFraction
          />
        </div>
        <div className="text-[#03c97a] leading-5 mt-2">
          All from verified purchases
        </div>
      </div>
    </div>
  );
};

export default ProductRatingCard;

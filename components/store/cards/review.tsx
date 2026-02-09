"use client";

import ColorWheel from "@/components/shared/color-wheel";
import { ReviewModelInput } from "@/models/review-model";
import Image from "next/image";
import React from "react";
import { Rating } from "react-simple-star-rating";

const ReviewCard = ({ review }: { review: ReviewModelInput }) => {
  const { review_image, user } = review;
  const colors = review.color
    .split(",")
    .filter((color) => color.trim() !== "")
    .map((color) => ({ name: color.trim() }));

  const censorName = `${user?.name[0]}***${user?.name[user.name.length - 1]}`;

  return (
    <div className="border border-[#d8d8d8] rounded-xl flex h-full relative py-4 px-2.5">
      <div className="w-16 space-y-1">
        {user?.picture && (
          <Image
            src={user?.picture}
            alt="Profile image"
            width={100}
            height={100}
            className="w-11 h-11 rounded-full object-cover"
          />
        )}

        <span className="text-xs text-gray-500">
          {censorName.toUpperCase()}
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-between leading-5 overflow-hidden px-1.5">
        <div className="space-y-2">
          <Rating
            size={20}
            initialValue={review.rating}
            readonly
            allowFraction={false}
            SVGclassName="inline-block"
          />
          <div className="flex items-center gap-x-2">
            <ColorWheel colors={colors} size={33} />
            <div className="text-gray-400 text-sm">{review.variant}</div>
            <span>.</span>
            <div className="text-gray-400 text-sm">{review.size}</div>
            <span>.</span>

            <div className="text-gray-400 text-sm">{review.quantity}</div>
          </div>
          <p className="text-sm">{review.review}</p>
          {review_image?.length > 0 && (
            <div className="flex flex-wrap  gap-2">
              {review_image.map((img, i) => (
                <div
                  key={i}
                  className="w-20 h-20 border border-gray-200 rounded-xl overflow-hidden cursor-pointer"
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    height={100}
                    width={100}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;

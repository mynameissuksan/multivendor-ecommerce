"use client";

import React from "react";
import { Rating } from "react-simple-star-rating";
import { RatingStatisticsType } from "@/lib/types";

interface Props {
  statistics: RatingStatisticsType; // [{ rating:1..5, numReviews:number, percentage:number }]
}

const RatingStatisticsCard: React.FC<Props> = ({ statistics }) => {
  return (
    <div className="h-44 flex-1">
      <div className="py-5 px-7 bg-[#f5f5f5] flex flex-col gap-y-2 h-fit justify-center overflow-hidden rounded-lg">
        {statistics.ratingStatistics
          .slice()
          .reverse()
          .map((item, i) => {
            const stars = Number(item.rating ?? 0);
            const percent = Math.max(
              0,
              Math.min(100, Number(item.percentage ?? 0)),
            );

            return (
              <div key={i} className="flex items-center h-4">
                <Rating
                  size={15}
                  initialValue={stars}
                  readonly
                  allowFraction={false}
                  SVGclassName="inline-block"
                />

                {/* progress bar */}
                <div className="relative w-full flex-1 h-1.5 mx-2.5 bg-[#e2dfdf] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="text-xs w-12 leading-4 text-right">
                  {item.numReviews ?? 0}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default RatingStatisticsCard;

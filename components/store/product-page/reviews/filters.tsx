import {
  RatingStatisticsType,
  ReviewFilterType,
  ReviewOrderType,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";

interface Props {
  filters: ReviewFilterType;
  setFilters: Dispatch<SetStateAction<ReviewFilterType>>;
  stats: RatingStatisticsType;
  setSort: Dispatch<SetStateAction<ReviewOrderType | undefined>>;
}

import React from "react";

const ReviewFilter: React.FC<Props> = ({
  filters,
  setFilters,
  setSort,
  stats,
}) => {
  const { rating, hasImages } = filters;
  const { ratingStatistics, reviewsWithImagesCount, totalReviews } = stats;
  return (
    <div className="mt-8 relative overflow-hidden">
      <div className="flex flex-wrap gap-4">
        {/* All */}
        <div
          onClick={() => {
            setFilters({ rating: undefined, hasImages: undefined });
            setSort(undefined);
          }}
          className={cn(
            "bg-[#f5f5f5] text-black border border-transparent rounded-full cursor-pointer py-1.5 px-4",
            {
              "bg-[#ffebed] text-[#fd484f] border-[#fd484f]":
                !rating && !hasImages,
            },
          )}
        >
          All ({totalReviews})
        </div>
        {/* Include Pic */}
        <div
          className={cn(
            "bg-[#f5f5f5] text-black border border-transparent rounded-full cursor-pointer py-1.5 px-4",
            {
              "bg-[#ffebed] text-[#fd484f] border-[#fd484f]": hasImages,
            },
          )}
          onClick={() => setFilters({ ...filters, hasImages: true })}
        >
          Include Pictures ({reviewsWithImagesCount})
        </div>
        {/* Rating Filters */}
        {ratingStatistics.map((r, i) => (
          <div
            key={i}
            onClick={() => {
              setFilters({ ...filters, rating: r.rating });
            }}
            className={cn(
              "bg-[#f5f5f5] text-black border border-transparent rounded-full cursor-pointer py-1.5 px-4",
              {
                "bg-[#ffebed] text-[#fd484f] border-[#fd484f]":
                  r.rating === rating,
              },
            )}
          >
            {r.rating} stars ({r.numReviews})
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewFilter;

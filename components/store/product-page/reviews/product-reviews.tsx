"use client";

import { ProductPageDataType } from "@/lib/types";
import React, { useState } from "react";
import ProductRatingCard from "../../cards/product-rating";
import RatingStatisticsCard from "../../cards/rating-statistics";
import { ReviewModelInput } from "@/models/review-model";
import ReviewCard from "../../cards/review";

interface Props {
  productId: string;
  rating: number;
  statistics: ProductPageDataType;
  reviews: ReviewModelInput[];
}

const ProductReviews: React.FC<Props> = ({ rating, statistics, reviews }) => {
  const [data, setData] = useState<ReviewModelInput[]>(reviews);

  const totalReviews = statistics?.reviewsStatistics.totalReviews || 0;
  const ratingStatistics = statistics?.reviewsStatistics.ratingStatistics;

  const half = Math.ceil(data.length / 2);

  return (
    <div id="reviews" className="pt-6">
      {/* Title */}
      <div className="h-12">
        <h2 className="text-black text-2xl font-bold">
          Custom Reviews ({totalReviews})
        </h2>
      </div>
      {/* Statistics */}
      <div className="w-full">
        <div className="flex items-center gap-4">
          {/* Rating card */}

          <ProductRatingCard rating={rating} />

          {/* Rating stats card */}
          {<RatingStatisticsCard statistics={ratingStatistics!} />}
        </div>
        {totalReviews > 0 && (
          <>
            <div className="space-y-6">
              {/* Reviews filters */}
              {/* Reviews sort */}
            </div>
            {/* Reviews  */}

            <div className="mt-10  min-h-72 grid grid-cols-2 gap-4">
              {data.length > 0 ? (
                <>
                  <div className="flex flex-col gap-3">
                    {data.slice(0, half).map((review, i) => (
                      <ReviewCard key={i} review={review} />
                    ))}
                  </div>
                  <div className="flex flex-col gap-3">
                    {data.slice(half).map((review, i) => (
                      <ReviewCard key={i} review={review} />
                    ))}
                  </div>
                </>
              ) : (
                <>No Reviews.</>
              )}
            </div>
            {/* Pagination */}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;

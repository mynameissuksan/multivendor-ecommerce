/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
"use client";

import {
  ProductPageDataType,
  ReviewFilterType,
  ReviewOrderType,
} from "@/lib/types";
import React, { useEffect, useState } from "react";
import ProductRatingCard from "../../cards/product-rating";
import RatingStatisticsCard from "../../cards/rating-statistics";
import { ReviewModelInput } from "@/models/review-model";
import ReviewCard from "../../cards/review";
import { getProductFilteredReviews } from "@/queries/product";
import ReviewFilter from "./filters";
import ReviewSort from "./review-sort";
import Pagination from "../../store-shared/pagination";
import AddReview from "./add-review";
import ReviewDetails from "../../forms/review-details";
import { ProductVariantModelInput } from "@/models/product-model";

interface Props {
  productId: string;
  rating: number;
  statistics: ProductPageDataType;
  reviews: ReviewModelInput[];
  variantsInfo: ProductVariantModelInput[];
}

const ProductReviews: React.FC<Props> = ({
  rating,
  statistics,
  reviews,
  productId,
  variantsInfo,
}) => {
  const [data, setData] = useState<ReviewModelInput[]>(reviews);

  const totalReviews = statistics?.reviewsStatistics.totalReviews || 0;
  const ratingStatistics = statistics?.reviewsStatistics;

  const half = Math.ceil(data?.length / 2);

  //   Filtering
  const filtered_data = {
    rating: undefined,
    hasImages: undefined,
  };

  const [filters, setFilters] = useState<ReviewFilterType>(filtered_data);
  //   Sorting
  const [sort, setSort] = useState<ReviewOrderType>();

  //   Pagination
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(4);

  useEffect(() => {
    if (filters.hasImages || filters.rating || sort) {
      setPage(1);
      handleGetReviews();
    }

    if (page) {
      handleGetReviews();
    }
  }, [filters, page, sort]);

  const handleGetReviews = async () => {
    const res = (await getProductFilteredReviews(
      productId,
      filters,
      sort,
      page,
      pageSize,
    )) as ReviewModelInput[];

    setData(res);
  };

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
              <ReviewFilter
                filters={filters}
                setFilters={setFilters}
                setSort={setSort}
                stats={ratingStatistics!}
              />
              {/* Reviews sort */}
              <ReviewSort sort={sort} setSort={setSort} />
            </div>
            {/* Reviews  */}
            <div className="mt-10  min-h-72 grid grid-cols-2 gap-4">
              {data?.length > 0 ? (
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
            {/* {data.length} -{pageSize} */}
            {/* Pagination */}
            {data.length >= pageSize && (
              <Pagination
                page={page}
                setPage={setPage}
                totalPages={
                  filters.rating || filters.hasImages
                    ? data.length / pageSize
                    : totalReviews / pageSize
                }
              />
            )}
          </>
        )}
        <div className="mt-10">
          <ReviewDetails
            productId={productId}
            variantsInfo={variantsInfo}
            setReviews={setData}
            reviews={data}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;

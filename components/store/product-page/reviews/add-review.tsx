"use client";

import { ReviewModelInput } from "@/models/review-model";
import React, { Dispatch, SetStateAction, useState } from "react";
import ReviewDetails from "../../forms/review-details";
import { ProductVariantModelInput } from "@/models/product-model";

const AddReview = ({
  productId,
  reviews,
  variantInfo,
}: {
  productId: string;
  reviews: ReviewModelInput[];
  variantInfo: ProductVariantModelInput[];
}) => {
  const [reviewsData, setReviewData] = useState<ReviewModelInput[]>(reviews);

  return (
    <div>
      <ReviewDetails
        productId={productId}
        variantsInfo={variantInfo}
        setReviews={setReviewData}
      />
    </div>
  );
};

export default AddReview;

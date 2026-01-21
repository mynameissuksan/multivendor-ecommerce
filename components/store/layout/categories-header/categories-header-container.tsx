"use client";

/* eslint-disable react-hooks/rules-of-hooks */
import { CategoryInput } from "@/models/category-model";
import { OfferTagModel } from "@/models/offer-tag-model";
import React, { useState } from "react";
import CategoriesMenu from "./categories-menu";
import OfferTagsLinks from "./offer-tags-links";
import { ChevronRight } from "lucide-react";

const categoriesHeaderContainer = ({
  categories,
  offerTags,
}: {
  categories: CategoryInput[];
  offerTags: OfferTagModel[];
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="w-full px-4 flex items-center gap-x1">
      {/* Category menu */}
      <CategoriesMenu categories={categories} open={open} setOpen={setOpen} />

      {/* offer tags links */}
      <div className={open ? "translate-x-5" : ""}>
        <OfferTagsLinks offerTags={offerTags} open={open} />
      </div>
    </div>
  );
};

export default categoriesHeaderContainer;

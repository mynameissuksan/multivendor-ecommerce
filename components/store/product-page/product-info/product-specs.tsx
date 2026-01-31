import { cn } from "@/lib/utils";
import { ProductSpecsModel, VariantSpecsModel } from "@/models/product-model";
import React from "react";

interface Props {
  product: ProductSpecsModel[];
  variant: ProductSpecsModel[];
}

const ProductSpecs: React.FC<Props> = ({ product, variant }) => {
  // console.log("spec", variant);
  return (
    <div className="pt-6">
      {/* Title */}
      <div className="h-12">
        <h2 className="text-black text-2xl font-bold">Specifications</h2>
      </div>
      <div className="flex flex-col lg:flex-row">
        {/* Product Specs Table */}
        <SpecTable product={product} />
        {/* Variant Specs Table */}
        <SpecTable variant={variant} />
      </div>
    </div>
  );
};

export default ProductSpecs;

const SpecTable = ({
  product,
  variant,
  noTopBorder,
}: {
  variant?: VariantSpecsModel[];
  product?: ProductSpecsModel[];
  noTopBorder?: boolean;
}) => {
  if (product && product!.length > 0) {
    return (
      <ul
        className={cn("border grid grid-cols-1 w-full", {
          "border-t-0": noTopBorder,
        })}
      >
        {product!.map((spec, i) => (
          <li key={i}>
            <div className="float-left text-sm leading-7 max-w-[50%] flex">
              <div className="p-4 bg-[#f5f5f5] text-black w-44">
                <span className="leading-5">{spec.name}</span>
              </div>
              <div className="p-4 text-[#151515] flex-1 wrap-break-word leading-5">
                <span className="leading-5">{spec.value}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (variant && variant!.length > 0) {
    return (
      <ul
        className={cn("border grid grid-cols-1 w-full", {
          "border-t-0": noTopBorder,
        })}
      >
        {variant?.map((spec, i) => (
          <li key={i} className="flex border-t-0">
            <div className="float-left text-sm leading-7 max-w-[50%] flex">
              <div className="p-4 bg-[#f5f5f5] text-black w-44">
                <span className="leading-5">{spec.name}</span>
              </div>
              <div className="p-4 text-[#151515] flex-1 wrap-break-word leading-5">
                <span className="leading-5">{spec.value}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }
};

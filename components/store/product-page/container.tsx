import { ProductPageDataType } from "@/lib/types";
import { ReactNode } from "react";
import ProductSwiper from "./product-swiper";
import ProductInfo from "./product-info";

interface Props {
  productData: ProductPageDataType;
  sizeId: string | undefined;
  children: ReactNode;
}

const ProductPageContainer: React.FC<Props> = async ({
  productData,
  sizeId,
  children,
}) => {
  // if there is no product data available, render nothing null
  if (!productData) return null;

  const { images } = productData.product[0]?.product_varian[0];

  return (
    <div className="relative">
      <div className="w-full xl:flex xl:gap-4">
        {/* Product image swiper */}
        <ProductSwiper images={images} />
        <div className="w-full mt-4 md:mt-0 flex flex-col gap-4 md:flex-row">
          {/* Product main info */}
          <ProductInfo productData={productData} sizeId={sizeId} quantity={1} />
          {/* Buy Action card */}
          action
        </div>
      </div>
      <div className="w-[calc(100%-309px)] mt-6 pb-16 bg-yellow-500">
        {children}
      </div>
    </div>
  );
};

export default ProductPageContainer;

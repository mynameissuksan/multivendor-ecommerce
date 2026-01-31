/* eslint-disable react-hooks/static-components */
import { cn } from "@/lib/utils";
import { ProductModelInput } from "@/models/product-model";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import ProductCard from "../cards/product/product-card";

interface Props {
  products: ProductModelInput[];
  title?: string;
  link?: string;
  arrow?: boolean;
  isShowVariant?: boolean;
}

const ProductList: React.FC<Props> = ({
  products,
  title,
  link,
  arrow,
  isShowVariant,
}) => {
  const Title = () => {
    return link ? (
      <Link href={link}>
        <h2 className="text-black text-xl font-bold">
          {title} &nbsp;
          {arrow && <ChevronRight className="w-3 inline-block" />}
        </h2>
      </Link>
    ) : (
      <h2 className="text-black text-xl font-bold">
        {title} &nbsp; {arrow && <ChevronRight className="w-3 inline-block" />}
      </h2>
    );
  };

  return (
    <div className="relative">
      {title && <Title />}{" "}
      {products.length > 0 ? (
        <div
          className={cn(
            "flex flex-wrap -translate-x-5 w-[cacl(100%+3rem)] sm:w-[cacl(100%+1.5rem)",
            {
              "mt-2": title,
            },
          )}
        >
          {products.map((product, i) => (
            <ProductCard
              key={i}
              product={product}
              isShowVariant={isShowVariant}
            />
          ))}
        </div>
      ) : (
        "No Products."
      )}
    </div>
  );
};

export default ProductList;

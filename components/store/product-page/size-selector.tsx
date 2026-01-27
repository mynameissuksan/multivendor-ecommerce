import { ProductSizeModelInput } from "@/models/product-model";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import React from "react";

interface Props {
  sizes: ProductSizeModelInput[];
  sizeId: string | undefined;
}

const SizeSelector: React.FC<Props> = ({ sizes, sizeId }) => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const handleSelectSize = (size: string) => {
    params.set("size", size);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-4">
      {sizes.map((size, i) => (
        <span
          onClick={() => handleSelectSize(size.id!)}
          key={i}
          className="border rounded-full px-5 py-1 cursor-pointer hover:border-black"
          style={{ borderColor: size.id === sizeId ? "#000" : "" }}
        >
          {size.size}
        </span>
      ))}
    </div>
  );
};

export default SizeSelector;

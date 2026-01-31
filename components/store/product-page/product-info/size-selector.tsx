/* eslint-disable @typescript-eslint/no-explicit-any */
import { CartProductType } from "@/lib/types";
import { ProductSizeModelInput } from "@/models/product-model";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import React, { useEffect, useRef } from "react";

interface Props {
  sizes: ProductSizeModelInput[];
  sizeId: string | undefined;
  handleChage: (property: keyof CartProductType, value: any) => void;
}

const SizeSelector: React.FC<Props> = ({ sizes, sizeId, handleChage }) => {
  const sizeRef = useRef<{ id?: string; size?: string }>({});

  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const handleSelectSize = (size: string) => {
    params.set("size", size);
    replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (sizeId) {
      const search_size = sizes.find((s) => s.id === sizeId);
      if (search_size) {
        if (sizeRef.current.id !== search_size.id) {
          handleChage("sizeId", search_size.id);
          sizeRef.current.id = search_size.id;
        }

        if (sizeRef.current.size !== search_size.size) {
          handleChage("size", search_size.size);
          sizeRef.current.size = search_size.size;
        }
      }
    }
  }, [handleChage, sizeId, sizes]);

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

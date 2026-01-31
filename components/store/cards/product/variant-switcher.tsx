import { cn } from "@/lib/utils";
import {
  ProductVariantImagesModelInput,
  ProductVariantModelInput,
} from "@/models/product-model";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

interface Props {
  images: ProductVariantImagesModelInput[];
  setSelectedImageIndex: Dispatch<SetStateAction<number>>;
  selectedImageIndex: number;
  isShowVariant?: boolean;
}

const VariantSwitcher: React.FC<Props> = ({
  images,
  setSelectedImageIndex,
  selectedImageIndex,
  isShowVariant,
}) => {
  if (!isShowVariant) return null;

  return (
    <div>
      {images && images.length > 1 && (
        <div className="flex flex-wrap gap-1">
          {images.map((img, i) => (
            <Link
              href={img.url}
              key={i}
              onMouseEnter={() => setSelectedImageIndex(i)}
              className={cn("p-0.5 rounded-full border-2 border-transparent", {
                "border-border": i === selectedImageIndex,
              })}
            >
              <Image
                src={img.url}
                alt=""
                width={100}
                height={100}
                className="w-8 h-8 object-cover rounded-full"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default VariantSwitcher;

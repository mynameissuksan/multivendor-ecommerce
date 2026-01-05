"use client";

import Image from "next/image";

import NoImageImg from "@/public/assets/images/no_image_2.png";
import { cn, getGridClassName } from "@/lib/utils";

interface ImagePreviewGridProps {
  images: { url: string }[];
  onRemove: (value: string) => void;
}

const ImagePreviewGrid: React.FC<ImagePreviewGridProps> = ({
  images,
  onRemove,
}) => {
  const imagesLength = images.length;

  // Get the grid class name based on the number of images
  const girdClassName = getGridClassName(imagesLength);

  console.log(images);
  if (imagesLength === 0) {
    return (
      <div>
        <Image
          src={NoImageImg}
          alt="No images avaliable"
          width={500}
          height={600}
          className="rounded-md"
        />
      </div>
    );
  }
  return (
    <div className="max-w-4xl">
      <div
        className={cn(
          "grid grid-cols-2 h-200 overflow-hidden bg-white rounded-md",
          girdClassName
        )}
      >
        {images.map((img, i) => (
          <div
            key={i}
            className={cn(
              "relative group h-full w-full border border-gray-300",
              `grid_${imagesLength}_image_${i + 1}`,
              {
                "h-[266.66px]": images.length === 6,
              }
            )}
          >
            {/* Image */}
            <Image
              alt=""
              width={800}
              height={800}
              className="w-full h-full object-cover object-top"
              src={img.url}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagePreviewGrid;

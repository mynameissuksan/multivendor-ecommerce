/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import ColorThief from "colorthief";
import { CartProductType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getGridClassName = (length: number) => {
  switch (length) {
    case 1:
      return "grid-cols-1";
    case 2:
      return "grid-cols-2";
    case 3:
      return "grid-cols-2 grid-rows-2";
    case 4:
      return "grid-cols-2 grid-rows-1";
    case 5:
      return "grid-cols-2 grid-rows-6";
    case 6:
      return "grid-cols-2";
    default:
      return "";
  }
};

// Function to get prominent colors from an image
export const getDominantColors = (imgUrl: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imgUrl;
    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const colors = colorThief.getPalette(img, 4).map((color) => {
          // Convert RGB array to hex string
          return `#${((1 << 24) + (color[0] << 16) + (color[1] << 8) + color[2])
            .toString(16)
            .slice(1)
            .toUpperCase()}`;
        });
        resolve(colors);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
  });
};

export const getShippingDateRange = (minDays: number, maxDays: number) => {
  // Get the current date
  const currentDate = new Date();

  // calculate minDate by adding to current date
  const minDate = new Date(currentDate);
  minDate.setDate(currentDate.getDate() + minDays);

  // calculate minDate by adding to current date
  const maxDate = new Date(currentDate);
  maxDate.setDate(currentDate.getDate() + maxDays);

  return {
    minDate: minDate.toDateString(),
    maxDate: maxDate.toDateString(),
  };
};

// Function to validate the product data before adding it to the cart

export const isProductValidToCart = (product: CartProductType) => {
  const {
    productId,
    variantId,
    productSlug,
    variantSlug,
    name,
    variantName,
    images,
    quantity,
    price,
    sizeId,
    size,
    shippingFee,

    extraShippingFee,
    freeShipping,
    shippingMethod,
    shippingService,
    variantImage,
    weight,

    stock,
    deliveryTimeMax,
    deliveryTimeMin,
  } = product;

  // Ensure that all necessary fields have values
  if (
    !productId ||
    !variantId ||
    !productSlug ||
    !variantSlug ||
    !name ||
    !variantName ||
    !images ||
    quantity <= 0 ||
    price <= 0 ||
    !sizeId || // Ensure sizeId is not empty
    !size || // Ensure size is not empty
    stock <= 0 ||
    weight <= 0 || // weight should be > 0
    !shippingMethod ||
    !variantImage ||
    deliveryTimeMin < 0 ||
    deliveryTimeMax < deliveryTimeMax // Ensure dleivery times are valid
  ) {
    return false;
  }

  return true;
};

// Function to censor names

type CensorReturn = {
  firstName: string;
  lastName: string;
  fullName: string;
};

function censorName(firstName: string, lastName: string): CensorReturn {
  const censor = (name: string): string => {
    if (name.length <= 2) return name;

    const firstChar = name[0];
    const lastChar = name[name.length - 1];

    // Calculate how many charactoer to censor
    const middleLength = name.length - 2; // Length of middile characters to censor

    // create censored version
    return `${firstChar}${"*".repeat(middleLength)}${lastChar}`;
  };

  return {
    firstName: censor(firstName),
    lastName: censor(lastName),
    fullName: `${firstName[0]}***${lastName[lastName.length - 1]}`,
  };
}

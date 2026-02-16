"use client";

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { AddReviewSchema } from "@/lib/schema/review-schema";
import { ProductVariantModelInput } from "@/models/product-model";
import { ReviewModelInput } from "@/models/review-model";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Rating } from "react-simple-star-rating";
import { toast } from "sonner";
import * as z from "zod";
import Select from "../ui/select";
import Input from "../ui/input";
import { Button } from "../ui/button";
import { PulseLoader } from "react-spinners";
import ImageUploadStore from "../store-shared/upload-images";
import { upsertReview } from "@/queries/review";
import { useRouter } from "next/navigation";

const ReviewDetails = ({
  productId,
  data,

  variantsInfo,
  setReviews,
  reviews,
}: {
  productId: string;
  data?: ReviewModelInput;
  variantsInfo: ProductVariantModelInput[];
  setReviews: Dispatch<SetStateAction<ReviewModelInput[]>>;
  reviews: ReviewModelInput[];
}) => {
  //state for selected variant
  const [activeVariant, setActiveVariant] = useState<ProductVariantModelInput>(
    variantsInfo[0],
  );

  const router = useRouter();

  // images
  const [images, setImages] = useState<{ url: string }[]>([]);

  //   State for sizes
  const [sizes, setSizes] = useState<{ name: string; value: string }[]>([]);

  const form = useForm<z.infer<typeof AddReviewSchema>>({
    mode: "onChange",
    resolver: zodResolver(AddReviewSchema as any),
    defaultValues: {
      variantName: data?.variant || activeVariant.name,
      rating: data?.rating || 0,
      size: data?.size || "",
      review: data?.review || "",
      quantity: data?.quantity.toString() || undefined,
      images: data?.review_image || [],
      color: data?.color || "",
    },
  });

  const variantName = useWatch({ control: form.control, name: "variantName" });

  console.log("data", data);

  // Loading status based on form submission
  const isLoading = form.formState.isSubmitting;

  const errors = form.formState.errors;

  // Submit handler for form submission
  const handleSubmit = async (values: z.infer<typeof AddReviewSchema>) => {
    try {
      const response = await upsertReview(productId, {
        variant: values.variantName,
        images: values.images,
        quantity: Number(values.quantity),
        rating: values.rating,
        review: values.review,
        size: values.size,
        color: values.color,
      });

      // console.log("response = ", response.data);

      if (response.ok) {
        setReviews([...reviews, response.data]);

        form.setValue("review", "");
        form.setValue("quantity", "");
        form.setValue("rating", 0);

        router.refresh();
      }
      toast.success("Review Added");
    } catch (error: any) {
      toast.error(error.toString());
    }
  };

  const variants = variantsInfo.map((v) => ({
    name: v.name,
    value: v.name,
    image: v.variant_image,
    colors: v.colors?.map((c) => c.name).join(","),
  }));

  useEffect(() => {
    if (!variantName) return;

    // reset size เมื่อเปลี่ยน variant
    form.setValue("size", "");

    const variant = variantsInfo.find((v) => v.name === variantName);
    if (!variant) return;

    setActiveVariant(variant);

    const sizeData =
      variant.sizes?.map((s) => ({ name: s.size, value: s.size })) ?? [];

    setSizes(sizeData);

    // ถ้า variant.colors เป็น array ของ object -> join ให้ถูก
    // ถ้าเป็น [{name:'blue'}] => variant.colors.map(c=>c.name).join(',')
    // ถ้าเป็น ['blue','black'] => variant.colors.join(',')
    const colorStr = Array.isArray(variant.colors)
      ? typeof variant.colors[0] === "string"
        ? variant.colors.join(",")
        : variant.colors.map((c: any) => c.name).join(",")
      : "";

    form.setValue("color", colorStr);
  }, [variantName, variantsInfo, form]);

  //   console.log("reviews data ", form.watch());

  const addImage = (url: string) => {
    const prev = form.getValues("images") ?? [];
    if (prev.length >= 3) return;
    form.setValue("images", [...prev, { url }], {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="p-4 bg-[#f5f5f5] rounded-xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex flex-col space-y-4">
            {/* Title */}
            <div className="pt-4">
              <h1 className="font-bold text-2xl">Add a review</h1>
            </div>
            {/* Form items */}
            <div className="flex flex-col gap-3">
              <FormField
                name="rating"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-x-2">
                        <span>
                          <Rating
                            className=""
                            size={40}
                            initialValue={Number(field.value ?? 0)}
                            SVGclassName="inline-block"
                            allowFraction
                            onClick={field.onChange}
                          />
                        </span>
                        ({form.getValues().rating.toFixed(1)} out of 5.0)
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div className="w-full">
                  <FormField
                    name="variantName"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            name={field.name}
                            value={field.value}
                            onChange={field.onChange}
                            options={variants}
                            placeholder="Select product"
                            subPlaceholder="Please select a product"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full">
                  <FormField
                    name="size"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            name={field.name}
                            value={field.value}
                            onChange={field.onChange}
                            options={sizes}
                            placeholder="Select size"
                            subPlaceholder="Please select a size"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-full">
                  <FormField
                    name="quantity"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            value={field.value ? field.value.toString() : ""}
                            name="quantity"
                            type="number"
                            placeholder="Quantity"
                            onChange={(e) => {
                              field.onChange(e.toString());
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {/* Form */}
              <FormField
                control={form.control}
                name="review"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <textarea
                        className="min-h-32 p-4 w-full rounded-xl focus:outline-none ring-1 bg-white ring-transparent focus:ring-[#11BE86]"
                        placeholder="Write your review..."
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="images"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUploadStore
                        maxImages={3}
                        value={field.value.map((img) => img.url)}
                        disabled={isLoading}
                        onChange={(url) => {
                          addImage(url);
                        }}
                        onRemove={(url) =>
                          field.onChange([
                            ...field.value.filter(
                              (curren) => curren.url !== url,
                            ),
                          ])
                        }
                      />
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />
              <div className="space-y-2 text-destructive">
                {errors.rating && <p>{errors.rating.message}</p>}
                {errors.size && <p>{errors.size.message}</p>}
                {errors.review && <p>{errors.review.message}</p>}
              </div>
              <div className="w-full flex justify-end">
                <Button type="submit" className="w-36 h-12 bg-pink-600">
                  {isLoading ? (
                    <PulseLoader size={5} color="#fff" />
                  ) : (
                    "Submit review"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ReviewDetails;

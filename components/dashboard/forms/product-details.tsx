/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ImageUpload from "../shared/image-upload";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CategoryModel } from "@/models/category-model";
import { ProductFormSchema } from "@/lib/schema/product-schema";
import { ProductModelInput } from "@/models/product-model";
import ImagePreviewGrid from "../shared/images-preview-grid";
import ClickToAddInputs from "./click-to-add";

interface ProductDetailsProps {
  data?: ProductModelInput; // store info
  categories: CategoryModel[]; // category info
  storeUrl: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  data,
  categories,
  storeUrl,
}) => {
  // State for colors
  const [colors, setColors] = useState<{ color: string }[]>([{ color: "" }]);
  // const [images, setImages] = useState<{ url: string }[]>([{ url: "" }]);
  const router = useRouter();

  // console.log("Color watch", colors);

  const form = useForm<z.infer<typeof ProductFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: data?.name,
      description: data?.description,
      variantName: data?.product_varian[0]?.name,
      variantDescription: data?.product_varian[0]?.description,
      images: data?.product_varian[0]?.images || [],
      categoryId: data?.categories?.id,
      subCategoryId: data?.sub_categories?.id,
      brand: data?.brand,
      sku: data?.product_varian[0]?.sku,
      colors: data?.product_varian?.[0]?.colors?.map((c) => ({
        color: c.name ?? "",
      })) ?? [{ color: "" }],
      sizes: data?.product_varian[0]?.sizes?.map((s) => {
        return {
          size: s.size ?? "",
          quantity: s.quantity ?? 0,
          price: s.price ?? 0,
          discount: s.discount ?? 0,
        };
      }) ?? [{ size: "", quantity: 0, price: 0, discount: 0 }],
      keywords: data?.product_varian[0]?.keywords || [],
      isSale: data?.product_varian[0]?.is_sale,
    },
  });
  // Loading status base on form submission
  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  // submit handler for from submission
  const handleSubmit = async (values: z.infer<typeof ProductFormSchema>) => {
    // console.log("data", data?.user_id);
    try {
      // await upsertStore({});

      //   console.log("Response from upsertCategory:", response);
      toast("Success", {
        description: data?.id
          ? "Product updated successfully"
          : "Product created successfully",
      });

      if (data?.id) {
        console.log("Refrsh");
        router.refresh();
      } else {
        // router.push(`/dashboard/seller/stores/${values.url ?? data?.url}`);
      }
    } catch (error: any) {
      toast("Error", {
        description: error.message,
      });
    }
  };

  // Whenever colors, sizes, keywords changes we update the form values
  useEffect(() => {
    form.setValue("colors", colors);
  }, [colors, form]);

  console.log("form colors ---->", form.getValues().colors);

  return (
    <AlertDialog>
      <Card className="w-ful">
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data?.name}`
              : "Lets create a product. You can edit product later form the product page."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* Images - Colors  */}
              <div className="flex flex-col gap-y-6 xl:flex-row">
                <FormField
                  name="images"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full xl:border-r">
                      <FormControl>
                        <div>
                          <ImagePreviewGrid
                            colors={colors}
                            setColors={setColors}
                            images={field.value}
                            onRemove={(url) => {
                              field.onChange(
                                field.value.filter((img) => img.url !== url)
                              );
                            }}
                          />

                          <FormMessage className="ml-6" />
                          <ImageUpload
                            type="standard"
                            dontShowPreview
                            value={field.value.map((img) => img.url)}
                            disabled={isLoading}
                            onChange={(url) => {
                              const current = form.getValues("images") ?? [];
                              field.onChange([...current, { url }]);
                            }}
                            onRemove={(url) =>
                              field.onChange([
                                ...field.value.filter(
                                  (curren) => curren.url !== url
                                ),
                              ])
                            }
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* Colors */}
                <div className="w-full flex flex-col gap-y-3 xl:pl-5">
                  <ClickToAddInputs
                    details={colors}
                    setDetails={setColors}
                    initialDetail={{ color: "" }}
                    header="Colors"
                  />
                </div>
              </div>

              {/* Name  */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Store Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Name"
                        {...field}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Loading..."
                  : data?.id
                  ? "Save product"
                  : "Create product"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default ProductDetails;

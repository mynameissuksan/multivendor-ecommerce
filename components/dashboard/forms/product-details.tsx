/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { format } from "date-fns";
import DateTimePicker from "react-datetime-picker";

// datetime picker
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

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
import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { SubCategoryModel } from "@/models/sub-category-model";
import { getAllSubCategoriesForCategory } from "@/queries/sub-category";
import { Checkbox } from "@/components/ui/checkbox";
import { WithContext as ReactTags } from "react-tag-input";
import { upsertProduct } from "@/queries/product";

// Jodit editor
import JoditEditor from "jodit-react";

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
  const router = useRouter();

  // State for colors
  const [colors, setColors] = useState<{ color: string }[]>([{ color: "" }]);

  const [sizes, setSizes] = useState<
    { size: string; price: number; quantity: number; discount: number }[]
  >(
    data?.product_varian[0]?.sizes || [
      { size: "", price: 0, quantity: 0, discount: 0 },
    ]
  );



  // console.log('Product size',sizes)

  // state for product specs
  const [productSpecs, setProductSpecs] = useState<
    { name: string; value: string }[]
  >(data?.product_specs || [{ name: "", value: "" }]);

  // state for variant specs
  const [variantSpecs, setVariantSpecs] = useState<
    { name: string; value: string }[]
  >(data?.product_varian[0].variant_specs || [{ name: "", value: "" }]);

  // state for questions
  const [questions, setQuestions] = useState<
    { question: string; answer: string }[]
  >(data?.questions || [{ question: "", answer: "" }]);

  const [subCategories, setSubCategories] = useState<SubCategoryModel[]>([]);
  // Handle keywords input
  const [keywords, setKeywords] = useState<string[]>([]);
  // const [images, setImages] = useState<{ url: string }[]>([{ url: "" }]);

  // jodit editor
  const productDecEditor = useRef(null);
  const variantDecEditor = useRef(null);

  // console.log("Color watch", colors);

  // console.log("data?.categories?.id", data?.categories?.id);

  // console.log("variant", data?.product_varian);

  const form = useForm<z.infer<typeof ProductFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: data?.name || "",
      description: data?.description || "",
      variantName: data?.product_varian[0].name || "",
      variantDescription: data?.product_varian[0]?.description || "",
      images: data?.product_varian[0]?.images || [],
      categoryId: data?.categories?.id || "",
      subCategoryId: data?.sub_categories?.id || "",
      brand: data?.brand || "",
      sku: data?.product_varian[0]?.sku || "",
      product_specs: data?.product_specs,
      variant_specs: data?.product_varian[0].variant_specs,
      questions: data?.questions,
      variantImage: data?.product_varian[0]?.variant_image
        ? [{ url: data.product_varian[0].variant_image }]
        : [],
      colors: data?.product_varian[0]?.colors?.map((c) => ({
        color: c.name ?? "",
      })) ?? [{ color: "" }],
      sizes: data?.product_varian[0]?.sizes?.map((s) => ({
        size: s.size ?? "",
        quantity: s.quantity ?? 0,
        price: s.price ?? 0,
        discount: s.discount ?? 0,
      })) ?? [{ size: "", quantity: 0, price: 0, discount: 0 }],
      keywords: data?.product_varian[0]?.keywords || [],
      isSale: data?.product_varian[0]?.is_sale || false,
      saleEndDate:
        data?.product_varian[0]?.sale_end_date ||
        format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
    },
  });

  // console.log("product specs", form.watch().product_specs);
  // console.log("variant specs", form.watch().variant_specs);

  // useEfect to get subCategories when user chanage a category
  const categoryId = form.watch("categoryId");

  useEffect(() => {
    if (!categoryId) return;

    const fetchSubCategories = async () => {
      const res = await getAllSubCategoriesForCategory(categoryId);
      setSubCategories(res);

      // AUTO SELECT ค่าเดิม
      if (data?.sub_categories?.id) {
        const exists = res.find((sub) => sub.id === data.sub_categories?.id);

        if (exists) {
          form.setValue("subCategoryId", data.sub_categories.id, {
            shouldDirty: false,
            shouldTouch: false,
          });
        }
      } else {
        // create mode  reset
        form.setValue("subCategoryId", "");
      }
    };

    fetchSubCategories();
  }, [categoryId, data, form]);

  // Extract errors state from form
  const errors = form.formState.errors;
  // Loading status base on form submission
  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  // Whenever colors, sizes, keywords changes we update the form values
  useEffect(() => {
    form.setValue("colors", colors);
    form.setValue("sizes", sizes);
    form.setValue("keywords", keywords);
    form.setValue("product_specs", productSpecs);
    form.setValue("variant_specs", variantSpecs);
  }, [colors, form, sizes, keywords, productSpecs, variantSpecs]);

  // console.log("form sizes ---->", form.watch().sizes);

  // submit handler for from submission
  const handleSubmit = async (values: z.infer<typeof ProductFormSchema>) => {
    // console.log("data submit ", {
    //   id: data?.id,
    //   name: values.name,
    //   description: values.description,
    //   brand: values.brand,
    //   categories: {
    //     id: values.categoryId,
    //   },
    //   sub_categories: {
    //     id: values.subCategoryId,
    //   },
    //   product_varian: {
    //     id: data?.product_varian.id,
    //     name: values.variantName,
    //     description: values.variantDescription,
    //     sku: values.sku,
    //     is_sale: values.isSale,
    //     keywords: values.keywords,
    //     images: values.images.map((img) => ({ url: img.url })),
    //     colors: values.colors.map((c) => ({ name: c.color })),
    //     sizes: values.sizes.map((s) => ({
    //       size: s.size,
    //       quantity: s.quantity,
    //       price: s.price,
    //       discount: s.discount,
    //     })),
    //   },
    // });

    try {
      const response = await upsertProduct(
        {
          id: data?.id,
          name: values.name,
          description: values.description,
          brand: values.brand,
          categories: {
            id: values.categoryId,
          },
          sub_categories: {
            id: values.subCategoryId,
          },
          product_specs: values.product_specs.map((spec) => ({
            name: spec.name ?? "",
            value: spec.value ?? "",
          })),
          questions: values.questions,
          product_varian: [
            {
              id: data?.product_varian[0]!.id,
              name: values.variantName,
              description: values.variantDescription,
              sku: values.sku,
              is_sale: values.isSale ?? false,
              sale_end_date: values.saleEndDate,
              variant_specs: values.variant_specs.map((spec) => ({
                name: spec.name ?? "",
                value: spec.value ?? "",
              })),

              variant_image: values.variantImage[0].url,
              keywords: values.keywords,
              images: values.images.map((img) => ({ url: img.url })),
              colors: values.colors.map((c) => ({ name: c.color })),
              sizes: values.sizes.map((s) => ({
                size: s.size,
                quantity: s.quantity,
                price: s.price,
                discount: s.discount,
              })),
            },
          ],
        },
        storeUrl
      );

      toast("Success", {
        description: response.message,
      });

      if (data?.id && data?.product_varian[0]?.id) {
        router.refresh();
      } else {
        router.push(`/dashboard/seller/stores/${storeUrl}/products`);
      }
    } catch (error: any) {
      toast("Error", {
        description: error.message,
      });
    }
  };

  interface Keyword {
    id: string;
    [key: string]: string;
  }

  const handleAddition = (keyword: Keyword) => {
    if (keywords.length === 10) return;
    setKeywords((prev) => [...prev, keyword.text]);
  };

  const handleDeleteKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => index !== i));
  };

  return (
    <AlertDialog>
      <Card className="w-full">
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
                    <FormItem className="w-full xl:border-r px-5">
                      <FormControl>
                        <div className="space-y-5">
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
                    colorPicker
                  />
                  {errors.colors && (
                    <span className="text-sm font-medium text-destructive">
                      {errors.colors.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Name  */}
              <div className="flex flex-col lg:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Product Name"
                          {...field}
                          value={field.value ?? ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Variant  */}
                <FormField
                  control={form.control}
                  name="variantName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Variant Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Variant Name"
                          {...field}
                          value={field.value ?? ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Product and variant description editor tabes */}
              <Tabs defaultValue="product" className="w-full">
                <TabsList className="w-full gird grid-cols-2 h-11">
                  <TabsTrigger
                    value="product"
                    className="dark:bg-gray-900 dark:text-white"
                  >
                    Product description
                  </TabsTrigger>
                  <TabsTrigger
                    value="variant"
                    className="dark:bg-gray-900 dark:text-white"
                  >
                    Variant description
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="product">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <JoditEditor
                            ref={productDecEditor}
                            value={form.getValues().description}
                            onChange={(content) => {
                              form.setValue("description", content);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="variant">
                  <FormField
                    control={form.control}
                    name="variantDescription"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <JoditEditor
                            ref={variantDecEditor}
                            value={form.getValues().variantDescription}
                            onChange={(content) => {
                              form.setValue("variantDescription", content);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              {/* Category - Sub Category */}
              <div className="flex flex-col lg:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Select Category</FormLabel>
                      <Select
                        defaultValue={field.value}
                        value={field.value}
                        disabled={isLoading || categories?.length === 0}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Category</SelectLabel>
                            {categories?.map((category, index) => (
                              <SelectItem value={category.id} key={index}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("categoryId") && (
                  <FormField
                    control={form.control}
                    name="subCategoryId"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Select Sub Category</FormLabel>

                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isLoading || subCategories.length === 0}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a Sub Category" />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Sub Category</SelectLabel>

                              {subCategories.map((subCategory) => (
                                <SelectItem
                                  key={subCategory.id}
                                  value={subCategory.id}
                                >
                                  {subCategory.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Brand,SKU */}
              <div className="flex flex-col lg:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Brand"
                          {...field}
                          value={field.value ?? ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product sku</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="sku"
                          {...field}
                          value={field.value ?? ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center gap-10 py-14">
                {/* Variant image - */}

                <div className="border-r pr-10">
                  <FormField
                    name="variantImage"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center justify-center">
                          Variant Image
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-5">
                            <ImageUpload
                              type="profile"
                              dontShowPreview
                              value={field.value.map((img) => img.url)}
                              disabled={isLoading}
                              onChange={(url) => {
                                field.onChange([{ url }]);
                              }}
                              onRemove={(url) =>
                                field.onChange([
                                  ...field.value.filter(
                                    (curren) => curren.url !== url
                                  ),
                                ])
                              }
                            />
                            <FormMessage className="ml-6" />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Keywords */}
                <div className="space-y-3 w-full flex flex-col">
                  <FormField
                    control={form.control}
                    name="keywords"
                    render={({ field }) => (
                      <FormItem className="relative flex-1">
                        <FormLabel>Product Keywords</FormLabel>
                        <FormControl>
                          <ReactTags
                            handleAddition={handleAddition}
                            handleDelete={handleDeleteKeyword}
                            autocomplete
                            placeholder="Keywords (winter jacket, warm)"
                            classNames={{
                              tagInputField:
                                "border rounded-md p-2 w-full focus:outline-none",
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-wrap gap-1">
                    {keywords.map((k, i) => (
                      <div
                        key={i}
                        className="text-xs inline-flex items-center px-3 py-1 bg-blue-700 rounded-full gap-x-2"
                      >
                        <span>{k}</span>
                        <span
                          className="cursor-pointer"
                          onClick={() => handleDeleteKeyword(i)}
                        >
                          x
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sizes */}
              <div className="w-full flex flex-col gap-y-3">
                <ClickToAddInputs
                  details={sizes}
                  setDetails={setSizes}
                  header="Sizes, Quantitys, Prices, Discount"
                  initialDetail={{
                    size: "",
                    price: 0,
                    quantity: 0,
                    discount: 0,
                  }}
                />
                {errors.sizes && (
                  <span className="text-sm font-medium text-destructive">
                    {errors.sizes.message}
                  </span>
                )}
              </div>

              {/* Product and variant spec */}
              <Tabs defaultValue="productSpecs" className="w-full">
                <TabsList className="w-full gird grid-cols-2 h-11">
                  <TabsTrigger
                    value="productSpecs"
                    className="dark:bg-gray-900 dark:text-white"
                  >
                    Product Specification
                  </TabsTrigger>
                  <TabsTrigger
                    value="variantSpecs"
                    className="dark:bg-gray-900 dark:text-white"
                  >
                    Variant Specification
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="productSpecs">
                  <div className="w-full flex flex-col gap-y-3">
                    <ClickToAddInputs
                      details={productSpecs}
                      setDetails={setProductSpecs}
                      initialDetail={{
                        name: "",
                        value: "",
                      }}
                    />
                    {errors.product_specs && (
                      <span className="text-sm font-medium text-destructive">
                        {errors.product_specs.message}
                      </span>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="variantSpecs">
                  <div className="w-full flex flex-col gap-y-3">
                    <ClickToAddInputs
                      details={variantSpecs}
                      setDetails={setVariantSpecs}
                      initialDetail={{
                        name: "",
                        value: "",
                      }}
                    />
                    {errors.variant_specs && (
                      <span className="text-sm font-medium text-destructive">
                        {errors.variant_specs.message}
                      </span>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Questions */}
              <div className="w-full flex flex-col gap-y-3">
                <ClickToAddInputs
                  details={questions}
                  setDetails={setQuestions}
                  header="Questions & Answers"
                  initialDetail={{
                    size: "",
                    price: 0,
                    quantity: 0,
                    discount: 0,
                  }}
                />
                {errors.questions && (
                  <span className="text-sm font-medium text-destructive">
                    {errors.questions.message}
                  </span>
                )}
              </div>

              {/* Is On Sale */}
              <div className="flex border rounded-md">
                <FormField
                  control={form.control}
                  name="isSale"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>On Sale</FormLabel>
                        <FormDescription>
                          Is this product on sale?
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {form.getValues().isSale && (
                  <FormField
                    control={form.control}
                    name="saleEndDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 p-4">
                        <FormControl>
                          <DateTimePicker
                            format="yyyy-MM-dd"
                            onChange={(date) => {
                              field.onChange(
                                date
                                  ? format(date, "yyyy-MM-dd'T'HH:mm:ss")
                                  : ""
                              );
                            }}
                            value={field.value ? new Date(field.value) : null}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                onClick={() =>
                  console.log("Button clicked!", {
                    isLoading,
                    errors: form.formState.errors,
                  })
                }
              >
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

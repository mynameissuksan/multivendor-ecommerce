/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";

import { SubCategoryFormSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import ImageUpload from "../shared/image-upload";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SubCategoryModel } from "@/models/sub-category-model";
import { upsertSubCategory } from "@/queries/sub-category";
import { CategoryModel } from "@/models/category-model";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubCategoryDetailsProps {
  data?: SubCategoryModel;
  categories: CategoryModel[];
}

const SubCategoryDetail: React.FC<SubCategoryDetailsProps> = ({
  data,
  categories,
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof SubCategoryFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(SubCategoryFormSchema),
    defaultValues: {
      name: data?.name || "",
      image: data?.image ? [{ url: data.image }] : [],
      url: data?.url || "",
      featured: data?.featured || false,
      categoryId: data?.categoryId || "",
    },
  });
  // Loading status base on form submission
  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (data) {
      form.reset({
        name: data?.name,
        image: [{ url: data?.image }],
        url: data?.url,
        featured: data?.featured,
        categoryId: data.categoryId,
      });
    }
  }, [data, form]);

  // submit handler for from submission
  const handleSubmit = async (
    values: z.infer<typeof SubCategoryFormSchema>
  ) => {
    try {
      const response = await upsertSubCategory({
        id: data?.id,
        name: values.name,
        image: values.image.length > 0 ? values.image[0].url : "",
        url: values.url,
        featured: values.featured,
        categoryId: values.categoryId,
      });

      console.log("Response from upsertSubCategory:", response);
      toast("Success", {
        description: data?.id
          ? "Sub Category updated successfully"
          : "Sub Category created successfully",
      });

      if (data?.id) {
        router.refresh();
      } else {
        router.push("/dashboard/admin/sub-categories");
      }
    } catch (error: any) {
      toast("Error", {
        description: error.message,
      });
    }
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sub Category Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data?.name}`
              : "Lets create a sub category. You can edit sub category later form the sub category page."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                name="image"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        type="profile"
                        value={field.value.map((img) => img.url)}
                        disabled={isLoading}
                        onChange={(url) => field.onChange([{ url }])}
                        onRemove={(url) =>
                          field.onChange([
                            ...field.value.filter(
                              (curren) => curren.url !== url
                            ),
                          ])
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Sub Category Name</FormLabel>
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
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Url</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="/sub-category-url"
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
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Select Category</FormLabel>
                    <Select
                      defaultValue={field.value}
                      value={field.value}
                      disabled={isLoading || categories.length === 0}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-45">
                        <SelectValue placeholder="Select a Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Category</SelectLabel>
                          {categories.map((category, index) => (
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
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>
                        This sub Category will appear on the home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Loading..."
                  : data?.id
                  ? "Save sub category"
                  : "Create sub category"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default SubCategoryDetail;

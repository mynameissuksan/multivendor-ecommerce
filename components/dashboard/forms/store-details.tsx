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
import { upsertCategory } from "@/queries/category";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { StoreFormSchema } from "@/lib/schemas";
import { StoreModel } from "@/models/store-model";
import { Textarea } from "@/components/ui/textarea";

interface CategoryDetailsProps {
  data?: StoreModel;
}

const StoreDetails: React.FC<CategoryDetailsProps> = ({ data }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof StoreFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(StoreFormSchema),
    defaultValues: {
      name: data?.name,
      description: data?.description,
      email: data?.email,
      phone: data?.phone,
      logo: data?.logo ? [{ url: data.logo }] : [],
      cover: data?.cover ? [{ url: data.cover }] : [],
      url: data?.url,
      featured: data?.featured,
      status: data?.status.toString(),
    },
  });
  // Loading status base on form submission
  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (data) {
      form.reset({
        name: data?.name,
        description: data?.description,
        email: data?.email,
        phone: data?.phone,
        logo: [{ url: data.logo }],
        cover: [{ url: data.cover }],
        url: data?.url,
        featured: data?.featured,
        status: data?.status,
      });
    }
  }, [data, form]);

  // submit handler for from submission
  const handleSubmit = async (values: z.infer<typeof StoreFormSchema>) => {
    try {
      //   const response = await upsertCategory({});

      //   console.log("Response from upsertCategory:", response);
      toast("Success", {
        description: data?.id
          ? "Category updated successfully"
          : "Category created successfully",
      });

      if (data?.id) {
        router.refresh();
      } else {
        router.push("/dashboard/admin/categories");
      }
    } catch (error: any) {
      toast("Error", {
        description: error.message,
      });
    }
  };

  return (
    <AlertDialog>
      <Card className="w-ful">
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data?.name}`
              : "Lets create a store. You can edit store later form the store page."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* Logo - Cover */}
              <div className="relative py-2 mb-24">
                <FormField
                  name="logo"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="absolute -bottom-20 z-10 left-2 sm:inset-x-5">
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
                      <FormMessage className="ml-6" />
                    </FormItem>
                  )}
                />
                <FormField
                  name="cover"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          type="cover"
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
                      <FormMessage className="lg:text-center md:text-end sm:text-end text-end" />
                    </FormItem>
                  )}
                />
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
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Store Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description"
                        {...field}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Email - Phone */}
              <div className="flex flex-col gap-6 md:flex-row">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Email"
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Phone"
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

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Url</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="/store-url"
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
                        This store will appear on the home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Loading..."
                  : data?.id
                  ? "Save store"
                  : "Create store"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default StoreDetails;

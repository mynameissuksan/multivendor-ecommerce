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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CountryWithShippingRateModel } from "@/models/shipping-model";
import { ShippingRateFormSchema } from "@/lib/schema/shipping-rate-schema";
import { NumberInput } from "@tremor/react";
import { Textarea } from "@/components/ui/textarea";
import { upsertShippngRate } from "@/queries/store";

interface ShippingRateDetailssProps {
  data?: CountryWithShippingRateModel;
  storeUrl: string;
}

const ShippingRateDetails: React.FC<ShippingRateDetailssProps> = ({
  data,
  storeUrl,
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof ShippingRateFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(ShippingRateFormSchema) as any,
    defaultValues: {
      countryId: data?.countryId ?? "",
      countryName: data?.countryName ?? "",
      shippingService: data?.shippingRate?.shipping_service ?? "",

      shippingFeePerItem: data?.shippingRate?.shipping_fee_per_item ?? 0,
      shippingFeeForAdditionalItem:
        data?.shippingRate?.shipping_fee_additional_item ?? 0,
      shippingFeePerKg: data?.shippingRate?.shipping_fee_per_kg ?? 0,
      shippingFeeFixed: data?.shippingRate?.shipping_fee_fixed ?? 0,

      deliveryTimeMin: data?.shippingRate?.delivery_time_min ?? 1,
      deliveryTimeMax: data?.shippingRate?.delivery_time_max ?? 1,

      returnPolicy: data?.shippingRate?.return_policy ?? "",
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
  const handleSubmit = async (
    values: z.infer<typeof ShippingRateFormSchema>
  ) => {
    const response = await upsertShippngRate(storeUrl, {
      countryId: data?.countryId,
      countryName: values.countryName,
      shippingRate: {
        country_id: data?.countryId,
        shipping_service: values.shippingService,
        shipping_fee_per_kg: values.shippingFeePerKg,
        shipping_fee_additional_item: values.shippingFeeForAdditionalItem,
        shipping_fee_fixed: values.shippingFeeFixed,
        shipping_fee_per_item: values.shippingFeePerItem,
        return_policy: values.returnPolicy,
        delivery_time_max: values.deliveryTimeMax,
        delivery_time_min: values.deliveryTimeMin,
      },
    });

    try {
      toast("Success", {
        description: response.message,
      });

      if (data?.countryId) {
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
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Shipping Rate</CardTitle>
          <CardDescription>
            Update Shipping rate information for {data?.countryName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="hidden">
                <FormField
                  control={form.control}
                  disabled
                  name="countryId"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
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
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="countryName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Country Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Country Name"
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
                  name="shippingService"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping service</FormLabel>
                      <FormControl>
                        <Input
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
                  name="shippingFeePerItem"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping fee per item</FormLabel>
                      <FormControl>
                        <NumberInput
                          {...field}
                          value={field.value ?? 0}
                          onValueChange={field.onChange}
                          step={0.1}
                          min={0}
                          className="shadow-none! px-3 rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shippingFeeForAdditionalItem"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping fee for addional item</FormLabel>
                      <FormControl>
                        <NumberInput
                          {...field}
                          value={field.value ?? ""}
                          onValueChange={field.onChange}
                          step={0.1}
                          min={0}
                          className="shadow-none! px-3 rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shippingFeePerKg"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping fee per kg</FormLabel>
                      <FormControl>
                        <NumberInput
                          {...field}
                          value={field.value ?? 0}
                          onValueChange={field.onChange}
                          step={0.1}
                          min={0}
                          className="shadow-none! px-3 rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shippingFeeFixed"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel> Fixed Shipping Fee</FormLabel>
                      <FormControl>
                        <NumberInput
                          {...field}
                          value={field.value ?? 0}
                          onValueChange={field.onChange}
                          step={0.1}
                          min={0}
                          className="shadow-none! px-3 rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deliveryTimeMin"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel> Delivery Time Min</FormLabel>
                      <FormControl>
                        <NumberInput
                          {...field}
                          value={field.value ?? 1}
                          onValueChange={field.onChange}
                          min={1}
                          className="shadow-none! px-3 rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deliveryTimeMax"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel> Delivery Time Max</FormLabel>
                      <FormControl>
                        <NumberInput
                          {...field}
                          value={field.value ?? 1}
                          onValueChange={field.onChange}
                          min={1}
                          className="shadow-none! px-3 rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="returnPolicy"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Return policy</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          onChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />{" "}
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Save changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default ShippingRateDetails;

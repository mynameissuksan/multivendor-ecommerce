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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { StoreModelInput } from "@/models/store-model";
import { StoreShippingSchema } from "@/lib/schema/store-schema";
import { NumberInput } from "@tremor/react";
import { Textarea } from "@/components/ui/textarea";
import { updateStoreDefaultShippingDetails } from "@/queries/store";

interface StoreDefaultShippingDetailssProps {
  data?: StoreModelInput;
  storeUrl: string;
}

const StoreDefaultShippingDetails: React.FC<
  StoreDefaultShippingDetailssProps
> = ({ data, storeUrl }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof StoreShippingSchema>>({
    mode: "onChange",
    resolver: zodResolver(StoreShippingSchema) as any,
    defaultValues: {
      defaultShippingService: data?.default_shipping_service ?? "",
      defaultShippingFeePerItem: data?.default_shipping_fee_per_item ?? 0,
      defaultShippingFeeForAdditionalItem:
        data?.default_shipping_fee_for_addional_item ?? 0,
      defaultShippingFeePerKg: data?.default_shipping_fee_per_kg ?? 0,
      defaultDeliveryTimeMax: data?.default_delivery_time_max ?? 31,
      defaultDeliveryTimeMin: data?.default_delivery_time_min ?? 1,
      returnPolicy: data?.return_policy ?? "",
      defaultShippingFeeFixed: data?.default_shipping_fee_fixed ?? 0,
    },
  });
  // Loading status base on form submission
  const isLoading = form.formState.isSubmitting;

  console.log("watch form data", form.watch());

  useEffect(() => {
    if (data) {
      form.reset({
        defaultShippingService: data?.default_shipping_service ?? "",
        defaultShippingFeePerItem: data?.default_shipping_fee_per_item ?? 0,
        defaultShippingFeeForAdditionalItem:
          data?.default_shipping_fee_for_addional_item ?? 0,
        defaultShippingFeePerKg: data?.default_shipping_fee_per_kg ?? 0,
        defaultDeliveryTimeMax: data?.default_delivery_time_max ?? 31,
        defaultDeliveryTimeMin: data?.default_delivery_time_min ?? 1,
        returnPolicy: data?.return_policy ?? "",
        defaultShippingFeeFixed: data?.default_shipping_fee_fixed ?? 0,
      });
    }
  }, [data, form]);

  // submit handler for from submission
  const handleSubmit = async (values: z.infer<typeof StoreShippingSchema>) => {
    try {
      const res = await updateStoreDefaultShippingDetails(storeUrl, {
        default_shipping_service: values.defaultShippingService,
        default_shipping_fee_per_item: values.defaultShippingFeePerItem,
        default_shipping_fee_for_addional_item:
          values.defaultShippingFeeForAdditionalItem,
        default_shipping_fee_per_kg: values.defaultShippingFeePerKg,
        default_delivery_time_max: values.defaultDeliveryTimeMax,
        default_delivery_time_min: values.defaultDeliveryTimeMin,
        return_policy: values.returnPolicy,
        default_shipping_fee_fixed: values.defaultShippingFeeFixed,
      });

      console.log("res ", res);

      toast("Success", {
        description: "Store default shipping details has been updated.",
      });

      router.refresh();
    } catch (error: any) {
      toast("Oops!", {
        description: error.message,
      });
    }
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Store Default Shipping details</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data?.name}`
              : "Lets create a shipping details. You can edit shipping later form the shipping page."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="defaultShippingService"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Shipping Service name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Shipping Service name"
                        {...field}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-wrap gap-4">
                <FormField
                  control={form.control}
                  name="defaultShippingFeePerItem"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping fee per item</FormLabel>
                      <FormControl>
                        <NumberInput
                          placeholder="Shipping fee per item"
                          value={field.value ?? 0}
                          onValueChange={field.onChange}
                          className="shadow-none! rounded-md px-2"
                          min={0}
                          step={0.1}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="defaultShippingFeeForAdditionalItem"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping fee for addional item</FormLabel>
                      <FormControl>
                        <NumberInput
                          placeholder="Shipping fee for addional item"
                          value={field.value}
                          onValueChange={field.onChange}
                          min={0}
                          step={0.1}
                          className="shadow-none! rounded-md px-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <FormField
                  control={form.control}
                  name="defaultShippingFeePerKg"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping fee per Kg</FormLabel>
                      <FormControl>
                        <NumberInput
                          placeholder="Shipping fee per item"
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          className="shadow-none! rounded-md px-2"
                          min={0}
                          step={0.1}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="defaultShippingFeeFixed"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Fixed Shipping Fee</FormLabel>
                      <FormControl>
                        <NumberInput
                          placeholder="Shipping Fee Fixed"
                          defaultValue={field.value ?? 0}
                          onValueChange={field.onChange}
                          min={1}
                          step={0.1}
                          className="shadow-none! rounded-md px-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <FormField
                  control={form.control}
                  name="defaultDeliveryTimeMin"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Minimun Delivery time (days)</FormLabel>
                      <FormControl>
                        <NumberInput
                          placeholder="Minimun Delivery time (days)"
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          className="shadow-none! rounded-md px-2"
                          min={1}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="defaultDeliveryTimeMax"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Maximum Delivery time (days)</FormLabel>
                      <FormControl>
                        <NumberInput
                          placeholder="Maximum Delivery time (days)"
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          min={1}
                          className="shadow-none! rounded-md px-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="returnPolicy"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Return plicy</FormLabel>
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

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Loading..." : "Save changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default StoreDefaultShippingDetails;

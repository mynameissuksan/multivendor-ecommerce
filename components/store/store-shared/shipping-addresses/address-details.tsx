/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ShippingAddressModel } from "@/models/shipping-address";
import { Country } from "@/models/country-model";
import { ShippingAddressSchema } from "@/lib/schema/shipping-address";
import CountrySelector from "@/components/shared/country-selector";
import { SelectMenuOption } from "@/lib/types";
import { upsertShippingAddresss } from "@/queries/user";

interface AddressDetailssProps {
  data?: ShippingAddressModel;
  countries: Country[];
  setShow: Dispatch<SetStateAction<boolean>>;
}

const AddressDetails: React.FC<AddressDetailssProps> = ({
  data,
  countries,
  setShow,
}) => {
  const router = useRouter();

  // State for country selector
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // State for selector country
  const [country, setCountry] = useState<string>("United States");

  const form = useForm<z.infer<typeof ShippingAddressSchema>>({
    mode: "onChange",
    resolver: zodResolver(ShippingAddressSchema as any),
    defaultValues: {
      firstName: data?.first_name,
      lastName: data?.last_name,
      address1: data?.address1,
      address2: data?.address2,
      city: data?.city,
      countryId: data?.country_id || countries[0].id,
      phone: data?.phone,
      state: data?.state,
      zip_code: data?.zip_code,
      default: data?.addr_default,
    },
  });
  // Loading status base on form submission
  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (data) {
      form.reset({
        ...data,
        address2: data.address2 || "",
      });

      handleCountryChange(data.country!.name);
    }
  }, [data, form]);

  // submit handler for from submission
  const handleSubmit = async (
    values: z.infer<typeof ShippingAddressSchema>,
  ) => {
    try {
      const response = await upsertShippingAddresss({
        id: data?.id,
        first_name: values.firstName,
        last_name: values.lastName,
        phone: values.phone,
        address1: values.address1,
        address2: values.address2,
        state: values.state,
        city: values.city,
        addr_default: values.default,
        zip_code: values.zip_code,
        country_id: values.countryId!,
      });

      if (response.ok) {
        toast("Success", {
          description: data?.id
            ? "Shipping address has been updated."
            : "Shipping address is now created.",
        });

        router.refresh();
        setShow(false);
      }
    } catch (error: any) {
      toast("Error", {
        description: error.message,
      });
    }
  };

  const handleCountryChange = (name: string) => {
    const country = countries.find((c) => c.name === name);

    console.log("country = ", name);

    if (country) {
      form.setValue("countryId", country.id!);
    }
    setCountry(name);
  };

  console.log("form = ", form.watch().countryId);
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-4">
            <FormLabel>Contact information</FormLabel>
            <div className="flex items-center justify-between gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="First name*"
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
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Last name*"
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
              name="phone"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Phone*"
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
          <div className="space-y-2">
            <FormLabel>Address</FormLabel>
            <div>
              <FormField
                control={form.control}
                name="countryId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <CountrySelector
                        id={"countries"}
                        open={isOpen}
                        onToggle={() => setIsOpen((prev) => !prev)}
                        onChange={(value) => {
                          handleCountryChange(value);
                        }}
                        selectedValue={
                          (countries.find(
                            (c) => c.name === country,
                          ) as SelectMenuOption) || countries[0]
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-6 flex items-center justify-between gap-4">
              <FormField
                control={form.control}
                name="address1"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Street, house/apartment/unit*"
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
                name="address1"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Apt,suite, unit, etc (optional)"
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
            <div className="mt-6 flex items-center justify-between gap-4">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="State*"
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
                name="city"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="City*"
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
                name="zip_code"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Zip Code*"
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
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Loading..."
              : data?.id
                ? "Save address infomation"
                : "Create address"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddressDetails;

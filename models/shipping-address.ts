import { Country } from "./country-model";

export interface ShippingAddressModel {
  id?: string;
  first_name: string;
  last_name: string;
  phone: string;
  address1: string;
  address2?: string;
  state: string;
  city: string;
  zip_code: string;
  country_id: string;
  country?: Country;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  addr_default?: boolean;
}

export interface ShippingRate {
  id?: string;
  country_id?: string;
  store_id?: string;
  shipping_service?: string;
  shipping_fee_per_item?: number;
  shipping_fee_additional_item?: number;
  shipping_fee_per_kg?: number;
  shipping_fee_fixed?: number;
  delivery_time_min?: number;
  delivery_time_max?: number;
  return_policy?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CountryWithShippingRateModel {
  countryId?: string;
  countryName?: string;
  shippingRate: ShippingRate;
}

export interface FreeShippingModel {
  id?: string;
  product_id?: string;
  free_shipping_country?: FreeShippingCountry[];
  created_at?: string;
  updated_at?: string;
}

export interface FreeShippingCountry {
  id: string;
  country_id: string;
  free_shipping_id: string;
  created_at: string;
  updated_at: string;
}

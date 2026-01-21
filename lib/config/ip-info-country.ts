import { Country } from "@/models/country-model";
import countries from "@/data/countries.json";

// the helper function get the user country
const DEFAULT_COUNTRY: Country = {
  name: "United States",
  code: "US",
  city: "",
  region: "",
};

export async function getUserCountry(): Promise<Country> {
  let userCountry: Country = DEFAULT_COUNTRY;
  try {
    // attempt to detect country by IP
    const response = await fetch(
      `https://ipinfo.io/?token=${process.env.IPINFO_TOKEN}`
    );

    if (response.ok) {
      const data = await response.json();
      userCountry = {
        name:
          countries.find((c) => c.code === data.country)?.name || data.country,
        code: data.country,
        region: data.region,
        city: data.city,
      };
    }
  } catch (error) {
    throw error;
  }

  return userCountry;
}

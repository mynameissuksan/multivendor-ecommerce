import CartContainer from "@/components/store/cart-page/container";
import Header from "@/components/store/layout/header/header";
import { Country } from "@/models/country-model";
import { cookies } from "next/headers";

export default async function CartPage() {
  const cookieStore = cookies();
  const userCountryCookie = (await cookieStore).get("userCountry");

  // Set default country if cookie is missing
  let userCountry: Country = {
    name: "United States",
    city: "",
    code: "US",
    region: "",
  };

  // if cookie exists update the user country
  if (userCountryCookie) {
    userCountry = JSON.parse(userCountryCookie.value) as Country;
  }

  return (
    <div>
      <Header />
      <CartContainer userCountry={userCountry} />;
    </div>
  );
}

import { Country } from "@/models/country-model";
import { ShippingAddressModel } from "@/models/shipping-address";
import { Dispatch, SetStateAction, useEffect } from "react";
import ShippingAddressCard from "../../cards/address-card";

interface Props {
  address: ShippingAddressModel[];
  countries: Country[];
  selectedAddress: ShippingAddressModel | null;
  setSelectedAddress: Dispatch<SetStateAction<ShippingAddressModel | null>>;
}

const AddressList: React.FC<Props> = ({
  address,
  countries,
  selectedAddress,
  setSelectedAddress,
}) => {
  useEffect(() => {
    // Find the default address if it exists and set it as selected
    const defaultAddress = address.find((a) => a.addr_default);

    if (defaultAddress) {
      setSelectedAddress(defaultAddress);
    }
  }, [address, setSelectedAddress]);

  const handleAddressSelect = (address: ShippingAddressModel) => {
    setSelectedAddress(address);
  };
  return (
    <div className="space-y-5 max-h-80 overflow-auto">
      {address.map((addr, i) => (
        <ShippingAddressCard
          key={i}
          address={addr}
          countries={countries}
          isSelected={selectedAddress?.id === addr.id}
          onSelect={() => handleAddressSelect(addr)}
        />
      ))}
    </div>
  );
};

export default AddressList;

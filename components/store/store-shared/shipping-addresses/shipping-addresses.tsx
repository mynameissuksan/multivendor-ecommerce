import { Country } from "@/models/country-model";
import { ShippingAddressModel } from "@/models/shipping-address";
import { Plus } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  countries: Country[];
  addresses: ShippingAddressModel[];
  selectedAddress: ShippingAddressModel | null;
  setSelectedAddress: Dispatch<SetStateAction<ShippingAddressModel | null>>;
}

import React from "react";
import Modal from "../modal";
import AddressDetails from "./address-details";
import AddressList from "./address-list";

const UserShippingAddresses: React.FC<Props> = ({
  countries,
  addresses,
  selectedAddress,
  setSelectedAddress,
}) => {
  const [show, setShow] = useState<boolean>(false);
  return (
    <div className="w-full py-4 px-6 bg-white">
      <div className="relative flex flex-col text-sm">
        <h1 className="text-lg mb-3 font-bold">Shipping Addresses </h1>
        {addresses && addresses.length > 0 && (
          // AddressList
          <AddressList
            countries={countries}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            address={addresses}
          />
        )}
        <div
          onClick={() => setShow(true)}
          className="mt-4 ml-8 text-orange-600 cursor-pointer"
        >
          <Plus className="inline-block mr-1 w-3" />
          <span className="text-sm">Add new address</span>
        </div>
        {/* Modal */}
        <div>
          <Modal title="Add new Address" show={show} setShow={setShow}>
            {/* Address details */}
            <AddressDetails countries={countries} setShow={setShow} />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default UserShippingAddresses;

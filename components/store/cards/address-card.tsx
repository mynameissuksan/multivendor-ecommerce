/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import { Country } from "@/models/country-model";
import { ShippingAddressModel } from "@/models/shipping-address";
import { Check } from "lucide-react";
import { useState } from "react";
import Modal from "../store-shared/modal";
import AddressDetails from "../store-shared/shipping-addresses/address-details";
import { toast } from "sonner";
import { upsertShippingAddresss } from "@/queries/user";
import { useRouter } from "next/navigation";

interface Props {
  address: ShippingAddressModel;
  isSelected: boolean;
  onSelect: () => void;
  countries: Country[];
}

const ShippingAddressCard: React.FC<Props> = ({
  address,
  isSelected,
  onSelect,
  countries,
}) => {
  const router = useRouter();
  const [show, setShow] = useState<boolean>(false);

  const handleMakeDefault = async () => {
    try {
      const res = await upsertShippingAddresss({
        ...address,
        addr_default: true,
      });
      if (res.ok) {
        toast.success("New Default Address saved.");
        router.refresh();
      }
    } catch (error: any) {
      toast.error("Something went wrong!", error);
    }
  };
  return (
    <div className="w-full relative flex self-start group">
      {/* Checkbox */}
      <label
        onClick={onSelect}
        htmlFor={address.id}
        className="p-0 text-gray-900 text-sm leading-6 inline-flex items-center mr-3 cursor-pointer"
      >
        <span className="leading-8 inline-flex p-0.5 cursor-pointer">
          <span
            className={cn(
              "leading-8 inline-block w-5 h-5 rounded-full bg-white border border-gray-300",
              {
                "bg-orange-600 border-none flex items-center justify-center":
                  isSelected,
              },
            )}
          >
            {isSelected && <Check className="stroke-white w-3" />}
          </span>
        </span>
        <input type="checkbox" hidden id={address.id} />
      </label>
      {/* Address */}
      <div className="w-full border-t pt-2">
        {/* Full name - phone number */}
        <div className="flex max-w-82 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="mr-4 text-sm text-black font-semibold capitalize">
            {address.first_name} {address.last_name}
          </span>
          <span>{address.phone}</span>
        </div>
        {/* Address1 - Address2 */}
        <div className="flex max-w-[90%] text-gray-600 overflow-hidden leading-4  text-ellipsis whitespace-nowrap">
          {address.address1} {address.address2 && `, ${address.address2}`}
        </div>
        {/* State - city - country - zip code */}
        <div className="flex max-w-[90%] text-gray-600 overflow-hidden leading-4  text-ellipsis whitespace-nowrap">
          {address.state}, {address.city}, {address.country?.name}, &nbsp;
          {address.zip_code}
        </div>

        {/* Save as default - Edit */}

        <div className="absolute right-0 top-1/2 flex items-center gap-x-2">
          <div
            onClick={() => setShow(true)}
            className="cursor-pointer hidden group-hover:block"
          >
            <span className="text-xs text-[#27f]">Edit</span>
          </div>
          {isSelected && !address.addr_default && (
            <div onClick={() => handleMakeDefault()} className="cursor-pointer">
              <span className="text-xs text-[#27f]">Save as default</span>
            </div>
          )}
        </div>
        {show && (
          <Modal title="Edit Shipping Address" show={show} setShow={setShow}>
            <AddressDetails
              countries={countries}
              data={address}
              setShow={setShow}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ShippingAddressCard;

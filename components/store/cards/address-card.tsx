import { cn } from "@/lib/utils";
import { Country } from "@/models/country-model";
import { ShippingAddressModel } from "@/models/shipping-address";
import { Check } from "lucide-react";

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
    </div>
  );
};

export default ShippingAddressCard;

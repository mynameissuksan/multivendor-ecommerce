interface Props {
  method: string;
  fee: number;
  extraFee: number;
  weight: number;
  quantity: number;
}

import { Check } from "lucide-react";
import React from "react";

const ProductShippingFee: React.FC<Props> = ({
  method,
  fee,
  extraFee,
  weight,
  quantity,
}) => {
  switch (method) {
    case "ITEM":
      return (
        <div className="w-full pb-1">
          {/* Note */}
          <div className="w-full">
            <span className="text-xs flex gap-x1">
              <Check className="min-w-3 max-w-3 stroke-green-400" />
              <span className="mt-1">
                This store caculates the delivery fee based on the number of
                items in the order.
              </span>
            </span>
            {fee !== extraFee && (
              <span className="text-xs flex gap-x1">
                <Check className="min-w-3 max-w-3 stroke-green-400" />
                <span className="mt-1">
                  If you purchase multiple items, you&apos;ll receive a
                  discounted deliver fee.
                </span>
              </span>
            )}
          </div>
          <table className="w-full mt-1.5">
            <thead className="w-full">
              {fee === extraFee || extraFee === 0 ? (
                <tr
                  className="grid gap-x-1 text-xs px-4"
                  style={{ gridTemplateColumns: "4fr 1fr" }}
                >
                  <td className="w-full bg-gray-50 px-2 py-0.5 rounded-sm">
                    Fee per item
                  </td>
                  <td className="w-full min-w-10 bg-gray-50 px-2 py-0.5 rounded-sm">
                    ฿{fee}
                  </td>
                </tr>
              ) : (
                <>
                  <tr
                    className="grid gap-x-1 text-xs px-4"
                    style={{ gridTemplateColumns: "4fr 1fr" }}
                  >
                    <td className="w-full bg-gray-50 px-2 py-0.5 rounded-sm">
                      Fee for First Item
                    </td>
                    <td className="w-full min-w-10 bg-gray-50 px-2 py-0.5 rounded-sm">
                      ฿{fee}
                    </td>
                  </tr>
                  <tr
                    className="grid gap-x-1 text-xs px-4"
                    style={{ gridTemplateColumns: "4fr 1fr" }}
                  >
                    <td className="w-full bg-gray-50 px-2 py-0.5 rounded-sm">
                      Fee for Each Addtional Item
                    </td>
                    <td className="w-full min-w-10 bg-gray-50 px-2 py-0.5 rounded-sm">
                      ฿{extraFee}
                    </td>
                  </tr>
                </>
              )}
            </thead>

            <tbody>
              <tr
                className="grid gap-x-1 text-xs px-4 mt-1"
                style={{ gridTemplateColumns: "4fr 1fr" }}
              >
                <td className="w-full bg-gray-50 px-2 py-0.5">Quantity</td>
                <td className="w-full bg-gray-50 px-2 py-0.5">x{quantity}</td>
              </tr>
              <tr className="flex gap-x-1 text-xs px-4 mt-1 text-center  font-semibold">
                <td className="w-full bg-black text-white px-1 py-1">
                  {quantity === 1 || fee === extraFee ? (
                    <span>
                      ฿{fee} (fee) x {quantity} (items) = ฿
                      {Number(fee) * quantity}
                    </span>
                  ) : (
                    <span>
                      ฿{fee} (first item) + {quantity - 1} (addtional items) x ฿
                      {extraFee} = ฿
                      {Number(fee) + Number(extraFee) * (quantity - 1)}
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );

      break;
    case "WEIGHT":
      return (
        <div className="w-full pb-1">
          {/* Note */}
          <div className="w-full">
            <span className="text-xs flex gap-x1">
              <Check className="min-w-3 max-w-3 stroke-green-400" />
              <span className="mt-1">
                This store caculates the delivery fee based on the number of
                items in the order.
              </span>
            </span>
          </div>
          <table className="w-full mt-1.5">
            <thead className="w-full">
              <tr
                className="grid gap-x-1 text-xs px-4"
                style={{ gridTemplateColumns: "4fr 1fr" }}
              >
                <td className="w-full bg-gray-50 px-2 py-0.5 rounded-sm">
                  Fee per kg (1kg = 2,2051lbs)
                </td>
                <td className="w-full min-w-10 bg-gray-50 px-2 py-0.5 rounded-sm">
                  ฿{fee}
                </td>
              </tr>
            </thead>

            <tbody>
              <tr
                className="grid gap-x-1 text-xs px-4 mt-1"
                style={{ gridTemplateColumns: "4fr 1fr" }}
              >
                <td className="w-full bg-gray-50 px-2 py-0.5">Quantity</td>
                <td className="w-full bg-gray-50 px-2 py-0.5">x{quantity}</td>
              </tr>
              <tr className="flex gap-x-1 text-xs px-4 mt-1 text-center  font-semibold">
                <td className="w-full bg-black text-white px-1 py-1">
                  <span>
                    ฿{fee} (fee) x {Number(weight)}kg (weight) x {quantity}{" "}
                    (items) = ฿{Number(fee) * Number(weight) * quantity}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
      break;
    case "FIXED":
      return (
        <div className="w-full pb-1">
          {/* Note */}
          <div className="w-full">
            <span className="text-xs flex gap-x1">
              <Check className="min-w-3 max-w-3 stroke-green-400" />
              <span className="mt-1">
                This store calculates the delivery fee on a fixed price.
              </span>
            </span>
          </div>
          <table className="w-full mt-1.5">
            <thead className="w-full">
              <tr
                className="grid gap-x-1 text-xs px-4"
                style={{ gridTemplateColumns: "4fr 1fr" }}
              >
                <td className="w-full bg-gray-50 px-2 py-0.5 rounded-sm">
                  Fee
                </td>
                <td className="w-full min-w-10 bg-gray-50 px-2 py-0.5 rounded-sm">
                  ฿{fee}
                </td>
              </tr>
            </thead>

            <tbody>
              <tr
                className="grid gap-x-1 text-xs px-4 mt-1"
                style={{ gridTemplateColumns: "4fr 1fr" }}
              >
                <td className="w-full bg-gray-50 px-2 py-0.5">Quantity</td>
                <td className="w-full bg-gray-50 px-2 py-0.5">x{quantity}</td>
              </tr>
              <tr className="flex gap-x-1 text-xs px-4 mt-1 text-center  font-semibold">
                <td className="w-full bg-black text-white px-1 py-1">
                  <span>
                    ฿{fee} (quantity doesn&apos;t affect shipping fee.)
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
      break;

    default:
      break;
  }

  return <div></div>;
};

export default ProductShippingFee;

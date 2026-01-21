"use client";

// React, Next.js imports
import { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

// Custom components
import CustomModal from "@/components/dashboard/shared/custom-modal";

// UI components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Hooks and utilities
import { useModal } from "@/providers/modal-provider";

// Lucide icons
import {
  BadgeCheck,
  BadgeMinus,
  Edit,
  MoreHorizontal,
  Trash,
} from "lucide-react";

// Tanstack React Table
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { CountryWithShippingRateModel } from "@/models/shipping-model";
import ShippingRateDetails from "@/components/dashboard/forms/shipping-rate-details";

export const columns: ColumnDef<CountryWithShippingRateModel>[] = [
  {
    accessorKey: "countryName",
    header: "Country",
    cell: ({ row }) => {
      return (
        <span className="font-extrabold text-lg capitalize">
          {row.original.countryName}
        </span>
      );
    },
  },
  {
    accessorKey: "shippingService",
    header: "Shipping Service",
    cell: ({ row }) => {
      return (
        <span className="font-extrabold text-lg capitalize">
          {row.original.shippingRate?.shipping_service || "Default"}
        </span>
      );
    },
  },
  {
    accessorKey: "shippingFeePerItem",
    header: "Shipping Fee per item",
    cell: ({ row }) => {
      const value = row.original.shippingRate?.shipping_fee_per_item;
      return (
        <span className="font-extrabold text-lg capitalize">
          {value ? (value > 0 ? value : "Free") : "Default"}
        </span>
      );
    },
  },
  {
    accessorKey: "shippingFeeForAddionalItem",
    header: "Shipping Fee for addional item",
    cell: ({ row }) => {
      return (
        <span className="font-extrabold text-lg capitalize">
          {row.original.shippingRate?.shipping_fee_additional_item || "Default"}
        </span>
      );
    },
  },

  {
    accessorKey: "shippingFeePerKg",
    header: "Shipping Fee per kg",
    cell: ({ row }) => {
      const value = row.original.shippingRate?.shipping_fee_per_kg;
      return (
        <span className="font-extrabold text-lg capitalize">
          {value ? (value > 0 ? value : "Free") : "Default"}
        </span>
      );
    },
  },

  {
    accessorKey: "shippingFeeFixed",
    header: "Shipping Fee fixed",
    cell: ({ row }) => {
      const value = row.original.shippingRate?.shipping_fee_fixed;

      return (
        <span className="font-extrabold text-lg capitalize">
          {value ? (value > 0 ? value : "Free") : "Default"}
        </span>
      );
    },
  },

  {
    accessorKey: "deliveryTimeMin",
    header: "Shipping min days",
    cell: ({ row }) => {
      return (
        <span className="font-extrabold text-lg capitalize">
          {row.original.shippingRate?.delivery_time_min || "Default"}
        </span>
      );
    },
  },

  {
    accessorKey: "deliveryTimeMax",
    header: "Shipping max days",
    cell: ({ row }) => {
      return (
        <span className="font-extrabold text-lg capitalize">
          {row.original.shippingRate?.delivery_time_max || "Default"}
        </span>
      );
    },
  },

  {
    accessorKey: "returnPolicy",
    header: "return policy",
    cell: ({ row }) => {
      return (
        <span className="font-extrabold text-lg capitalize">
          {row.original.shippingRate?.return_policy || "Default"}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;

      return <CellActions rowData={rowData} />;
    },
  },
];

// Define props interface for CellActions component
interface CellActionsProps {
  rowData: CountryWithShippingRateModel;
}

// CellActions component definition
const CellActions: React.FC<CellActionsProps> = ({ rowData }) => {
  // Hooks
  const { setOpen, setClose } = useModal();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams<{ storeUrl: string }>();

  // Return null if rowData or rowData.id don't exist
  if (!rowData || !rowData.countryId) return null;

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => {
              setOpen(
                // Custom modal component
                <CustomModal>
                  {/*  details component */}
                  <ShippingRateDetails
                    data={rowData}
                    storeUrl={params.storeUrl}
                  />
                </CustomModal>,
                async () => {
                  return {};
                }
              );
            }}
          >
            <Edit size={15} />
            Edit Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="flex gap-2" onClick={() => {}}>
              <Trash size={15} /> Delete category
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            This action cannot be undone. This will permanently delete the
            category and related data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-destructive hover:bg-destructive mb-2 text-white"
            onClick={async () => {
              setLoading(true);
              // await deleteCategory(rowData.id);
              toast("Deleted ", {
                description: "The category has been deleted.",
              });

              setLoading(false);
              router.refresh();
              setClose();
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

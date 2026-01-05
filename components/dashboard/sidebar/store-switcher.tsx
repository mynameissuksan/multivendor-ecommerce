"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  StoreIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  stores: Record<string, string>[];
}

const StoreSwitcher: React.FC<StoreSwitcherProps> = ({ stores, className }) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const params = useParams();

  // format stores data
  const formattedItems = stores.map((store) => ({
    label: store.name,
    value: store.url,
  }));

  // get the active store
  const activeStore = formattedItems.find(
    (stores) => stores.value === params.storeUrl
  );

  const onStoreSelect = (store: { label: string; value: string }) => {
    setOpen(false);
    router.push(`/dashboard/seller/stores/${store.value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className={cn("w-62.5 justify-between", className)}
        >
          <StoreIcon className="mr-2 w-4 h-4" />
          {activeStore?.label}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-62.5 p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search stores..." />
            <CommandEmpty>No Store Selected.</CommandEmpty>
            <CommandGroup heading="Stores">
              {formattedItems.map((store, index) => (
                <CommandItem
                  className="text-sm cursor-pointer"
                  key={index}
                  onSelect={() => onStoreSelect(store)}
                >
                  <StoreIcon className="mr-2 w-4 h-4" /> {store.label}
                  <Check
                    className={cn("ml-auto h-4 w-4 opacity-0", {
                      "opacity-100": activeStore?.value === store.value,
                    })}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandItem
              className="cursor-pointer"
              onSelect={() => {
                setOpen(false);
                router.push(`/dashboard/seller/stores/new`);
              }}
            >
              <PlusCircle className="mr-2 w-5 h-5" /> Create Store
            </CommandItem>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StoreSwitcher;

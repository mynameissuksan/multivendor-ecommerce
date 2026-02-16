import React, { ReactNode } from "react";
import { FormLabel } from "../ui/form";
import { Dot } from "lucide-react";

const InputFieldSet = ({
  label,
  children,
  description,
}: {
  label: string;
  description?: string;
  children: ReactNode;
}) => {
  return (
    <div>
      <fieldset className="border rounded-md p-4">
        <legend className="px-2">
          <FormLabel>{label}</FormLabel>
        </legend>
        {description && (
          <p className="text-sm text-gray-400 pb-3 flex">
            <Dot className="-me-1" />
            {description}
          </p>
        )}
        {children}
      </fieldset>
    </div>
  );
};

export default InputFieldSet;

/* eslint-disable react-hooks/static-components */
"use client";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PaintBucket } from "lucide-react";
import React, { Dispatch, SetStateAction, useState } from "react";
import { SketchPicker } from "react-color";

// define the interface for each detail object
export interface Detail<T = { [key: string]: string | number | undefined }> {
  [key: string]: T[keyof T];
}

// define props for the click to add inputs components
interface ClickToAddInputsProps<T extends Detail> {
  details: T[]; // Array of details objects
  setDetails: Dispatch<SetStateAction<T[]>>; // Setter function for details
  initialDetail?: T; // Optional inital detail object
  header?: string;
  colorPicker?: boolean;
}

// ClickToAddInputs components definition

const ClickToAddInputs = <T extends Detail>({
  details,
  setDetails,
  initialDetail = {} as T, // default value for initial detail is an empty object
  header,
  colorPicker,
}: ClickToAddInputsProps<T>) => {
  // State to manage toggling color picker
  const [colorPickerIndex, setColorPickerIndex] = useState<number | null>(null);

  // Function to handle changes in detail properties
  const handleDetailsChanage = (
    index: number,
    property: string,
    value: string | number,
  ) => {
    // update the details array with the new property value
    const updatedDetails = details.map((detail, i) =>
      i === index ? { ...detail, [property]: value } : detail,
    );

    setDetails(updatedDetails); // update the state with the modified details
  };

  // Function to handle removal of the detail
  const handleRemoveDetail = (index: number) => {
    if (details.length === 1) return;
    //Filter out the details at the spcified index
    const updatedDetails = details.filter((_, i) => i !== index);
    setDetails(updatedDetails);
  };

  // Function to add new detail
  const handleAddDetail = () => {
    // Add a new detail object to the detail array
    setDetails([...details, { ...initialDetail }]);
  };

  // PlusButton component for adding new details
  const PlusButton = ({ onClick }: { onClick: () => void }) => {
    return (
      <button
        type="button"
        title="Add new detail"
        className="group cursor-pointer outline-none hover:rotate-90 duration-300"
        onClick={onClick}
      >
        {/* Plus icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50px"
          height="50px"
          viewBox="0 0 24 24"
          className="w-8 h-8 stroke-blue-400 fill-none group-hover:fill-blue-primary group-active:stroke-blue-200 group-active:fill-blue-700 group-active:duration-0 duration-300"
        >
          <path
            d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
            strokeWidth="1.5"
          />
          <path d="M8 12H16" strokeWidth="1.5" />
          <path d="M12 16V8" strokeWidth="1.5" />
        </svg>
      </button>
    );
  };

  // MinusButton component for removing details
  const MinusButton = ({ onClick }: { onClick: () => void }) => {
    return (
      <button
        type="button"
        title="Remove detail"
        className="group cursor-pointer outline-none hover:rotate-90 duration-300"
        onClick={onClick}
      >
        {/* Minus icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50px"
          height="50px"
          viewBox="0 0 24 24"
          className="w-8 h-8 stroke-blue-400 fill-none group-hover:fill-white group-active:stroke-blue-200 group-active:fill-blue-700 group-active:duration-0 duration-300"
        >
          <path
            d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
            strokeWidth="1.5"
          />
          <path d="M8 12H16" strokeWidth="1.5" />
        </svg>
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-y-4">
      {/* Header */}
      {header && <div>{header}</div>}

      {/* Display PlusButton if no details exist */}
      {/* {details.length === 0 && <PlusButton onClick={() => {}} />} */}
      {/* Map through details and render input fields */}
      {details?.map((detail, index) => (
        <div key={index} className="flex items-center gap-x-4">
          {Object.keys(detail).map((property, propIndex) => (
            <div key={propIndex} className="flex items-center gap-x-4">
              {/* Color picker toggle */}
              {property === "color" && colorPicker && (
                <div className="flex gap-x-4">
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={() =>
                      setColorPickerIndex(
                        colorPickerIndex === index ? null : index,
                      )
                    }
                  >
                    <PaintBucket />
                  </button>
                  <span
                    style={{ backgroundColor: detail[property] as string }}
                    className={cn("w-8 h-8 rounded-full")}
                  ></span>
                </div>
              )}
              {/* Color picker */}
              {colorPickerIndex === index && property === "color" && (
                <SketchPicker
                  color={detail[property] as string}
                  onChange={(color) =>
                    handleDetailsChanage(index, property, color.hex)
                  }
                />
              )}

              {/* Input field for each property */}
              <Input
                className="w-28"
                type={typeof detail[property] === "number" ? "number" : "text"}
                name={property}
                placeholder={property}
                step="0.01"
                value={detail[property] as string}
                min={typeof detail[property] === "number" ? 0 : undefined}
                onChange={(e) =>
                  handleDetailsChanage(
                    index,
                    property,
                    e.target.type === "number"
                      ? parseFloat(e.target.value)
                      : e.target.value,
                  )
                }
              />
            </div>
          ))}
          {/* show buttons for each row of inputs  */}
          <MinusButton onClick={() => handleRemoveDetail(index)} />
          <PlusButton onClick={handleAddDetail} />
        </div>
      ))}
    </div>
  );
};

export default ClickToAddInputs;

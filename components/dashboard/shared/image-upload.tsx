/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Trash, Upload, X, Check } from "lucide-react";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
  type: "standard" | "profile" | "cover";
  dontShowPreview?: boolean;
}

interface PendingImage {
  file: File;
  preview: string;
  id: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
  type,
  dontShowPreview,
}) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      pendingImages.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [pendingImages]);

  if (!isMounted) return null;

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!uploadPreset || !cloudName) {
    console.error("Cloudinary configuration is missing");
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 font-medium">
          ⚠️ Error: Cloudinary not configured
        </p>
      </div>
    );
  }

  // Handle file selection from input
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPendingImages: PendingImage[] = [];

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const preview = URL.createObjectURL(file);
        newPendingImages.push({
          file,
          preview,
          id: Math.random().toString(36),
        });
      }
    });

    setPendingImages((prev) => [...prev, ...newPendingImages]);
    // e.target.value = "";
  };

  // Remove pending image
  const removePendingImage = (id: string) => {
    setPendingImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) {
        URL.revokeObjectURL(img.preview);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  // Upload pending images to Cloudinary
  const uploadPendingImages = async () => {
    if (pendingImages.length === 0) return;

    setIsUploading(true);

    for (const pending of pendingImages) {
      try {
        const formData = new FormData();
        formData.append("file", pending.file);
        formData.append("upload_preset", uploadPreset);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        if (data.secure_url) {
          onChange(data.secure_url);
        }
      } catch (error) {
        console.error("Upload error:", error);
      }
    }

    // Clear pending images
    pendingImages.forEach((img) => URL.revokeObjectURL(img.preview));
    setPendingImages([]);
    setIsUploading(false);
  };

  // Cloudinary widget callback (fallback)
  const onUpload = (result: any) => {
    if (result?.info?.secure_url) {
      onChange(result.info.secure_url);
    }
  };

  const onError = (error: any) => {
    console.error("Upload error:", error);
  };

  if (type === "profile") {
    return (
      <div className="relative rounded-full w-52 h-52 bg-gray-200 border-2 border-white shadow-2xl">
        {value.length > 0 && (
          <Image
            src={value[0]}
            alt=""
            width={300}
            height={300}
            className="w-52 h-52 rounded-full object-cover absolute left-0 top-0 right-0 bottom-0"
          />
        )}
        <CldUploadWidget
          uploadPreset={uploadPreset}
          onSuccess={onUpload}
          onError={onError}
          options={{
            maxFiles: 1,
            resourceType: "image",
            clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
            maxFileSize: 10485760,
          }}
        >
          {({ open }) => (
            <button
              type="button"
              className="z-20 absolute right-0 bottom-6 flex items-center font-medium text-[17px] h-14 w-14 justify-center text-white bg-gradient-to-t from-blue-500 to-blue-600 border-none shadow-lg rounded-full hover:shadow-md active:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={disabled}
              onClick={() => open()}
            >
              <svg
                viewBox="0 0 640 512"
                fill="white"
                height="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
              </svg>
            </button>
          )}
        </CldUploadWidget>
      </div>
    );
  }

  if (type === "cover") {
    return (
      <div
        style={{ height: "348px" }}
        className="relative w-full bg-gray-100 rounded-lg overflow-hidden"
      >
        {value.length > 0 && (
          <Image
            src={value[0]}
            alt=""
            width={1200}
            height={1200}
            className="w-full h-full rounded-lg object-cover"
          />
        )}
        <CldUploadWidget
          uploadPreset={uploadPreset}
          onSuccess={onUpload}
          onError={onError}
          options={{
            maxFiles: 1,
            resourceType: "image",
            clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
            maxFileSize: 10485760,
          }}
        >
          {({ open }) => (
            <button
              type="button"
              className="z-20 absolute mx-3 right-0 bottom-6 flex items-center font-medium text-[17px] h-13 px-6 py-3 justify-center text-white bg-gradient-to-t from-blue-500 to-blue-600 border-none shadow-lg rounded-full hover:shadow-md active:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={disabled}
              onClick={() => open()}
            >
              <svg
                viewBox="0 0 640 512"
                fill="white"
                height="1em"
                className="mr-2"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
              </svg>
              <span>
                {value.length > 0 ? "Change cover" : "Upload a cover"}
              </span>
            </button>
          )}
        </CldUploadWidget>
      </div>
    );
  }

  // Standard type with preview before upload
  return (
    <div className="space-y-4">
      {/* Pending Images Preview */}
      {pendingImages.length > 0 && (
        <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-blue-900">
              Selected Images ({pendingImages.length})
            </h3>
            <Button
              type="button"
              size="sm"
              onClick={uploadPendingImages}
              disabled={isUploading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isUploading ? (
                <>
                  <Upload className="w-4 h-4 mr-2 animate-pulse" />
                  Uploading...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2 " />
                  Confirm Upload
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {pendingImages.map((pending) => (
              <div
                key={pending.id}
                className="relative aspect-square rounded-lg overflow-hidden bg-white border-2 border-blue-300 group"
              >
                <Image
                  src={pending.preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePendingImage(pending.id)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isUploading}
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-white text-xs truncate">
                    {pending.file.name}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-blue-700 mt-3">
            Click Confirm Upload to upload these images to cloud
          </p>
        </div>
      )}

      {/* Native File Input */}
      <div>
        <input
          type="file"
          id="file-upload"
          multiple
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
          className="hidden"
        />
        <label htmlFor="file-upload">
          <div className="cursor-pointer w-full mt-5 px-6 py-4 flex items-center justify-center gap-3 font-medium text-white bg-gradient-to-t from-blue-500 to-blue-600 border-none shadow-lg rounded-full hover:shadow-md active:shadow-sm disabled:opacity-50 transition-all">
            <Upload size={20} />
            <span>
              {value.length > 0
                ? `Upload More Images (${value.length} uploaded)`
                : "Select Images"}
            </span>
          </div>
        </label>
      </div>
    </div>
  );
};

export default ImageUpload;

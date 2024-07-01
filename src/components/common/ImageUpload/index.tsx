import * as React from "react";
import { theme } from "./theme";
import { cn } from "@/lib/utils";
import { BaseSize } from "@/interfaces/common";
import { ChangeEvent, useState } from "react";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

export interface ImageUploadProps {
  value?: string[];
  text?: string;
  onChange?: (value: string[]) => void;
  className?: string;
  disabled?: boolean;
}

const ImageUpload = (props: ImageUploadProps) => {
  const {
    text = "Upload",
    value,
    onChange,
    className,
    disabled,
  } = props;
  const allClass = cn(theme.base, className);

  const [imagePreview, setImagePreview] = useState<string[] | undefined>(
    value || []
  );

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updateList = [reader.result as string, ...(imagePreview || [])];
        setImagePreview(updateList);
        onChange?.(updateList);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteImage = (index: number) => {
    if (imagePreview) {
      const updateList = [...imagePreview];
      updateList.splice(index, 1);
      setImagePreview(updateList);
      onChange?.(updateList);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div className={cn("border-dotted", allClass)}>
        <div className="text-center text-sm items-center">
          <PlusIcon className="mx-auto" height={20} width={20} />
          {text && <div className="mt-1">{text}</div>}
        </div>
        <input
          disabled={disabled}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="absolute w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      {imagePreview &&
        imagePreview.length > 0 &&
        imagePreview.map((item, idx) =>
          item ? (
            <div key={idx} className={cn(allClass, "group/item  relative")}>
              <Button
                type="button"
                onClick={() => deleteImage(idx)}
                variant="ghost"
                className="hidden group-hover/item:flex w-8 h-8 p-0 absolute top-1 right-1 z-10 rounded-full"
              >
                <TrashIcon height={20} width={20} />
              </Button>
              <img
                src={item}
                alt="Uploaded preview"
                className="object-contain"
              />
            </div>
          ) : (
            ""
          )
        )}
    </div>
  );
};

export default ImageUpload;

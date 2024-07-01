import * as React from "react";
import { theme } from "./theme";
import { cn } from "@/lib/utils";
import { BaseSize } from "@/interfaces/common";
import { ChangeEvent, useState } from "react";
import { PlusIcon } from "@radix-ui/react-icons";

export interface ImageUploadProps {
  value?: string[];
  text?: string;
  onChange?: (value: string[]) => void;
  className?: string;
  size?: BaseSize;
  required?: boolean;
  disabled?: boolean;
}

const ImageUpload = (props: ImageUploadProps) => {
  const {
    text = 'Upload',
    value,
    onChange,
    className,
    required,
    size = "md",
    disabled,
  } = props;
  const allClass = cn(theme.base, theme.size[size], className);

  const [imagePreview, setImagePreview] = useState<string[] | undefined>(value || []);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updateList = [reader.result as string, ...(imagePreview || [])]
        setImagePreview(updateList);
        onChange?.(updateList)
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="sm:flex gap-4">
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
      {imagePreview && imagePreview.length > 0 && (
        imagePreview.map((item, idx) => item ? <div key={idx} className={allClass}>
        <img
          src={item}
          alt="Uploaded preview"
          className="object-contain"
        />
      </div> :'')
      )}
    </div>
  );
};

export default ImageUpload;

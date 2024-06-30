import ImageUpload from "@/components/common/ImageUpload";
import BaseSelect from "@/components/common/Select";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToolLanguage } from "@/interfaces/api";
import { cn } from "@/lib/utils";
import { useState } from "react";

type ToolLanguageInputProps = {
  value: ToolLanguage;
  onChange?: (value: ToolLanguage) => void;
  className?: string;
  errorMessage?: React.ReactNode;
};

export default function ToolLanguageInput(props: ToolLanguageInputProps) {
  const { value, onChange, className, errorMessage } = props;
  const [formState, setFormState] = useState<ToolLanguage>(value);

  // Handle input change
  const handleInputChange = (name: string, value: string | number | {data: string}[]) => {
    const updatedValue = {
      ...formState,
      [name]: value,
    };

    console.log(`updatedValue`, updatedValue, value);
    setFormState(updatedValue);
    onChange?.(updatedValue);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <div className="sm:flex gap-x-4">
          <div className="w-full sm:w-1/2">
            <BaseSelect
              placeholder="Select Tool/Language"
              options={[{ label: "aaaa", value: "5" }]}
              onChange={(value) =>
                handleInputChange("toolLanguageResourceId", parseInt(value))
              }
            />
          </div>
          <div className="flex gap-x-4 mt-4 sm:mt-0 sm:w-1/2">
            <BaseSelect
              placeholder="From"
              options={[{ label: "aaaa", value: "5" }]}
              onChange={(value) => handleInputChange("from", parseInt(value))}
            />
            <BaseSelect
              placeholder="To"
              options={[{ label: "aaaa", value: "5" }]}
              onChange={(value) => handleInputChange("to", parseInt(value))}
            />
          </div>
        </div>
        {errorMessage && errorMessage}
      </div>

      <div>
        <Textarea
          placeholder="Description"
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
      </div>
      <div>
        <ImageUpload onChange={(value) => {
          console.log(`iamge`, value)
          const imageData = value.map((item) => ({data: item}))

          console.log(`imageData`, imageData)
          handleInputChange("images", imageData)
        }} />
      </div>
    </div>
  );
}

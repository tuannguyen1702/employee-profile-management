import ImageUpload from "@/components/common/ImageUpload";
import BaseSelect from "@/components/common/Select";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToolLanguage } from "@/interfaces/api";
import { SelectOptions } from "@/interfaces/common";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

type ToolLanguageInputProps = {
  toolLanguageData: SelectOptions[];
  value: ToolLanguage;
  onChange?: (value: ToolLanguage) => void;
  className?: string;
  errorMessage?: React.ReactNode;
};

export default function ToolLanguageInput(props: ToolLanguageInputProps) {
  const { toolLanguageData, value, onChange, className, errorMessage } = props;
  const [formState, setFormState] = useState<ToolLanguage>(value);
  const [selectedFrom, setSelectedFrom] = useState<number>(0);

  const thisYear = new Date().getFullYear();

  const listYearFrom = useMemo(() => {
    return Array.from({ length: 30 }, (_, index) => thisYear - index).map(
      (item) => ({ label: `${item}`, value: `${item}` })
    );
  }, [thisYear]);

  const listYearTo = useMemo(() => {
    return Array.from({ length: selectedFrom? (thisYear - selectedFrom + 1) : 30 }, (_, index) => thisYear - index).map(
      (item) => ({ label: `${item}`, value: `${item}` })
    );
  }, [thisYear, selectedFrom]);

  // Handle input change
  const handleInputChange = (
    name: string,
    value: string | number | { data: string }[]
  ) => {
    const updatedValue = {
      ...formState,
      [name]: value,
    };

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
              options={toolLanguageData}
              onChange={(value) =>
                handleInputChange("toolLanguageResourceId", parseInt(value))
              }
            />
          </div>
          <div className="flex gap-x-4 mt-4 sm:mt-0 sm:w-1/2">
            <BaseSelect
              placeholder="From"
              options={listYearFrom}
              onChange={(value) => {
                handleInputChange("from", parseInt(value));
                setSelectedFrom(parseInt(value));
              }}
            />
            <BaseSelect
              placeholder="To"
              options={listYearTo}
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
        <ImageUpload
          onChange={(value) => {
            const imageData = value.map((item) => ({ data: item }));
            handleInputChange("images", imageData);
          }}
        />
      </div>
    </div>
  );
}

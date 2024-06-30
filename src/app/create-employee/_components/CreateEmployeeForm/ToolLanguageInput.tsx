import { Input } from "@/components/ui/input";
import { ToolLanguageFromTo } from "@/interfaces";
import { cn } from "@/lib/utils";
import { useState } from "react";

type ToolLanguageInputProps = {
  value: ToolLanguageFromTo;
  onChange?: (value: ToolLanguageFromTo) => void;
  className?: string;
};

export default function ToolLanguageInput(props: ToolLanguageInputProps) {
  const { value, onChange, className } = props;
  const [formState, setFormState] = useState<ToolLanguageFromTo>(value);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    const updatedValue = {
      ...formState,
      [name]: parseInt(value)
    };
    setFormState(updatedValue);
    onChange?.(updatedValue);
  };
  return (
    <div className={cn("flex gap-x-4", className)}>
      <Input name="toolLanguageResourceId" value={value.toolLanguageResourceId} onChange={handleInputChange}/>
      <Input name="from" value={value.from} onChange={handleInputChange}/>
      <Input name="to"  value={value.to} onChange={handleInputChange}/>
    </div>
  );
}

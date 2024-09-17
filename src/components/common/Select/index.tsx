import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { theme } from "./theme";
import { cn } from "@/lib/utils";
import * as SelectPrimitive from "@radix-ui/react-select";
import { BaseSize, SelectOptions } from "@/interfaces/common";

export interface SelectProps {
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  options?: SelectOptions[];
  className?: string;
  size?: BaseSize;
  required?: boolean;
  disabled?: boolean;
  optionClassName?: string;
  onOpenChange?: (open: boolean) => void;
}

const BaseSelect = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectProps
>((props, ref) => {
  const {
    name,
    value,
    onChange,
    className,
    placeholder = "",
    required,
    size = "md",
    options = [],
    disabled,
    optionClassName,
    ...remainingProps
  } = props;
  const selectClass = cn(theme.base, theme.size[size]);

  return (
    <Select
      name={name}
      required={required}
      onValueChange={onChange} 
      defaultValue={value}
      disabled={disabled}
      {...remainingProps}
    >
      <SelectTrigger ref={ref} className={cn(selectClass, className)}>
        <SelectValue placeholder={<span className="text-black/55">{placeholder}</span>} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options?.map((item) => {
            return (
              <SelectItem
                disabled={!!item.disabled}
                key={item.value}
                value={item.value}
              >
                <div
                  className={cn(["flex items-center gap-1", optionClassName])}
                >
                  <span>{item.label}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
});
BaseSelect.displayName = "BaseSelect";

export default BaseSelect;

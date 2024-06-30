import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import ToolLanguageInput from "./ToolLanguageInput";
import { Button } from "@/components/ui/button";
import { PositionResource } from "@/interfaces/api";
import { useMemo } from "react";
import { Item } from "@radix-ui/react-select";

type ToolLanguageFormFieldProps = {
  positionResources: Record<string, PositionResource>;
  form: UseFormReturn<any>;
  index: number;
};

const ToolLanguageFormField = (props: ToolLanguageFormFieldProps) => {
  const { positionResources, form, index } = props;
  const { watch, control } = form;
  const {
    fields: toolLanguageFields,
    append: appendToolLanguage,
    remove: removeToolLanguage,
  } = useFieldArray({
    control,
    name: `positions.${index}.toolLanguages`,
  });

  const positionResourceId = watch(`positions.${index}.positionResourceId`);

  if (!positionResourceId) return;

  const toolLanguageResources = positionResources?.[positionResourceId];

  const toolLanguageData = toolLanguageResources?.toolLanguageResources?.map((item) => ({
    label: item.name,
    value: `${item.toolLanguageResourceId}`,
  }));

  return (
    <div className="space-y-4">
      {toolLanguageFields.map((toolLanguage, idx) => (
        <div className="space-y-4" key={toolLanguage.id}>
          <FormField
            control={control}
            name={`positions.${index}.toolLanguages.${idx}`}
            render={({ field: { value, onChange } }) => (
              <FormItem className="md:flex items-start flex-1 gap-x-4">
                <FormLabel className="md:h-10  md:w-[120px] flex mt-2 items-center">
                  Tool/Language
                </FormLabel>
                <FormControl className="flex-1">
                  <div className="flex gap-x-4 items-start">
                    <ToolLanguageInput
                      toolLanguageData={toolLanguageData}
                      className="flex-1"
                      errorMessage={<FormMessage />}
                      value={value}
                      onChange={(value) => {
                        onChange(value);
                      }}
                    />
                    <Button
                      className="w-[180px] bg-neutral-600 hover:bg-neutral-500"
                      type="button"
                      onClick={() => removeToolLanguage(idx)}
                    >
                      Delete Tool/Language
                    </Button>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      ))}
      <Button
        variant="secondary"
        className="md:ml-[136px]"
        type="button"
        onClick={() =>
          appendToolLanguage({
            toolLanguageResourceId: 0,
            from: 0,
            to: 0,
            description: "",
            images: [],
          })
        }
      >
        Add Tool/Language
      </Button>
    </div>
  );
};

export default ToolLanguageFormField;

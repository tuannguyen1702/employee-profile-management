"use client";

import React, { useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ToolLanguageFormField from "./ToolLanguageFormField";
import BaseSelect from "@/components/common/Select";
import { PositionResource } from "@/interfaces/api";
import { useCreateEmployee } from "@/hooks/useCreateEmployee";

const imageSchema = z.object({
  data: z.string().optional(),
});

// Define the schema for Tool/Language
const toolLanguageSchema = z
  .object({
    toolLanguageResourceId: z.number(),
    from: z.number(),
    to: z.number(),
    description: z.string().optional(),
    images: z.array(imageSchema),
  })
  .refine(
    (data) => {
      return data.toolLanguageResourceId !== 0;
    },
    {
      message: "Tool/Language is required",
    }
  )
  .refine(
    (data) => {
      return data.from !== 0;
    },
    {
      message: "From is required",
    }
  )
  .refine(
    (data) => {
      return data.to !== 0;
    },
    {
      message: "To is required",
    }
  );

// Define the schema for positions
const positionSchema = z.object({
  positionResourceId: z.number().min(1, "Position is required"),
  toolLanguages: z.array(toolLanguageSchema),
});

// Define the schema for the form
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  positions: z.array(positionSchema),
});

type EmployeeFormProps = {
  positionResources: Record<string, PositionResource>;
};

export default function EmployeeForm(props: EmployeeFormProps) {
  const { positionResources } = props;

  const [positionSelected, setPositionSelected] = useState<number[]>([])

  const { trigger } = useCreateEmployee({
    onSuccess: (res: any) => {
      console.log(`create employee`, res)
    }
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      positions: [
        {
          positionResourceId: 0,
          toolLanguages: [
            {
              toolLanguageResourceId: 0,
              from: 0,
              to: 0,
              description: "",
              images: [{ data: "" }],
            },
          ],
        },
      ],
    },
  });

  const { control, handleSubmit, watch } = form;

  const {
    fields: positionField,
    append: appendPosition,
    remove: removePosition,
  } = useFieldArray({
    control,
    name: "positions",
  });

  const onSubmit = (data: any) => {
    console.log("Form data:", data);

    trigger({...data})
  };

  const updatePositionSelected = () => {
    const positionSelectedObj = form.getValues('positions');
    const positionSelectedValue = positionSelectedObj.map(item => item.positionResourceId);
    setPositionSelected(positionSelectedValue);
  }

  const positions = useMemo(
    () => {
      return Object.keys(positionResources).map((key) => ({
        label: positionResources[key].name,
        value: key,
        disabled: positionSelected.includes(parseInt(key))
      }))},
    [positionResources, positionSelected]
  );

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem className="md:flex items-start flex-1 gap-x-4">
              <FormLabel className="md:h-10  md:w-[120px] flex mt-2 items-center">
                Name
              </FormLabel>
              <FormControl className="flex-1  md:pr-[196px]">
                <div>
                  <Input placeholder="Input name" {...field} />
                  <FormMessage />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <div className="group">
          {positionField.map((field, index) => (
            <div
              className="space-y-4 last:after:border-b-0 after:border-b-black/5 after:border-b-2 after:contents[' '] after:w-auto after:block after:mt-6 after:mb-4 md:after:ml-[136px] md:after:mr-[196px]"
              key={field.id}
            >
              <FormField
                control={control}
                name={`positions.${index}.positionResourceId`}
                render={({ field: { onChange } }) => (
                  <FormItem className="md:flex items-start flex-1 gap-x-4">
                    <FormLabel className="md:h-10  md:w-[120px] flex mt-2 items-center">
                      Position
                    </FormLabel>
                    <FormControl className="flex-1">
                      <div className="flex gap-x-4 items-start">
                        <div className="flex-1">
                          <BaseSelect
                            placeholder="Select position"
                            options={positions}
                            onChange={(value) => {
                              onChange(parseInt(value));
                              updatePositionSelected();
                            }}
                          />
                          <FormMessage />
                        </div>
                        <Button
                          className="w-[180px] bg-neutral-600 hover:bg-neutral-500"
                          type="button"
                          onClick={() => {
                            removePosition(index);
                            updatePositionSelected();
                          }}
                        >
                          Delete Position
                        </Button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <ToolLanguageFormField positionResources={positionResources} form={form} index={index} />
            </div>
          ))}
        </div>
        <div>
          <Button
            className="md:ml-[136px] bg-blue-600 hover:bg-blue-500"
            type="button"
            onClick={() =>
              appendPosition({
                positionResourceId: 0,
                toolLanguages: [
                  {
                    toolLanguageResourceId: 0,
                    from: 0,
                    to: 0,
                    description: "",
                    images: [{ data: "" }],
                  },
                ],
              })
            }
          >
            Add Position
          </Button>
        </div>
        <div className="flex justify-end">
          <Button
            className="min-w-[180px] bg-green-600 hover:bg-green-500"
            type="submit"
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}

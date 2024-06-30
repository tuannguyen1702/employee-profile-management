"use client";

import React from "react";
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
import ToolLanguagesFields from "./ToolLanguageFields";

const imageSchema = z.object({
  cdnUrl: z.string().optional(),
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

export default function CreateEmployeeForm() {
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
              images: [{ cdnUrl: "" }],
            },
          ],
        },
      ],
    },
  });

  const { control, handleSubmit } = form;

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
  };

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
                  <Input placeholder="shadcn" {...field} />
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
                          <Input
                            type="number"
                            placeholder="shadcn"
                            onChange={(value) => {
                              const newValue = parseInt(value.target.value);
                              onChange(newValue);
                            }}
                          />
                          <FormMessage />
                        </div>
                        <Button
                          variant="destructive"
                          className="w-[180px]"
                          type="button"
                          onClick={() => removePosition(index)}
                        >
                          Delete Position
                        </Button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <ToolLanguagesFields form={form} index={index} />
            </div>
          ))}
        </div>
        <div>
          <Button
            variant="secondary"
            className="md:ml-[136px]"
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
                    images: [{ cdnUrl: "" }],
                  },
                ],
              })
            }
          >
            Add Position
          </Button>
        </div>
        <div className="flex justify-end">
          <Button className="min-w-[180px]" type="submit">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}

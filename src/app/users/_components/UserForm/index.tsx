"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
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
import BaseSelect from "@/components/common/Select";
import { User } from "@/interfaces/api";
import { useCreateUser } from "@/hooks/useCreateUser";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateEmployee } from "@/hooks/useUpdateEmployee";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useDeleteEmployee } from "@/hooks/useDeleteEmployee";
import { levels } from "@/const";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TreeNode } from "@/lib/utils";
import { userStore } from "@/stores/userStore";

// Define the schema for the form
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  userId: z.string().min(6, { message: "User ID is wrong format." }),
  level: z.string(),
  parentId: z.string(),
});

type UserFormProps = {
  open?: boolean;
  formData?: TreeNode;
  parentData?: TreeNode;
  onClose?: () => void;
};

export default function UserForm(props: UserFormProps) {
  const { formData, parentData, open = false, onClose } = props;
  const addMoreUser = userStore((state) => state.addMoreUser);

  const levelArr = Object.keys(levels);

  const level = useMemo(() => {
    const idx = levelArr.findIndex((item) => item === parentData?.level);

    return levelArr[idx + 1];
  }, [parentData, levelArr]);

  const { toast } = useToast();

  const backListEmployees = () => {
    onClose?.();
  };

  const { trigger: createUser } = useCreateUser({
    onSuccess: (res: any) => {
      if (res.data) {
        addMoreUser([res.data]);
        toast({
          title: "Create new user successful.",
        });
        backListEmployees();
      }
    },
  });

  const { trigger: updateEmployee } = useUpdateEmployee({
    onSuccess: (res: any) => {
      if (res.data) {
        toast({
          title: "Update employee successful.",
        });
        backListEmployees();
      }
    },
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      userId: "",
      parentId: "",
      level: "",
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = (data: User) => {
    if (formData?.id) {
      // updateEmployee({ id: formData.id.toString(), body: data });
    } else {
      createUser(data);
    }
  };

  useEffect(() => {
    form.setValue("parentId", parentData?.userId || "");
    form.setValue("level", level);
  }, [parentData, level]);

  return (
    <Sheet open={open}>
      {/* <SheetTrigger asChild>
        <Button>Add New User</Button>
      </SheetTrigger> */}
      <SheetContent
        onClose={() => {
          onClose?.();
        }}
        className="sm:max-w-[540px]"
      >
        <SheetHeader className="mb-4">
          <SheetTitle>Create MIB/IB</SheetTitle>
          {/* <SheetDescription>
                    Make changes to your profile here. Click save when you're
                    done.
                  </SheetDescription> */}
        </SheetHeader>
        <Form {...form}>
          <form
            className="space-y-4 pb-20 md:pb-0"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormField
              control={control}
              name="parentId"
              render={({ field }) => (
                <FormItem className="md:flex items-start flex-1 gap-x-4">
                  <FormLabel className="md:h-10  md:w-[120px] flex mt-2 items-center">
                    Upline UID
                  </FormLabel>
                  <FormControl className="flex-1">
                    <div>
                      <Input
                        readOnly
                        className="w-full"
                        placeholder="Input Upline UID"
                        {...field}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="userId"
              render={({ field }) => (
                <FormItem className="md:flex items-start flex-1 gap-x-4">
                  <FormLabel className="md:h-10  md:w-[120px] flex mt-2 items-center">
                    User ID
                  </FormLabel>
                  <FormControl className="flex-1">
                    <div>
                      <Input
                        className="w-full"
                        placeholder="Input User ID"
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem className="md:flex items-start flex-1 gap-x-4">
                  <FormLabel className="md:h-10  md:w-[120px] flex mt-2 items-center">
                    Name
                  </FormLabel>
                  <FormControl className="flex-1">
                    <div>
                      <Input placeholder="Input Name" {...field} />
                      <FormMessage />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            {/* 
            <FormField
              control={control}
              name="parentId"
              render={({ field }) => (
                <FormItem className="md:flex items-start flex-1 gap-x-4">
                  <FormLabel className="md:h-10  md:w-[120px] flex mt-2 items-center">
                    Upline User
                  </FormLabel>
                  <FormControl className="flex-1">
                    <div>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                          >
                            {value
                              ? userList?.find(
                                  (user) => user.value === value
                                )?.label
                              : "Select User"}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-[355px]">
                          <Command>
                            <CommandInput
                              placeholder="Search User"
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No user found.</CommandEmpty>
                              <CommandGroup>
                                {userList?.map((user) => (
                                  <CommandItem
                                    key={user.value}
                                    value={user.value}
                                    onSelect={(currentValue) => {
                                      setValue(
                                        currentValue === value
                                          ? ""
                                          : currentValue
                                      );
                                      setOpen(false);
                                    }}
                                  >
                                    {user.label}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        value === user.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            /> */}

            <FormField
              control={control}
              name="level"
              render={({ field }) => (
                <FormItem className="md:flex items-start flex-1 gap-x-4">
                  <FormLabel className="md:h-10  md:w-[120px] flex mt-2 items-center">
                    Level
                  </FormLabel>
                  <FormControl className="flex-1">
                    <Input
                      readOnly
                      className="w-full"
                      placeholder="Input level"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div>
              <div className="flex gap-x-2 justify-end">
                <Button
                  className="md:min-w-[180px] md:w-auto bg-green-600 hover:bg-green-500"
                  type="submit"
                >
                  Save
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

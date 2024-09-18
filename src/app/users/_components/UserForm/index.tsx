"use client";

import React, { useMemo, useState } from "react";
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
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

// Define the schema for the form
const formSchema = z.object({
  name: z.string().optional(),
  userId: z.string().min(6),
  level: z.string().optional(),
  parentId: z.string().optional(),
});

type UserFormProps = {
  formData?: User;
  userData: User[] | undefined;
};

export default function UserForm(props: UserFormProps) {
  const { formData, userData } = props;

  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  const router = useRouter();


  const userList = useMemo(() => {
    return userData?.map((user) => ({label: user.name, value: user.userId}) )
  }, [userData])

  const listLevel = Object.keys(levels).map((key) => ({
    value: key,
    label: key,
  }));

  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);

  const { toast } = useToast();

  const backListEmployees = () => {
    // window.location.href = "/employees";
  };

  const { trigger: createUser } = useCreateUser({
    onSuccess: (res: any) => {
      if (res.data) {
        toast({
          title: "Create new employee successful.",
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

  const { trigger: deleteEmployee } = useDeleteEmployee({
    onSuccess: (res: any) => {
      if (res.data) {
        backListEmployees();
      }
    },
  });

  const handleDeleteEmployee = () => {
    setOpenConfirmDelete(false);
    if (formData?.id) {
      deleteEmployee({ id: formData.id.toString() });
    }
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: formData ?? {
      name: "",
      userId: "",
      parentId: "",
      level: "Client",
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = (data: User) => {
    console.log(data);
    if (formData?.id) {
      // updateEmployee({ id: formData.id.toString(), body: data });
    } else {
      createUser(data);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Add New User</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[540px]">
        <SheetHeader className="mb-4">
          <SheetTitle>Create New User</SheetTitle>
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
                      {/* <Input placeholder="Select Upline User" {...field} /> */}
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
            />

            <FormField
              control={control}
              name="level"
              render={({ field }) => (
                <FormItem className="md:flex items-start flex-1 gap-x-4">
                  <FormLabel className="md:h-10  md:w-[120px] flex mt-2 items-center">
                    Level
                  </FormLabel>
                  <FormControl className="flex-1">
                    <div>
                      <BaseSelect
                        placeholder="Select Level"
                        options={listLevel}
                        {...field}
                      />
                      <FormMessage />
                    </div>
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
                {/* <SheetFooter>
                  <SheetClose asChild>
                    <Button type="submit">Save changes</Button>
                  </SheetClose>
                </SheetFooter> */}
              </div>
            </div>
          </form>
          <ConfirmDialog
            open={openConfirmDelete}
            onOk={() => handleDeleteEmployee()}
            onCancel={() => setOpenConfirmDelete(false)}
            title={"Are you sure to delete this employee?"}
            description={
              "This action cannot be undone. This employee will be permanently removed from your system."
            }
          />
        </Form>
      </SheetContent>
    </Sheet>
  );
}

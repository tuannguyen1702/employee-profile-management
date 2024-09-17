"use client";

import React, { useState } from "react";
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

// Define the schema for the form
const formSchema = z.object({
  name: z.string().optional(),
  accountNumber: z.string().min(8),
  level: z.string().optional(),
  userUpline: z.string().optional(),
});

type UserFormProps = {
  formData?: User;
};

export default function UserForm(props: UserFormProps) {
  const { formData } = props;

  const router = useRouter();

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
      accountNumber: "",
      userUpline: "",
      level: "Client"
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = (data: User) => {
    console.log(data);
    if (formData?.id) {
      // updateEmployee({ id: formData.id.toString(), body: data });
    } else {
      // createUser(data);
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
              name="accountNumber"
              render={({ field }) => (
                <FormItem className="md:flex items-start flex-1 gap-x-4">
                  <FormLabel className="md:h-10  md:w-[120px] flex mt-2 items-center">
                    Account Number
                  </FormLabel>
                  <FormControl className="flex-1">
                    <div>
                      <Input
                        className="w-full"
                        placeholder="Input Account Number"
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
              name="userUpline"
              render={({ field }) => (
                <FormItem className="md:flex items-start flex-1 gap-x-4">
                  <FormLabel className="md:h-10  md:w-[120px] flex mt-2 items-center">
                    User Upline
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

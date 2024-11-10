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
import { configKeys, levels } from "@/const";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TreeNode } from "@/lib/utils";
import { userStore } from "@/stores/userStore";
import { commissionConfigStore } from "@/stores/commissionConfig";
import { useGetConfigByKey } from "@/hooks/useGetConfigByKey";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateUser } from "@/hooks/useUpdateUser";

// Define the schema for the form
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  userId: z.string().min(6, { message: "User ID is wrong format." }),
  level: z.string(),
  parentId: z.string(),
  commissionSettingId: z.string().optional(),
});

type UserFormProps = {
  open?: boolean;
  formData?: TreeNode;
  parentData?: {
    user?: TreeNode | User;
    isEdit: boolean;
  };
  onClose?: () => void;
};

export default function UserForm(props: UserFormProps) {
  const { formData, parentData, open = false, onClose } = props;
  const { isEdit } = parentData ?? {};
  const addMoreUser = userStore((state) => state.addMoreUser);
  const updateUserStore = userStore((state) => state.updateUser);
  
  const [isSaving, setIsSaving] = useState(false);

  const commissionConfigData = commissionConfigStore(
    (state) => state.commissionConfig
  );

  const { error: userRelatedError } = useGetConfigByKey(
    configKeys.COMMISSION_SETTING
  );

  const levelArr = Object.keys(levels);

  const level = useMemo(() => {
    const idx = levelArr.findIndex((item) => item === parentData?.user?.level);

    return levelArr[idx + 1];
  }, [parentData, levelArr]);

  const { toast } = useToast();

  const backListEmployees = () => {
    form.reset();
    onClose?.();
  };

  const { trigger: createUser } = useCreateUser({
    onSuccess: (res: any) => {
      setIsSaving(false);
      if (res.data) {
        addMoreUser([res.data]);
        toast({
          title: "Create new user successful.",
        });
        backListEmployees();
      }
    },
    onError: () => {
      setIsSaving(false);
      toast({
        title: "User already exists.",
        variant: "destructive",
      });
    },
  });

  const { trigger: updateUser } = useUpdateUser({
    onSuccess: (res: any) => {
      setIsSaving(false);
      if (res.data) {
        updateUserStore(res.data);
        toast({
          title: "Update successful.",
        });
        backListEmployees();
      }
    },
    onError: () => {
      setIsSaving(false);
      toast({
        title: "Update is error.",
        variant: "destructive",
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      userId: "",
      parentId: "",
      level: "",
      commissionSettingId: "",
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = (data: User) => {
    setIsSaving(true);
    if (isEdit) {
      updateUser({id: parentData?.user?.id?.toString() ?? '', user: data})
      // updateEmployee({ id: formData.id.toString(), body: data });
    } else {
      const leaf = levelArr.findIndex(
        (item) => item === parentData?.user?.level
      );
      createUser({ ...data, leaf: leaf + 1 });
    }
  };

  useEffect(() => {
    if (open) {
      if(!isEdit) {
        form.setValue("parentId", parentData?.user?.userId || "");
        form.setValue("level", level);
      } else {
        form.setValue("userId", parentData?.user?.userId || "");
        form.setValue("level", parentData?.user?.level || "");
        form.setValue("name", parentData?.user?.name || "");
        form.setValue("commissionSettingId", parentData?.user?.commissionSettingId || "");
      }
      
    }
  }, [parentData, level, open]);

  return (
    <Sheet open={open}>
      {/* <SheetTrigger asChild>
        <Button>Add New User</Button>
      </SheetTrigger> */}
      <SheetContent
        onClose={() => {
          form.reset();
          onClose?.();
        }}
        className="sm:max-w-[540px]"
      >
        <SheetHeader className="mb-4">
          <SheetTitle>Create {parentData ? "MIB/IB" : "Master"}</SheetTitle>
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
            {parentData?.user?.parentId  && (
              <FormField
                control={control}
                name="parentId"
                render={({ field }) => (
                  <FormItem className="md:flex items-start flex-1 gap-x-4">
                    <FormLabel className="md:h-10  md:w-[140px] flex mt-2 items-center">
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
            )}
            <FormField
              control={control}
              name="userId"
              render={({ field }) => (
                <FormItem className="md:flex items-start flex-1 gap-x-4">
                  <FormLabel className="md:h-10  md:w-[140px] flex mt-2 items-center">
                    User ID
                  </FormLabel>
                  <FormControl className="flex-1">
                    <div>
                      <Input
                        readOnly={isEdit}
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
                  <FormLabel className="md:h-10  md:w-[140px] flex mt-2 items-center">
                    Name
                  </FormLabel>
                  <FormControl className="flex-1">
                    <div>
                      <Input readOnly={isEdit} placeholder="Input Name" {...field} />
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
                  <FormLabel className="md:h-10  md:w-[140px] flex mt-2 items-center">
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

            {!parentData?.user?.parentId  && (
              <FormField
                control={control}
                name="commissionSettingId"
                render={({ field }) => (
                  <FormItem className="md:flex items-start flex-1 gap-x-4">
                    <FormLabel className="md:h-10  md:w-[140px] flex mt-2 items-center">
                      Commission Setting
                    </FormLabel>
                    <FormControl className="flex-1">
                      <div>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Commission Setting" />
                          </SelectTrigger>
                          <SelectContent>
                            {(commissionConfigData?.value as any[]).map(
                              (item: any) => (
                                <SelectItem value={`${item.key}`}>
                                  {`${item.name}`}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <div>
              <div className="flex gap-x-2 justify-end">
                <Button
                  disabled={isSaving}
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

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
import { Button } from "@/components/ui/button";;
import { User, UserRelated } from "@/interfaces/api";
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
import { useCreateUserRelated } from "@/hooks/useCreateUserRelated";
import { userRelatedStore } from "@/stores/userRelatedStore";

// Define the schema for the form
const formSchema = z.object({
  userId: z.string().min(6, {message: 'User ID is wrong format.'}),
  parentId: z.string(),
});

type ClientFormProps = {
  open?: boolean;
  formData?: TreeNode;
  parentData?: TreeNode;
  onClose?: () => void;
};

export default function ClientForm(props: ClientFormProps) {
  const { formData, parentData, open = false, onClose } = props;

  const addMoreUserRelated = userRelatedStore((state) => state.addMoreUserRelated);

  const levelArr = Object.keys(levels);

  const level = useMemo(() => {
    const idx = levelArr.findIndex((item) => item === parentData?.level);

    return levelArr[idx + 1];
  }, [parentData, levelArr]);

  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);

  const { toast } = useToast();

  const backListEmployees = () => {
    onClose?.();
  };

  const { trigger: createUser } = useCreateUserRelated({
    onSuccess: (res: any) => {
      if (res.data) {
        toast({
          title: "Create new user successful.",
        });
        addMoreUserRelated([res.data])
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
    defaultValues: {
      userId: "",
      parentId: ""
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = (data: UserRelated) => {
    if (formData?.id) {
      // updateEmployee({ id: formData.id.toString(), body: data });
    } else {
      createUser(data);
    }
  };

  useEffect(() => {

    form.setValue('parentId', parentData?.userId || '');

  }, [parentData])

  return (
    <Sheet open={open}>
      <SheetContent
        onClose={() => {
          onClose?.();
        }}
        className="sm:max-w-[540px]"
      >
        <SheetHeader className="mb-4">
          <SheetTitle>Create Client</SheetTitle>
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
                        placeholder="Input User ID"
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

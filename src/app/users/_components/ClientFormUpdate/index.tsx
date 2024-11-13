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
import { User, UserRelated } from "@/interfaces/api";
import { useToast } from "@/components/ui/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TreeNode } from "@/lib/utils";
import { userRelatedStore } from "@/stores/userRelatedStore";
import { useUpdateUserRelated } from "@/hooks/useUpdateUserRelated";

// Define the schema for the form
const formSchema = z.object({
  userId: z.string().min(6, { message: "User ID is wrong format." }),
  parentId: z.string(),
});

type ClientFormUpdateProps = {
  open?: boolean;
  formData?: TreeNode;
  parentData?: {
    user?: TreeNode | User;
    isEdit: boolean;
  };
  onClose?: () => void;
};

export default function ClientFormUpdate(props: ClientFormUpdateProps) {
  const { formData, parentData, open = false, onClose } = props;

  const updateUserRelated = userRelatedStore(
    (state) => state.updateUserRelated
  );

  const userRelated = userRelatedStore(
    (state) => state.userRelated
  );

  const [isSaving, setIsSaving] = useState(false);

  const { toast } = useToast();

  const backListEmployees = () => {
    onClose?.();
  };

  const { trigger: updateClient } = useUpdateUserRelated({
    onSuccess: (res: any) => {
      setIsSaving(false);
      if (res.data) {
        toast({
          title: "Update client successful.",
        });
        updateUserRelated(res.data);
        backListEmployees();
      }
    },
    onError: () => {
      setIsSaving(false);
      toast({
        title: "Client already exists.",
        variant: "destructive",
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      parentId: "",
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = (data: UserRelated) => {
   

    const user = userRelated.find((a) => a.userId === data.userId);

    setIsSaving(true);
    if(user) {
      updateClient({...user, ...data});
    } else {
      toast({
        title: "Client isn't exists.",
        variant: "destructive",
      });
    }
    // setIsSaving(true);
    // if (formData?.id) {
    //   // updateEmployee({ id: formData.id.toString(), body: data });
    // } else {
    //   updateClient(data);
    // }
  };

  useEffect(() => {
    form.setValue("parentId", parentData?.user?.userId || "");
  }, [parentData]);

  return (
    <Sheet open={open}>
      <SheetContent
        onClose={() => {
          onClose?.();
        }}
        className="sm:max-w-[540px]"
      >
        <SheetHeader className="mb-4">
          <SheetTitle>Update Client</SheetTitle>
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

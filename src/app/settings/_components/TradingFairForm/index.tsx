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
import { useCreateUserRelated } from "@/hooks/useCreateUserRelated";
import { userRelatedStore } from "@/stores/userRelatedStore";
import { useCreateConfig } from "@/hooks/useCreateConfig";
import { commissionConfigStore } from "@/stores/commissionConfig";
import { useGetConfigByKey } from "@/hooks/useGetConfigByKey";

// Define the schema for the form
const formSchema = z.object({
  GOODS: z.string(),
  CURRENCY: z.string(),
  CRYPTO: z.string(),
  STOCK: z.string(),
});

type TradingFairFormProps = {};

export default function TradingFairForm(props: TradingFairFormProps) {
  const addMoreUserRelated = userRelatedStore(
    (state) => state.addMoreUserRelated
  );
  const [isSaving, setIsSaving] = useState(false);

  const levelArr = Object.keys(levels);

  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);

  const { toast } = useToast();

  const { error: userRelatedError } = useGetConfigByKey(configKeys.COMMISSION_TYPE);

  const commissionTypeData = commissionConfigStore(
    (state) => state.commissionType
  );

  const { trigger: createUser } = useCreateUserRelated({
    onSuccess: (res: any) => {
      setIsSaving(false);
      if (res.data) {
        toast({
          title: "Create new user successful.",
        });
        addMoreUserRelated([res.data]);
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

  useEffect(() => {
    const data = (commissionTypeData?.value as any) ?? {};

    form.setValue("GOODS", data.GOODS ?? "");
    form.setValue("CURRENCY", data.CURRENCY ?? "");
    form.setValue("CRYPTO", data.CRYPTO ?? "");
    form.setValue("STOCK", data.STOCK ?? "");
  }, [commissionTypeData]);

  // const { trigger: updateEmployee } = useUpdateEmployee({
  //   onSuccess: (res: any) => {
  //     if (res.data) {
  //       toast({
  //         title: "Update employee successful.",
  //       });
  //       //backListEmployees();
  //     }
  //   },
  // });

  const { trigger: createConfig } = useCreateConfig({
    onSuccess: (res: any) => {
      setIsSaving(false);
      if (res.data) {
        toast({
          title: "Create config successful.",
        });

        ///setCommissionConfig(res.data);
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

  // const { trigger: deleteEmployee } = useDeleteEmployee({
  //   onSuccess: (res: any) => {
  //     if (res.data) {
  //       // backListEmployees();
  //     }
  //   },
  // });

  // const handleDeleteEmployee = () => {
  //   setOpenConfirmDelete(false);
  //   if (formData?.id) {
  //     deleteEmployee({ id: formData.id.toString() });
  //   }
  // };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      GOODS: "",
      CURRENCY: "",
      CRYPTO: "",
      STOCK: "",
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = (data: any) => {
    console.log(`data 1`, data);
    // setIsSaving(true);
    // if (formData?.id) {
    //   // updateEmployee({ id: formData.id.toString(), body: data });
    // } else {
    //   createUser(data);
    // }

    const postData: any = {
      key: configKeys.COMMISSION_TYPE,
      value: data,
    };

    createConfig({ key: configKeys.COMMISSION_TYPE, body: postData });
  };

  // useEffect(() => {
  //   form.setValue("parentId", parentData?.userId || "");
  // }, [parentData]);

  return (
    <Form {...form}>
      <form
        className="space-y-4 pb-20 md:pb-0"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormField
          control={control}
          name="GOODS"
          render={({ field }) => (
            <FormItem className="md:flex items-start flex-1 gap-x-4">
              <FormLabel className="md:h-10  md:w-[120px] flex mt-2 items-center">
                Goods
              </FormLabel>
              <FormControl className="flex-1">
                <div>
                  <Input
                    className="w-full"
                    placeholder="XAUUSD, USOIL, ..."
                    {...field}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="CURRENCY"
          render={({ field }) => (
            <FormItem className="md:flex items-start flex-1 gap-x-4">
              <FormLabel className="md:h-10  md:w-[120px] flex mt-2 items-center">
                Currencies
              </FormLabel>
              <FormControl className="flex-1">
                <div>
                  <Input
                    className="w-full"
                    placeholder="EURUSD, GBPJPY, ..."
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
          name="CRYPTO"
          render={({ field }) => (
            <FormItem className="md:flex items-start flex-1 gap-x-4">
              <FormLabel className="md:h-10  md:w-[120px] flex mt-2 items-center">
                Crypto
              </FormLabel>
              <FormControl className="flex-1">
                <div>
                  <Input
                    className="w-full"
                    placeholder="BTCUSD, ETHUSD, ..."
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
          name="STOCK"
          render={({ field }) => (
            <FormItem className="md:flex items-start flex-1 gap-x-4">
              <FormLabel className="md:h-10  md:w-[120px] flex mt-2 items-center">
                Stocks
              </FormLabel>
              <FormControl className="flex-1">
                <div>
                  <Input
                    className="w-full"
                    placeholder="CHINA300, ..."
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
  );
}

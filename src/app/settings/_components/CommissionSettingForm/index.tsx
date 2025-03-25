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
import { TreeNode } from "@/lib/utils";
import { useCreateUserRelated } from "@/hooks/useCreateUserRelated";
import { userRelatedStore } from "@/stores/userRelatedStore";
import { useGetConfigByKey } from "@/hooks/useGetConfigByKey";
import { commissionConfigStore } from "@/stores/commissionConfig";
import { useCreateConfig, useUpdateConfig } from "@/hooks/useCreateConfig";

// Define the schema for the form
const tradingFairSchema = {
  GOODS: z.number().min(0).max(100),
  CURRENCY: z.number().min(0).max(100),
  CRYPTO: z.number().min(0).max(100),
  STOCK: z.number().min(0).max(100),
};

const commissionSchema = {
  directCommission: z.object(tradingFairSchema),
  inDirectCommission: z.object(tradingFairSchema),
};

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  key: z.string(),
  value: z.object({
    MASTER: z.object(commissionSchema),
    MIB: z.object(commissionSchema),
    IB1: z.object(commissionSchema),
    IB2: z.object(commissionSchema),
    IB3: z.object(commissionSchema),
    IB4: z.object(commissionSchema),
  }),
});

const defaultValue = {
  directCommission: {
    GOODS: 0,
    CURRENCY: 0,
    CRYPTO: 0,
    STOCK: 0,
  },
  inDirectCommission: {
    GOODS: 0,
    CURRENCY: 0,
    CRYPTO: 0,
    STOCK: 0,
  },
};

type CommissionSettingFormProps = {};

export default function CommissionSettingForm(
  props: CommissionSettingFormProps
) {
  const commissionConfigData = commissionConfigStore(
    (state) => state.commissionConfig
  );

  const setCommissionConfig = commissionConfigStore(
    (state) => state.setCommissionConfig
  );

  const { error: userRelatedError } = useGetConfigByKey(configKeys.COMMISSION_SETTING);

  const [isSaving, setIsSaving] = useState(false);

  const levelArr = Object.keys(levels);

  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);

  const { toast } = useToast();

  const { trigger: createConfig } = useCreateConfig({
    onSuccess: (res: any) => {
      setIsSaving(false);
      if (res.data) {
        toast({
          title: "Create config successful.",
        });
        setCommissionConfig(res.data);
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

  const { trigger: updateConfig } = useUpdateConfig({
    onSuccess: (res: any) => {
      if (res.data) {
        toast({
          title: "Update config successful.",
        });
        //backListEmployees();
      }
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
      name: "",
      key: "",
      value: {
        MASTER: {
          directCommission: {
            GOODS: 63,
            CURRENCY: 63,
            CRYPTO: 63,
            STOCK: 63,
          },
          inDirectCommission: {
            GOODS: 33,
            CURRENCY: 33,
            CRYPTO: 33,
            STOCK: 33,
          },
        },
        MIB: {
          directCommission: {
            GOODS: 30,
            CURRENCY: 30,
            CRYPTO: 30,
            STOCK: 30,
          },
          inDirectCommission: {
            GOODS: 6,
            CURRENCY: 6,
            CRYPTO: 6,
            STOCK: 6,
          },
        },
        IB1: {
          directCommission: {
            GOODS: 24,
            CURRENCY: 24,
            CRYPTO: 24,
            STOCK: 24,
          },
          inDirectCommission: {
            GOODS: 4,
            CURRENCY: 4,
            CRYPTO: 4,
            STOCK: 4,
          },
        },
        IB2: {
          directCommission: {
            GOODS: 20,
            CURRENCY: 20,
            CRYPTO: 20,
            STOCK: 20,
          },
          inDirectCommission: {
            GOODS: 4,
            CURRENCY: 4,
            CRYPTO: 4,
            STOCK: 4,
          },
        },
        IB3: {
          directCommission: {
            GOODS: 16,
            CURRENCY: 16,
            CRYPTO: 16,
            STOCK: 16,
          },
          inDirectCommission: {
            GOODS: 4,
            CURRENCY: 4,
            CRYPTO: 4,
            STOCK: 4,
          },
        },
        IB4: {
          directCommission: {
            GOODS: 12,
            CURRENCY: 12,
            CRYPTO: 12,
            STOCK: 12,
          },
          inDirectCommission: {
            GOODS: 4,
            CURRENCY: 4,
            CRYPTO: 4,
            STOCK: 4,
          },
        },
      },
    },
  });

  const { control } = form;

  const onSubmit = (data: any) => {

    const postData: any = {
      key: configKeys.COMMISSION_SETTING,
    };

    if (!data.key) {
      data.key = new Date().getTime().toString();
      postData["value"] = [
        ...((commissionConfigData?.value ?? []) as any[]),
        data,
      ];
    } else {
      const newData = ((commissionConfigData?.value ?? []) as any[]).map(
        (item) => {
          if (item.key === data.key) return data;

          return item;
        }
      );

      postData["value"] = newData;
      // updateConfig(postData);
    }

    createConfig({key: configKeys.COMMISSION_SETTING , body: postData});

    // setIsSaving(true);
    // if (formData?.id) {
    //   // updateEmployee({ id: formData.id.toString(), body: data });
    // } else {
    //   createUser(data);
    // }
  };

  const changeEdit = (data: any) => {
    form.setValue("name", data.name);
    form.setValue("key", data.key);
    form.setValue("value", data.value);
  };

  // useEffect(() => {
  //   form.setValue("parentId", parentData?.userId || "");
  // }, [parentData]);

  return (
    <div className="flex gap-x-6 bg-slate-100 p-4 rounded-md">
      <div className="space-y-3 w-[350px]">
        {commissionConfigData?.value ? (
          (commissionConfigData.value as any[]).map((item) => (
            <Button
              onClick={() => changeEdit(item)}
              variant="secondary"
              className="bg-slate-300 hover:bg-slate-400/70 w-full"
            >
              {item.name}
            </Button>
          ))
        ) : (
          <div className="bg-slate-200 text-center rounded-md p-4">
            No setting here
          </div>
        )}

        <Button
          onClick={() => {
            form.reset();
          }}
          className="w-full border-dotted"
          variant="outline"
        >
          Add more setting
        </Button>
      </div>
      <div className="flex-1">
        <h2 className="text-lg font-semibold mb-4 capitalize">
          {form.getValues("key")
            ? "Update commission setting"
            : "Create new setting"}
        </h2>
        <Form {...form}>
          <form
            className="grid gap-y-4 pb-20 md:pb-0"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid items-start flex-1 gap-x-4">
                  <FormLabel className="flex mt-2 font-bold items-center">
                    Name
                  </FormLabel>
                  <FormControl className="flex-1">
                    <div>
                      <Input className="w-full" {...field} />
                      <FormMessage />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            {["MASTER", "MIB", "IB1", "IB2", "IB3", "IB4"].map((level) => (
              <div key={level}>
                <h2 className="font-bold text-sm my-2">
                  {level.toUpperCase()}
                </h2>
                <div className="flex gap-4 p-4 rounded-md bg-slate-200">
                  {["directCommission", "inDirectCommission"].map(
                    (commissionType) => (
                      <div
                        className="grid gap-x-4"
                        key={`${level}.${commissionType}`}
                      >
                        <h3 className="text-sm font-semibold">
                          {commissionType === "inDirectCommission"
                            ? "Indirect Commission"
                            : "Direct Commission"}
                        </h3>
                        <div className="flex gap-2  p-4 pt-1 mt-4 rounded-md bg-white">
                          {["GOODS", "CURRENCY", "CRYPTO", "STOCK"].map(
                            (fairType) => (
                              <FormField
                                key={`value.${level}.${commissionType}.${fairType}`}
                                control={control}
                                name={
                                  `value.${level}.${commissionType}.${fairType}` as any
                                }
                                render={({ field }) => (
                                  <FormItem className="grid items-start flex-1 gap-x-4">
                                    <FormLabel className="flex mt-2 items-center">
                                      {fairType}
                                    </FormLabel>
                                    <FormControl className="flex-1">
                                      <div>
                                        <Input
                                          type="number"
                                          inputMode="decimal"
                                          className="w-full"
                                          step={0.1}
                                          {...field}
                                          onChange={(e) => {
                                            const newValue =  parseFloat(e.target.value);

                                            if(newValue < 0) return;

                                            field.onChange(newValue);

                                            form.setValue(
                                              "value",
                                              {...form.getValues("value")}
                                            );
                                          }}
                                        />
                                        <FormMessage />
                                      </div>
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            )
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}

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
      </div>
    </div>
  );
}

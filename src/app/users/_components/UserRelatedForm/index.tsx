import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import {
  useCreateUserRelated,
  useCreateUserRelatedMultiple,
} from "@/hooks/useCreateUserRelated";
import { userRelatedStore } from "@/stores/userRelatedStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { TrashIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { UserSettingForm } from "../UserSetting";
import { useGetXUsers } from "@/hooks/useXGetUsers";
import { timeStamp } from "node:console";
import { UserSetting } from "@/interfaces/api";

const userSchema = z.object({
  userId: z.string(),
  parentId: z.string().min(4, { message: "User ID is wrong format." }),
});

const formSchema = z.object({
  users: z.array(userSchema),
});

type UserRelatedFormProps = {
  open: boolean;
  onClose?: () => void;
  userDataList: string[] | null;
};

export function UserRelatedForm(props: UserRelatedFormProps) {
  const { open, onClose, userDataList } = props;
  const [isOpen, setIsOpen] = useState(open);
  const [isSaving, setIsSaving] = useState(false);

  const [openUserSetting, setOpenUserSetting] = useState(false);

  const addMoreUserRelated = userRelatedStore(
    (state) => state.addMoreUserRelated
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      users: [
        {
          userId: "",
          parentId: "",
        },
      ],
    },
  });

  const { control, handleSubmit } = form;

  const { fields: userField } = useFieldArray({
    control,
    name: "users",
  });

  const { trigger: createUser } = useCreateUserRelatedMultiple({
    onSuccess: (res: any[]) => {
      setIsSaving(false);
      if (res) {
        toast({
          title: "Create new user successful.",
        });

        const newData = res.map((item) => item.data);

        addMoreUserRelated(newData);

        onClose?.();
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

  const {
    error: a,
    isMutating: b,
    trigger: getUserUpline,
  } = useGetXUsers({
    onSuccess: async (res: any) => {
      const { data } = await res.json();

      if (!data) {
        setOpenUserSetting(true);
      } else {
        const formData = form.getValues();

        const dataKeys: any = {};
        if (data.rows?.length) {
          data.rows.map((item: any) => (dataKeys[item.id] = item));
        }

        if (formData.users.length) {
          formData.users.map((item, index) => {
            if (dataKeys[item.userId]) {
              form.setValue(
                `users.${index}.parentId`,
                `${dataKeys[item.userId].parentId}`
              );
            }
          });
        }
      }
    },
  });

  const handleAutoFillUpline = () => {
    const userSetting = localStorage.getItem("userSetting");

    try {
      if (userSetting) {
        const reqData = JSON.parse(userSetting);
        getUserUpline(reqData);
      } else {
        setOpenUserSetting(true);
      }
    } catch (error) {}

    
  };

  const onSubmit = (data: any) => {
    setIsSaving(true);
    createUser(data.users);
  };

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    if (!userDataList) return;

    const userFormData: {
      userId: string;
      parentId: string;
    }[] = [];
    userDataList.map((item) => {
      userFormData.push({
        userId: `${item}`,
        parentId: "",
      });
    });

    form.setValue("users", userFormData);
  }, [userDataList]);

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={() => {
          setIsOpen(false);
          onClose?.();
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <div>Create Clients</div>
              <Button size="xs" onClick={handleAutoFillUpline}>
                Auto Fill Upline
              </Button>
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              className="space-y-4 pb-20 md:pb-0 -mx-6 px-6 overflow-auto max-h-[600px] pt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="group">
                {userField.map((field, index) => (
                  <div className="flex space-x-2 mb-4" key={field.id}>
                    <FormField
                      control={control}
                      name={`users.${index}.userId`}
                      render={({ field }) => (
                        <FormItem className="md:flex items-start flex-1 gap-x-4">
                          <FormControl className="flex-1">
                            <Input
                              readOnly
                              className="w-full"
                              placeholder="Input User ID"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`users.${index}.parentId`}
                      render={({ field }) => (
                        <FormItem className="md:flex items-start flex-1 gap-x-4">
                          <FormControl className="flex-1">
                            <div>
                              <Input
                                className="w-full"
                                placeholder="Input Upline UID"
                                {...field}
                              />
                              <FormMessage />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-500"
                  type="submit"
                >
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <UserSettingForm
        open={openUserSetting}
        onClose={() => setOpenUserSetting(false)}
      />
    </>
  );
}

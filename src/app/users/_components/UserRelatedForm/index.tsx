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
import { zodResolver } from "@hookform/resolvers/zod";
import { TrashIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const userSchema = z.object({
  userId: z.string(),
  parentId: z.string().min(6, { message: "User ID is wrong format." }),
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
    onSuccess: (res: any) => {
      if (res) {
        toast({
          title: "Create new user successful.",
        });

        onClose?.()
      }
    },
  });

  const onSubmit = (data: any) => {
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
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(false);
        onClose?.();
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Clients</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-4 pb-20 md:pb-0"
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
              <Button className="bg-blue-600 hover:bg-blue-500" type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

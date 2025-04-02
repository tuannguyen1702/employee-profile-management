import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  timestamp: z.string().min(1, { message: "Timestamp is required." }),
  token: z.string().min(1, { message: "Token is required." }),
  msg: z.string().min(1, { message: "MSG is required." }),
});

type UserSettingFormProps = {
  open: boolean;
  onClose?: () => void;
};

export function UserSettingForm(props: UserSettingFormProps) {
  const { open, onClose } = props;
  const [isOpen, setIsOpen] = useState(open);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timestamp: "",
      token: "",
      msg: "",
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = (data: any) => {
    localStorage.setItem("userSetting", JSON.stringify(data));
    onClose?.();
  };

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    const userSetting = localStorage.getItem("userSetting");
    try {
      if (userSetting) {
        const formData = JSON.parse(userSetting);
        form.setValue("timestamp", formData.timestamp);
        form.setValue("token", formData.token);
        form.setValue("msg", formData.msg);
      }
    } catch (error) {}
  }, []);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(false);
        onClose?.();
      }}
    >
      <DialogContent isShowOverlay={false} className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div>Update Settings</div>
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-4 pb-20 md:pb-0 -mx-6 px-6 overflow-auto max-h-[600px] pt-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-4">
              <FormField
                control={control}
                name={`timestamp`}
                render={({ field }) => (
                  <FormItem className="md:flex items-start flex-1 gap-x-4">
                    <FormLabel className="md:h-10  md:w-[90px] flex mt-2 items-center">
                      Timestamp
                    </FormLabel>
                    <FormControl className="flex-1">
                      <div>
                        <Input
                          className="w-full"
                          placeholder="Input Timestamp"
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
                name={`token`}
                render={({ field }) => (
                  <FormItem className="md:flex items-start flex-1 gap-x-4">
                    <FormLabel className="md:h-10  md:w-[90px] flex mt-2 items-center">
                      Token
                    </FormLabel>
                    <FormControl className="flex-1">
                      <div>
                        <Input
                          className="w-full"
                          placeholder="Input Token"
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
                name={`msg`}
                render={({ field }) => (
                  <FormItem className="md:flex items-start flex-1 gap-x-4">
                    <FormLabel className="md:h-10  md:w-[90px] flex mt-2 items-center">
                      MSG
                    </FormLabel>
                    <FormControl className="flex-1">
                      <div>
                        <Input
                          className="w-full"
                          placeholder="Input MSG"
                          {...field}
                        />
                        <FormMessage />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
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

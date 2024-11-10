import { ConfigData } from "@/interfaces/api";
import { createConfig, updateConfig } from "@/lib/api/config";
import useSWRMutation from "swr/mutation";

export const useCreateConfig = (option?: any) => {
  return useSWRMutation(
    { key: "createConfig" },
    async (_: any, { arg }: { arg: { key: string; body: ConfigData } }) =>
      await createConfig(arg),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      ...option,
    }
  );
};

export const useUpdateConfig = (option?: any) =>
  useSWRMutation(
    "updateConfig",
    async (_: any, { arg }: { arg: ConfigData }) => await updateConfig(arg),
    option
  );

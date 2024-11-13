import { UserRelated } from "@/interfaces/api";
import { updateUserRelated } from "@/lib/api/userRelated";
import useSWRMutation from "swr/mutation";

export const useUpdateUserRelated = (option?: any) =>
  useSWRMutation(
    "updateUserRelated",
    async (_: any, { arg }: { arg: UserRelated }) =>
      await updateUserRelated(arg),
    option
  );

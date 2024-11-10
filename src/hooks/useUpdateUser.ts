import { User } from "@/interfaces/api";
import { updateUser } from "@/lib/api/users";
import useSWRMutation from "swr/mutation";

export const useUpdateUser = (option?: any) =>
  useSWRMutation(
    "updateUser",
    async (_: any, { arg }: { arg: { id: string; user: User } }) =>
      await updateUser(arg.id, arg.user),
    option
  );

import { User } from "@/interfaces/api";
import { createUser } from "@/lib/api/users";
import useSWRMutation from "swr/mutation";

export const useCreateUser = (
    option?: any
  ) =>
    useSWRMutation(
      'createUser',
      async (_: any, { arg }: { arg: User }) => await createUser(arg),
      option
    );
  
import { UserRelated } from "@/interfaces/api";
import { createUserRelated } from "@/lib/api/userRelated";
import useSWRMutation from "swr/mutation";

export const useCreateUserRelated = (option?: any) =>
  useSWRMutation(
    "createUserRelated",
    async (_: any, { arg }: { arg: UserRelated }) =>
      await createUserRelated(arg),
    option
  );

export const useCreateUserRelatedMultiple = (option?: any) =>
  useSWRMutation(
    "createUserRelatedMultiple",
    async (_: any, { arg }: { arg: UserRelated[] }) => {
      const res: any[] = [];
      arg.map((item) => res.push(createUserRelated(item)))
      
      return Promise.all(res)
    },
    option
  );

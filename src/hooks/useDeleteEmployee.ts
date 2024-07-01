import { deleteEmployee } from "@/lib/api/employees";
import useSWRMutation from "swr/mutation";

export const useDeleteEmployee = (option?: any) =>
  useSWRMutation(
    "deleteEmployee",
    async (_: any, { arg }: { arg: { id: string } }) =>
      await deleteEmployee(arg.id),
    option
  );

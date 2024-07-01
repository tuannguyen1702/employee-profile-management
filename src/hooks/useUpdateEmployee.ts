import { Employee } from "@/interfaces/api";
import { updateEmployee } from "@/lib/api/employees";
import useSWRMutation from "swr/mutation";

export const useUpdateEmployee = (option?: any) =>
  useSWRMutation(
    "updateEmployee",
    async (_: any, { arg }: { arg: { id: string, body: Employee } }) =>
      await updateEmployee(arg.id, arg.body),
    option
  );
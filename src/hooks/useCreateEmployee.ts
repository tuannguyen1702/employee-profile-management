import { Employee } from "@/interfaces/api";
import { createEmployee } from "@/lib/api/employees";
import useSWRMutation from "swr/mutation";

export const useCreateEmployee = (
    option?: any
  ) =>
    useSWRMutation(
      'createEmployee',
      async (_: any, { arg }: { arg: Employee }) => await createEmployee(arg),
      option
    );
  
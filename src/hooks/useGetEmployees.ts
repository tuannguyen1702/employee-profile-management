import { Employee, EmployeeQueryParams } from "@/interfaces/api";
import { getEmployees } from "@/lib/api/employees";
import useSWR, { SWRConfiguration } from "swr";

export const useGetEmployees = (params: EmployeeQueryParams, options?: SWRConfiguration<any>
  ) => {
    const response = useSWR(
      { key: 'getEmployees', params },
      async () => await getEmployees(params),
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        ...options,
      }
    );
  
    return response;
  };

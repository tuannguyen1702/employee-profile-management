import { EmployeeQueryParams } from "@/interfaces/api";
import { getPositionResources } from "@/lib/api/positionResources";
import useSWR, { SWRConfiguration } from "swr";

export const useGetPositionResources = (options?: SWRConfiguration<any>
  ) => {
    const response = useSWR(
      { key: 'getPositionResources'},
      async () => await getPositionResources(),
      {
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        ...options,
      }
    );
  
    return response;
  };

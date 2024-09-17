import { UserQueryParams } from "@/interfaces/api";
import { getUsers } from "@/lib/api/users";
import useSWR, { SWRConfiguration } from "swr";

export const useGetUsers = (params: UserQueryParams, options?: SWRConfiguration<any>
  ) => {
    const response = useSWR(
      { key: 'getUsers', params },
      async () => await getUsers(params),
      {
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        ...options,
      }
    );
  
    return response;
  };

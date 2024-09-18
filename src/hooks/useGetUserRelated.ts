import { getUserRelated } from "@/lib/api/userRelated";
import useSWR, { SWRConfiguration } from "swr";

export const useGetUserRelated = (options?: SWRConfiguration<any>
  ) => {
    const response = useSWR(
      { key: 'getUserRelated'},
      async () => await getUserRelated(),
      {
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        ...options,
      }
    );
  
    return response;
  };

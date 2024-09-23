import { getUserRelated } from "@/lib/api/userRelated";
import { userRelatedStore } from "@/stores/userRelatedStore";
import useSWR, { SWRConfiguration } from "swr";

export const useGetUserRelated = (options?: SWRConfiguration<any>
  ) => {
    const setUsers = userRelatedStore((state) => state.setUserRelated);
    const setLoading = userRelatedStore((state) => state.setLoading);
    
    const response = useSWR(
      { key: 'getUserRelated'},
      async () => await getUserRelated(),
      {
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        ...options,
        onSuccess: (res) => {
          setUsers(res.data);
          setLoading(false);
        },
        onError: () => {
          setLoading(false);
        },
      }
    );
  
    return response;
  };

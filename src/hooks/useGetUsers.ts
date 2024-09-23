import { UserQueryParams } from "@/interfaces/api";
import { getUsers } from "@/lib/api/users";
import { userStore } from "@/stores/userStore";
import useSWR, { SWRConfiguration } from "swr";

export const useGetUsers = (
  params: UserQueryParams,
  options?: SWRConfiguration<any>
) => {
  const setUsers = userStore((state) => state.setUsers);
  const setLoading = userStore((state) => state.setLoading);

  const { data, error, isValidating } = useSWR(
    { key: "getUsers", params },
    async () => await getUsers(params),
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

  if (isValidating) {
    setLoading(true);
  }

  return { data, error, isValidating };
};

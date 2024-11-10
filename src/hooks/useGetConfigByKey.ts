import { configKeys } from "@/const";
import { getConfigByKey } from "@/lib/api/config";
import { commissionConfigStore } from "@/stores/commissionConfig";
import useSWR, { SWRConfiguration } from "swr";

export const useGetConfigByKey = (
  key: string,
  options?: SWRConfiguration<any>
) => {
  const setCommissionData = commissionConfigStore(
    (state) => state.setCommissionConfig
  );

  const setCommissionType = commissionConfigStore(
    (state) => state.setCommissionType
  );
  const setLoading = commissionConfigStore((state) => state.setLoading);

  const response = useSWR(
    { key: `getConfigByKey_${key}`},
    async () => await getConfigByKey(key),
    {
      revalidateIfStale: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      ...options,
      onSuccess: (res) => {
        if(key === configKeys.COMMISSION_SETTING) setCommissionData(res.data);
        if(key === configKeys.COMMISSION_TYPE) setCommissionType(res.data);
        setLoading(false);
      },
      onError: () => {
        setLoading(false);
      },
    }
  );

  return response;
};

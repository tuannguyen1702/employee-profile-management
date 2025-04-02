import { UserSetting } from "@/interfaces/api";
import useSWRMutation from "swr/mutation";

export const useGetXUsers = (option?: any) =>
  useSWRMutation(
    "getXUsers",
    async (_: any, { arg }: { arg: UserSetting }) =>
      await fetch(
        `https://account.verbocapitalmarket.com/api/newcrm/getUserList`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            timestamp: arg.timestamp,
            token: arg.token,
          },
          body: JSON.stringify({
            page: 1,
            pageSize: 10000,
            msg: arg.msg,
          }),
        }
      ),
    option
  );

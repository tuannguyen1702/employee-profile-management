import { ConfigData } from "@/interfaces/api";
import { get, patch, post } from "./request";
import { configKeys } from "@/const";

const url = "/config";

export async function getConfigByKey(key: string): Promise<{
  data: ConfigData;
}> {
  const res = await get(`${url}/${key}`);
  return { data: res };
}

export async function createConfig(payload: {
  key: string;
  body: ConfigData;
}): Promise<{
  data: ConfigData;
}> {
  const res = await patch(`${url}/${payload.key}`, payload.body);
  return { data: res };
}

export async function updateConfig(body: ConfigData): Promise<{
  data: ConfigData;
}> {
  const res = await patch(`${url}/${configKeys.COMMISSION_SETTING}`, body);
  return { data: res };
}

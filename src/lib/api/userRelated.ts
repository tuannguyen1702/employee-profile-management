import { UserRelated } from "@/interfaces/api";
import { get, patch, post } from "./request";

const url = "/user-related";

export async function getUserRelated(): Promise<{
  data: UserRelated[];
}> {
  const res = await get(url);
  return { data: res };
}

export async function createUserRelated(body: UserRelated): Promise<{
  data: UserRelated;
}> {
  const res = await post(url, body);
  return { data: res };
}

export async function updateUserRelated(body: UserRelated): Promise<{
  data: UserRelated;
}> {
  const res = await patch(`${url}/${body.id}`, body);
  return { data: res };
}

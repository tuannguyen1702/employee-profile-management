
import { UserRelated } from "@/interfaces/api";
import { get, post } from "./request";

const url = '/userRelated'

export async function getUserRelated(): Promise<{
    data: UserRelated[];
  }> {
    const res = await get(url);
    return { data: res};
  }

  export async function createUserRelated(body: UserRelated): Promise<{
    data: UserRelated;
  }> {
    const res = await post(url, body);
    return { data: res };
  }
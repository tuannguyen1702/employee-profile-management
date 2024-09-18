
import { UserRelated } from "@/interfaces/api";
import { get } from "./request";

const url = '/userRelated'

export async function getUserRelated(): Promise<{
    data: UserRelated[];
  }> {
    const res = await get(url);
    return { data: res};
  }
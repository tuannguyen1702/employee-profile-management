
import { PositionResource } from "@/interfaces/api";
import { get } from "./request";

const url = '/positionResources'

export async function getPositionResources(): Promise<{
    data: PositionResource[];
  }> {
    const res = await get(url);
    return { data: res};
  }
import {
  User,
  UserQueryParams,
  PositionResource,
} from "@/interfaces/api";
import { del, get, patch, post, put } from "./request";

const url = "/users";

export async function createUser(body: User): Promise<{
  data: PositionResource[];
}> {
  const res = await post(url, body);
  return { data: res };
}

export async function deleteUser(id: string): Promise<{
  data: User;
}> {
  const res = await del(`${url}/${id}`);
  return { data: res };
}

export async function updateUser(id: string, body: User): Promise<{
  data: User;
}> {
  const res = await patch(`${url}/${id}`, body);
  return { data: res };
}

export async function getUserById(id: string): Promise<{
  data: User;
}> {
  const res = await get(`${url}/${id}`);
  return { data: res };
}

export async function getUsers(params: UserQueryParams): Promise<{
  data: User[];
}> {
  const res = await get(`${url}`, {
    queryParams: { ...params, _sort: "id", _order: "desc" },
  });
  return { data: res };
}

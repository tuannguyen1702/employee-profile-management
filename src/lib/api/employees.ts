import {
  Employee,
  EmployeeQueryParams,
  PositionResource,
} from "@/interfaces/api";
import { del, get, post } from "./request";

const url = "/employees";

export async function createEmployee(body: Employee): Promise<{
  data: PositionResource[];
}> {
  const res = await post(url, body);
  return { data: res };
}

export async function deleteEmployee(id: string): Promise<{
  data: PositionResource[];
}> {
  const res = await del(`${url}/${id}`);
  return { data: res };
}

export async function getEmployeeById(id: string): Promise<{
  data: Employee;
}> {
  const res = await get(`${url}/${id}`);
  return { data: res };
}

export async function getEmployees(params: EmployeeQueryParams): Promise<{
  data: Employee[];
}> {
  const res = await get(`${url}`, {
    queryParams: { ...params, _sort: "id", _order: "desc" },
  });
  return { data: res };
}

import { Employee, EmployeeQueryParams, PositionResource } from "@/interfaces/api";
import { get, post } from "./request";

const url = "/employees";

export async function createEmployee(body: Employee): Promise<{
  data: PositionResource[];
}> {
  const res = await post(url, body);
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
  const res = await get(`${url}`, { queryParams: params});
  return { data: res };
}
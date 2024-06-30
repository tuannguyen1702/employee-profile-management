
import { Employee, PositionResource } from "@/interfaces/api";
import { get, post } from "./request";

const url = '/employees'

export async function createEmployee(body: Employee): Promise<{
    data: PositionResource[];
  }> {
    const res = await post(url, body);

    console.log(res)

    return { data: res};

  }
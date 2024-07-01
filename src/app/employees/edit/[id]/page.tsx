'use client'

import { getPositionResources } from "@/lib/api/positionResources";
import { PositionResource } from "@/interfaces/api";
import EmployeeForm from "../../_components/EmployeeForm";
import { getEmployeeById } from "@/lib/api/employees";

export default async function CreateEmployee({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { data: employee } = await getEmployeeById(id);
  const { data } = await getPositionResources();

  const positionResources: Record<string, PositionResource> = {};

  data?.map((item) => {
    positionResources[item.positionResourceId] = item;
  });

  return <EmployeeForm formData={employee} positionResources={positionResources} />;
}

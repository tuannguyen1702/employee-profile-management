'use client'

import { getPositionResources } from "@/lib/api/positionResources";
import EmployeeForm from "../_components/EmployeeForm";
import { PositionResource } from "@/interfaces/api";

export default async function CreateEmployee() {
  const { data } = await getPositionResources();

  const positionResources: Record<string, PositionResource> = {};

  data?.map((item) => {
    positionResources[item.positionResourceId] = item;
  });

  return <EmployeeForm positionResources={positionResources} />;
}

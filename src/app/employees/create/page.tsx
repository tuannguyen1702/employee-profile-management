import { getPositionResources } from "@/lib/api/positionResources";
import { get } from "@/lib/api/request";
import EmployeeForm from "../_components/EmployeeForm";
import { PositionResource } from "@/interfaces/api";

export default async function CreateEmployee() {
  const { data } = await getPositionResources();

  const positionResources: Record<string, PositionResource> = {};

  data?.map((item) => {
    positionResources[item.positionResourceId] = item;
  });

  console.log(`positionResources`, positionResources);
  return <EmployeeForm positionResources={positionResources} />;
}

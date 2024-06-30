import { getPositionResources } from "@/lib/api/positionResources";
import CreateEmployeeForm from "./_components/CreateEmployeeForm";
import { get } from "@/lib/api/request";

export default async function CreateEmployee() {
  const positionResources = await getPositionResources();
  //const res = await fetch(`api/positionResources`);

  //console.log(res)

  console.log(`positionResources`, positionResources);
  return (
   <CreateEmployeeForm />
  );
}
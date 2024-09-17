import { Suspense } from "react";
import EmployeeList from "./_components/EmployeeList";

export default function Employees() {
  return (
    <Suspense>
      <EmployeeList />
    </Suspense>
  );
}

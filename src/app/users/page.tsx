import { Suspense } from "react";
import UserList from "./_components/UserList";

export default function Employees() {
  return (
    <Suspense>
      <UserList />
    </Suspense>
  );
}

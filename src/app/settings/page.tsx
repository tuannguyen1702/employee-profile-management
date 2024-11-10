"use client";

import { Suspense } from "react";
import UserList from "./_components/UserList";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { environments } from "@/config";
import SettingPage from "./_components/SettingPage";

export default function Setting() {
  const { data: session, status } = useSession();

  const router  = useRouter();

  const userAdmin = environments?.userAdmin?.split(',');

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  
  if (!session || (session && !userAdmin?.includes(session?.user?.email ?? ''))) {
    router.push('/login')
  }

  return (
    <Suspense>
      <SettingPage />
    </Suspense>
  );
}

"use client";

import { useSession, signOut, signIn } from "next-auth/react";
import React from "react";

import { Button } from "@/components/ui/button";

const UserInfo = () => {
  const { data: session, status } = useSession();

  if (!session) return "";
  
  return (
    <div className="flex items-center gap-x-4">
      <p>Welcome, {session?.user?.email}</p>
      <Button className="bg-white hover:bg-white/80 text-black" onClick={() => signOut()}>Sign Out</Button>
    </div>
  );
};

export default UserInfo;

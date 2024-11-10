"use client";

import { useSession, signOut, signIn } from "next-auth/react";
import React from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const UserInfo = () => {
  const { data: session, status } = useSession();

  if (!session) return "";
  
  return (
    <div className="flex items-center gap-x-4">
      <p>Welcome, {session?.user?.email}</p>
      <Button className="bg-white hover:bg-white/80 text-black" onClick={() => signOut()}>Sign Out</Button>
      <Link href={'/settings'}><Button className="bg-white hover:bg-white/80 text-black">Settings</Button></Link>
    </div>
  );
};

export default UserInfo;

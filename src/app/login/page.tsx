import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { getSession } from "next-auth/react";

export default async function SignIn(req: any, res: any ) {
  return (
    <div className="grid justify-center pt-10">
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/" });
        }}
      >
        <Button variant="secondary" className="h-14 px-6 py-3 flex gap-x-3 border shadow-md" type="submit"><span>Sign in with Google </span><img className="h-full" src="https://authjs.dev/img/providers/google.svg" /></Button>
      </form>
    </div>
  );
}

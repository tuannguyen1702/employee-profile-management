import NextAuth, { Account, Profile } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { environments } from "./config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ?? "",
      style: {
        bg: "#ffffff",
        brandColor:  "#ffffff",
        text: "Sign In With Google",
        logo: "https://authjs.dev/img/providers/google.svg"
      }
    }),
  ],
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  theme: {
    colorScheme: "light",
  },
  callbacks: {
    async signIn({account, profile}:{account: Account | null; profile?: Profile | undefined;}) {
        const isAccount = account && profile
        const userAdmin = environments?.userAdmin?.split(',');
        if (isAccount && account.provider === "google") {
            return profile.email_verified && profile && profile.email && userAdmin?.includes(profile.email) 
          }
        return true // Do different verification for other providers that don't have `email_verified`
    }
  }
});

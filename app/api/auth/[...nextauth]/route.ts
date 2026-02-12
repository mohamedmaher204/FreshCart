import { nextauthConfig } from "@/lib/nextauth.config";
import NextAuth from "next-auth"

const handler = NextAuth(nextauthConfig);
export { handler as GET, handler as POST }
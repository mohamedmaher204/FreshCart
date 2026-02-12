import { getServerSession } from "next-auth";
import { nextauthConfig } from "./nextauth.config";

export async function getUserToken() {
    const session = await getServerSession(nextauthConfig);
    // @ts-ignore
    return session?.user?.userTokenfromBackend;
}

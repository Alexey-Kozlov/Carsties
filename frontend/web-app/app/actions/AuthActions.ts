import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route";
import { cookies, headers } from "next/headers";
import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";

export const GetSession = async () => {
    return await getServerSession(authOptions);
}

export const GetCurrentUser = async () =>{
    try {
        const session = await GetSession();

        if(!session) return null;
        
        return session.user;
    } catch (error) {
        return null;
        
    }
}

export const getTokenWorkaround = async () => {
    const req = {
        headers: Object.fromEntries(headers() as Headers),
        cookies: Object.fromEntries(cookies().getAll().map(p => [p.name, p.value]))
    } as NextApiRequest;

    return await getToken({req});
} 
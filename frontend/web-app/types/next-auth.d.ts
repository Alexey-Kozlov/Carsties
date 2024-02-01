import { DefaultSession } from "next-auth";

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            login: string;
        } & DefaultSession['user']
    }
    interface Profile {
        login: string;
    }
    interface User {
        login: string
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        login: string;
        access_token?: string;
    }
}
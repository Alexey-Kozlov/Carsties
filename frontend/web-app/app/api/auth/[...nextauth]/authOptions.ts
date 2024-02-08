import { NextAuthOptions } from "next-auth";
import DuendeIdentityServer6 from "next-auth/providers/duende-identity-server6";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
    providers: [
        DuendeIdentityServer6({
            id: 'id-server',
            clientId: 'nextApp',
            clientSecret: 'MySecret',
            issuer: process.env.ID_URL,
            authorization: {params: {scope:'openid profile auctionApp'}},
            idToken: true
        })
    ],
    callbacks:{
        async jwt({token, profile, account}){
            if(profile){
                token.login = profile.login;
            }
            if(account){
                token.access_token = account.access_token;
            }
            return token;
        },
        async session({session, token}) {
            if(token){
                session.user.login = token.login;
            }
            return session;
        }
    }
}
export default authOptions;
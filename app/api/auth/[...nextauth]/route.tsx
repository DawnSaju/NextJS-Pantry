import { prisma } from '../../../../lib/prisma'
import { session } from '../../../../lib/session'
import { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!

const authOption: NextAuthOptions = {
    session: {
      strategy: 'jwt',
    },
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
      GithubProvider({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      }),
    ],
    callbacks: {
      async jwt({ token, account, profile }) {
        if (account) {
          token.accessToken = account.access_token;
  
          if (profile?.email) {
            const user = await prisma.user.findUnique({
              where: { email: profile.email },
            });
            if (user) {
              token.id = user.id;
              token.image = user.image;
              token.name = user.name;
            }
          }
        }
        return token;
      },
      
      async session({ session, token }) {
        if (token) {
          session.user = token
        }
        return session;
      },
    },
  }
    
const handler = NextAuth(authOption)
export { handler as GET, handler as POST }

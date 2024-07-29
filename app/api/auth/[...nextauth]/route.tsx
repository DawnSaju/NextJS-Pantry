import { prisma } from '../../../../lib/prisma'
import { session } from '../../../../lib/session'
import { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!

console.log(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)

const authOption: NextAuthOptions = {
    session: {
      strategy: 'jwt',
    },
    providers: [
      GoogleProvider({
        clientId: "814261854319-f5rnp2faqis73t78cutcvfe3gckekv72.apps.googleusercontent.com",
        clientSecret: "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",
      }),
    ],
    callbacks: {
        async signIn({ account, profile }) {
          if (!profile?.email) {
            throw new Error('No profile')
          }
    
          await prisma.user.upsert({
            where: {
              email: profile.email,
            },
            create: {
              email: profile.email,
              name: profile.name,
            },
            update: {
              name: profile.name,
            },
          })
          return true
        },
        session,
        async jwt({ token, user, account, profile }) {
          if (profile) {
            const user = await prisma.user.findUnique({
              where: {
                email: profile.email,
              },
            })
            if (!user) {
              throw new Error('No user found')
            }
            token.id = user.id
          }
          return token
        },
      },
    }
    
const handler = NextAuth(authOption)
export { handler as GET, handler as POST }

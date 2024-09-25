import prisma from '@/lib/prisma'
import { getUser, updateUserActivity } from '@/lib/user'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import NextAuth, { NextAuthOptions, Session } from 'next-auth'
import { AdapterUser } from 'next-auth/adapters'
import GoogleProvider from 'next-auth/providers/google'

const googleClientId = process.env.GOOGLE_ID
const googleSecret = process.env.GOOGLE_SECRET
const nextAuthSecret = process.env.NEXTAUTH_SECRET

if (!googleClientId || !googleSecret)
  throw new Error('Google clientId and secret must be provided!')
if (!nextAuthSecret) throw new Error('nextAuthSecret must be provided!')

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleSecret
    })
  ],
  callbacks: {
    async session({ session, user }: { session: Session; user: AdapterUser }) {
      if (session.user !== undefined) {
        /* Get user from db */
        const { dbUser, success } = await getUser(user.id)
        if (!success || dbUser == undefined)
          throw new Error('Error fetching user from database!')

        /* Update users activity upon login */
        updateUserActivity(dbUser.id)

        /* Update default session.user with data from db */
        session.user.id = dbUser.id
        session.user.likes = dbUser.likes
        session.user.comments = dbUser.comments
        session.user.role = dbUser.role
        session.user.image = dbUser.image
      }
      return session
    }
  },
  secret: nextAuthSecret
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

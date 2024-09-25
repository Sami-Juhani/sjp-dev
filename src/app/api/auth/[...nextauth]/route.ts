import prisma from '@/lib/prisma'
import { getUser } from '@/lib/user'
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
        const dbUser = await getUser(user.id)
        session.user.id = user.id
        session.user.likes = dbUser?.likes || []
        session.user.comments = dbUser?.comments || []
        session.user.role = user.role
        session.user.image = user.image
      }
      return session
    }
  },
  secret: nextAuthSecret
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

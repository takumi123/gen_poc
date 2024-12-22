import NextAuth, { DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./lib/db"
import bcrypt from "bcryptjs"

type UserRole = "CLIENT" | "ENGINEER" | "ADMIN"

declare module "next-auth" {
  interface User {
    role?: UserRole
    displayName?: string
  }
  interface Session extends DefaultSession {
    user: {
      id: string
      role: UserRole
      displayName: string
    } & DefaultSession["user"]
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string
          }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && typeof user === 'object') {
        token.role = user.role as UserRole
        token.displayName = user.displayName
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user && token && typeof token === 'object') {
        session.user.id = token.id as string
        session.user.role = (token.role || 'CLIENT') as UserRole
        session.user.displayName = token.displayName as string || ''
      }
      return session
    }
  }
})

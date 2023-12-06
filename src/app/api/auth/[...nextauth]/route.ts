import NextAuth, { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import prisma from "@/lib/prismadb";
import { signJwtTokens } from "@/lib/jwt";
import { redirect } from "next/navigation";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Invalid Email or Password");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (!user || !user?.hashedPassword) {
          throw new Error("Invalid Email or Password");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
        if (!isCorrectPassword) {
          throw new Error("Invalid Email or Password");
        }

        const { hashedPassword, ...userNoPass } = user;
        const accessToken = signJwtTokens(
          userNoPass,
          process.env.JWT_SECRET_KEY as string,
          { expiresIn: "1h" }
        );
        const refreshToken = signJwtTokens(
          userNoPass,
          process.env.JWT_REFRESH_KEY as string,
          { expiresIn: "7d" }
        );
        const result = {
          ...userNoPass,
          accessToken,
          refreshToken,
        };

        return result;
      },
    }),
  ],

  callbacks: {
    async session({ session, token, user }) {
      //console.log("token", token as User);
      session.user = token as User;
      return session;
    },
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async signIn({ user, account, profile, email, credentials }) {
      const currentUser = user as User;
      const isAllowed = Boolean(currentUser.emailVerified);

      if (isAllowed) {
        return true;
      } else {
        return false;
      }
    },
  },
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

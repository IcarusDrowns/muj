// This is assumed to be in a file like `[...nextauth].ts` in your `pages/api/auth` directory.

import NextAuth, { AuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { compare } from 'bcrypt';
import prismadb from '@/libs/prismadb'; // Ensure this path is correct

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password required');
          }

          const user = await prismadb.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.hashedPassword) {
            throw new Error('Email does not exist');
          }

          const isCorrectPassword = await compare(credentials.password, user.hashedPassword);

          if (!isCorrectPassword) {
            throw new Error('Incorrect password');
          }

          // Include the role in the user object
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role // Assuming you have a role field in your user model
          };
        } catch (error) {
          console.error('Authorize error:', error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin', // Make sure this path is correct
  },
  debug: process.env.NODE_ENV === 'development',
  adapter: PrismaAdapter(prismadb),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      // Persist the user's role in the JWT token
      if (user?.role) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add the user's role to the session
      if (token.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
    encryption: true,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);

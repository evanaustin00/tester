import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from './app/lib/definitions';
import { NextApiRequest, NextApiResponse } from 'next';
// import bcrypt from '/home/felix_sebastian/padsi1/PADSI/node_modules/bcryptjs/index.js';
 
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
 

export function authenticateUser(email: string, password: string) {
  const validUsers = [
    { email: 'owner@nextmail.com', password: '123456', role: 'owner' },
    { email: 'pegawai@nextmail.com', password: '123456', role: 'pegawai' },
  ];

  return validUsers.find((user) => user.email === email && user.password === password) || null;
}


export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          // const passwordsMatch = await bcrypt.compare(password, user.password);
          // if (passwordsMatch) return user;
        }
        console.log('Invalid credentials');
        return null;
      },
      
    }),
    
  ],
  // callbacks:{

  // }
  
}
);
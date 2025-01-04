import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import dbconnect from "@/lib/dbConnect";
import User from "./model/user";
import Google from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
    };
  }

  interface JWT {
    id: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Google],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await dbconnect();

        let dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          dbUser = await User.create({
            email: user.email,
            name: user.name,
            image: user.image || "/avatar.jpg",
          });
        }
        user.id = dbUser._id.toString();

        return true;
      } catch (error) {
        console.error("Error Saving User to Database", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});

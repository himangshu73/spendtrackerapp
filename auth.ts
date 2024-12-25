import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import dbconnect from "@/lib/dbConnect";
import User from "./model/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await dbconnect();

        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          await User.create({
            email: user.email,
            name: user.name,
          });
        } else {
          await User.updateOne({ email: user.email }, { name: user.name });
        }
        return true;
      } catch (error) {
        console.error("Error Saving User to Database");
        return false;
      }
    },
  },
});

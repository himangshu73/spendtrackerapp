import { auth } from "@/auth";
import dbconnect from "@/lib/dbConnect";
import User from "@/model/user";

export default async function UserAvatar() {
  const session = await auth();

  if (!session?.user) return null;

  let userImage = "/avatar.jpg";
  try {
    await dbconnect();

    let dbUser = await User.findOne({ email: session.user.email });
    if (!dbUser) {
      console.log("No user found");
    } else {
      userImage = dbUser.image ?? "/avatar.jpg";
    }
  } catch (error) {
    console.log("No image found");
  }

  return (
    <div className="w-96 flex items-center gap-4 p-4 rounded-lg shadow-md bg-gray-100">
      <img
        src={userImage}
        alt="user avatar"
        className="w-16 h-16 rounded-full bg-gray-300 border-2"
      />

      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          {session.user.name}
        </h2>
        <h3 className="text-sm text-gray-600">{session.user.email}</h3>
      </div>
    </div>
  );
}

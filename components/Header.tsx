import Link from "next/link";
import SignIn from "./sign-in";
import SignOut from "./signout-button";
import { auth } from "@/auth";
import User from "@/model/user";

const Header = async () => {
  const session = await auth();
  if (!session) {
    return (
      <div className="flex bg-blue-500 justify-between p-4">
        <Link href="/">
          <h1 className="text-lg font-bold text-white">Himublog</h1>
        </Link>
        <div className="flex items-center">
          <SignIn />
        </div>
      </div>
    );
  }

  const sessionUser = session.user;
  const userId = sessionUser.id;
  const user = await User.findOne({ _id: userId });
  const userName = user.name;
  return (
    <div className="flex bg-blue-500 justify-between p-4">
      <Link href="/">
        <h1 className="text-lg font-bold text-white">Himublog</h1>
      </Link>
      <div className="flex items-center">
        <p className="text-white mr-4">
          <Link className="hover:text-gray-200" href={`/profile/${userId}`}>
            {userName}
          </Link>
        </p>
        <SignOut />
      </div>
    </div>
  );
};

export default Header;

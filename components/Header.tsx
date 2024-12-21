import Link from "next/link";
import SignIn from "./sign-in";
import SignOut from "./signout-button";
import { auth } from "@/auth";

const Header = async () => {
  const session = await auth();
  return (
    <div className="flex bg-blue-500 justify-between p-4">
      <Link href="/">
        <h1 className="text-lg font-bold text-white">Himublog</h1>
      </Link>

      <div className="flex items-center">
        {session ? (
          <p className="text-white mr-4">Welcome {session?.user?.name}</p>
        ) : null}
        {!session ? <SignIn /> : <SignOut />}
      </div>
    </div>
  );
};

export default Header;

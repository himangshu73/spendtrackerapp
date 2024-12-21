import SignIn from "@/components/sign-in";
import SignOut from "@/components/signout-button";
import UserAvatar from "@/components/UserAvatar";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Link href="/task">Task</Link>
      <UserAvatar />
    </>
  );
}

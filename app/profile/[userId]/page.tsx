import dbconnect from "@/lib/dbConnect";
import User from "@/model/user";
import Image from "next/image";
import Link from "next/link";

interface ProfilePageProps {
  params: {
    userId: string;
  };
}

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { userId } = params;
  let dbUser = null;

  try {
    await dbconnect();

    dbUser = await User.findOne({ _id: userId }).lean();
    if (!dbUser) {
      console.log("No User Found");
      return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <h1 className="text-2xl font-semibold text-gray-700">
            No User Found
          </h1>
        </div>
      );
    }
    console.log(dbUser);
  } catch (error) {
    console.error("Error fetching user:", error);
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <h1 className="text-2xl font-semibold text-red-600">
          Error fetching user data
        </h1>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        {dbUser.image && (
          <div className="flex justify-center">
            <Image
              src={dbUser.image}
              width={150}
              height={150}
              className="rounded-full"
              alt="Profile Picture"
            />
          </div>
        )}
        <h1 className="mt-4 text-center text-2xl font-semibold text-gray-800">
          {dbUser.name || "N/A"}
        </h1>
        <p className="mt-2 text-center text-gray-600">
          {dbUser.email || "N/A"}
        </p>
        <Link href="/profile/edit">Edit Profile Info</Link>
        {!dbUser.image && (
          <p className="mt-4 text-center text-gray-500">
            No Profile Image Available
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

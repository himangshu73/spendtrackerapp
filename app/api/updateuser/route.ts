import dbconnect from "@/lib/dbConnect";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import User from "@/model/user";
import UserProfile from "@/model/profile";

export async function PUT(req: NextRequest) {
  try {
    await dbconnect();
    const { name, username, dob, sex } = await req.json();
    console.log("Username received", name);

    const session = await auth();
    console.log("session", session);

    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // const user = session.user;

    // if (!user) {
    //   return NextResponse.json(
    //     { message: "User not found in the database" },
    //     { status: 404 }
    //   );
    // }

    const userId = session.user.id;
    console.log("UserId:", userId);

    if (!name && !username && !dob && !sex) {
      return NextResponse.json(
        {
          message: "At least one field is required for update.",
        },
        { status: 400 }
      );
    }

    const userUpdateFields: Record<string, any> = {};
    if (name) userUpdateFields.name = name;

    const userUpdateResult = await User.updateOne(
      { _id: userId },
      { $set: userUpdateFields }
    );

    const profileUpdateFields: Record<string, any> = {};
    if (username) profileUpdateFields.username = username;
    if (dob) profileUpdateFields.dob = dob;
    if (sex) profileUpdateFields.sex = sex;

    const profileUpdateResult = await UserProfile.updateOne(
      { userId },
      { $set: profileUpdateFields },
      { upsert: true }
    );

    return NextResponse.json({
      message: "Profile updated successfully",
      userUpdateResult,
      profileUpdateResult,
    });
  } catch (error) {
    console.error("Error updating user and profile", error);
    NextResponse.json({ message: "Failed to update" }, { status: 500 });
  }
}

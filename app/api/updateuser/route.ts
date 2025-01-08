import dbconnect from "@/lib/dbConnect";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import User from "@/model/user";
import UserProfile from "@/model/profile";

export async function PUT(req: NextRequest) {
  try {
    await dbconnect();
    const { name, username, dob, sex } = await req.json();

    const session = await auth();

    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;

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

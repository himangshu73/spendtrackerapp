import dbconnect from "@/lib/dbConnect";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import User from "@/model/user";
import mongoose from "mongoose";

export async function PUT(req: NextRequest) {
  try {
    await dbconnect();
    const { name } = await req.json();
    console.log("Name received", name);

    const session = await auth();
    console.log("session", session);

    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const user = session.user;

    if (!user) {
      return NextResponse.json(
        { message: "User not found in the database" },
        { status: 404 }
      );
    }

    const userId = user.id;
    console.log("UserId:", userId);
    const userIdObject = new mongoose.Types.ObjectId(userId);
    console.log("Type of userId:", typeof userId);
    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }
    const existingUser = await User.findOne({ _id: userId });
    console.log("Existing profile:", existingUser);

    if (!existingUser) {
      return NextResponse.json(
        { message: "Profile not found for the given userId" },
        { status: 404 }
      );
    }

    const updatedUser = await User.updateOne(
      { _id: userId },
      { $set: { name } }
    );
    console.log("Update result:", updatedUser);

    if (updatedUser.modifiedCount > 0) {
      return NextResponse.json({ message: "Profile updated" }, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "Failed to update" },
        { status: 500 }
      );
    }
  } catch (error) {
    NextResponse.json({ message: "Failed to update" }, { status: 500 });
  }
}

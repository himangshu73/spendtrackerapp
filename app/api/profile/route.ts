import dbconnect from "@/lib/dbConnect";
import Task from "@/model/task";
import UserProfile from "@/model/profile";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    await dbconnect();

    const session = await auth();

    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const user = session.user;

    if (!user) {
      return NextResponse.json(
        { message: "User not found in the database" },
        { status: 404 }
      );
    }
    const tasks = await UserProfile.findOne({ user: user.id });
    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks", error);
    return NextResponse.json(
      { message: "Error fetching tasks" },
      { status: 500 }
    );
  }
}

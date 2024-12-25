import dbconnect from "@/lib/dbConnect";
import Task from "@/model/task";
import User from "@/model/user";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    await dbconnect();

    const session = await auth();

    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (!session.user || !session.user.email) {
      return NextResponse.json(
        { message: "User email not found in session" },
        { status: 400 }
      );
    }
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found in the database" },
        { status: 404 }
      );
    }
    const tasks = await Task.find({ user: user?._id });
    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks", error);
    return NextResponse.json(
      { message: "Error fetching tasks" },
      { status: 500 }
    );
  }
}

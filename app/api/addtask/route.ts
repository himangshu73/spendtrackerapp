import dbconnect from "@/lib/dbConnect";
import Task from "@/model/task";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import User from "@/model/user";

export async function POST(request: Request) {
  try {
    await dbconnect();
    const session = await auth();
    console.log(session);
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { task } = await request.json();

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

    if (!task || task.trim() === "") {
      return NextResponse.json(
        { message: "Task content is required" },
        { status: 400 }
      );
    }

    const newTask = new Task({ task: task.trim(), user: user._id });
    await newTask.save();
    return NextResponse.json({ task: newTask }, { status: 201 });
  } catch (error) {
    console.error("Error adding task:", error);
    return NextResponse.json({ message: "Task Add Failed" }, { status: 500 });
  }
}

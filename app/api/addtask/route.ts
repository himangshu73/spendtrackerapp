import dbconnect from "@/lib/dbConnect";
import Task from "@/model/task";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    await dbconnect();
    const session = await auth();
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { task } = await request.json();

    const user = session.user;

    if (!user) {
      return NextResponse.json(
        { message: "User not found in session" },
        { status: 400 }
      );
    }

    if (!task || task.trim() === "") {
      return NextResponse.json(
        { message: "Task content is required" },
        { status: 400 }
      );
    }

    const newTask = new Task({ task: task.trim(), user: user.id });
    await newTask.save();
    return NextResponse.json({ task: newTask }, { status: 201 });
  } catch (error) {
    console.error("Error adding task:", error);
    return NextResponse.json({ message: "Task Add Failed" }, { status: 500 });
  }
}

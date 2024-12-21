import dbconnect from "@/lib/dbConnect";
import Task from "@/model/task";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    await dbconnect();
    const { id, task } = await request.json();

    if (!id || !task || typeof task !== "string" || !task.trim()) {
      return NextResponse.json({ message: "Invalid input" }, { status: 200 });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { task: task.trim() },
      { new: true }
    );
    if (!updatedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ task: updatedTask }, { status: 200 });
  } catch (error) {
    console.error("Error adding task:", error);
    return NextResponse.json({ message: "Task Add Failed" }, { status: 500 });
  }
}

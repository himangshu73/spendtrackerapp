import dbconnect from "@/lib/dbConnect";
import Task from "@/model/task";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await dbconnect();
    const { task } = await request.json();
    const newTask = new Task({ task: task });
    await newTask.save();
    return NextResponse.json({ task: newTask }, { status: 201 });
  } catch (error) {
    console.error("Error adding task:", error);
    return NextResponse.json({ message: "Task Add Failed" }, { status: 500 });
  }
}

import dbconnect from "@/lib/dbConnect";
import Task from "@/model/task";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    await dbconnect();
    const { id } = await req.json();
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error Deleting Task", error);
    return NextResponse.json(
      { message: "Error Deleting Task" },
      { status: 500 }
    );
  }
}

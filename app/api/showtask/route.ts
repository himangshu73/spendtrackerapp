import dbconnect from "@/lib/dbConnect";
import Task from "@/model/task";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    await dbconnect();
    const session = await auth();
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const tasks = await Task.find({ user: session.user?.id });
    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks", error);
    return NextResponse.json(
      { message: "Error fetching tasks" },
      { status: 500 }
    );
  }
}

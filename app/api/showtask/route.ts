import dbconnect from "@/lib/dbConnect";
import Task from "@/model/task";
import { NextResponse } from "next/server";

export async function GET() {
    try {
      await dbconnect();
      const tasks = await Task.find({});
      return NextResponse.json({ tasks }, { status: 200 });
    } catch (error) {
      console.error("Error fetching tasks", error);
      return NextResponse.json(
        { message: "Error fetching tasks" },
        { status: 500 }
      );
    }
  }
import dbconnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  dbconnect();
  return NextResponse.json(
    { message: "Connection Successfull" },
    { status: 200 }
  );
}

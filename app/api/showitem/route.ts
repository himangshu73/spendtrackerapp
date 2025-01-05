import dbconnect from "@/lib/dbConnect";
import Item from "@/model/item";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    await dbconnect();

    const session = await auth();

    if (!session)
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });

    const user = session.user;
    if (!user)
      return NextResponse.json(
        { message: "User not found in the database." },
        { status: 404 }
      );

    const item = await Item.find({ user: user.id });
    console.log(item);
    return NextResponse.json({ item }, { status: 200 });
  } catch (error) {
    console.error("Error fetching item:", error);
    return NextResponse.json(
      { message: "Error fetching items" },
      { status: 500 }
    );
  }
}

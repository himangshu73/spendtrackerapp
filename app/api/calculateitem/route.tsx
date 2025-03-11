import dbconnect from "@/lib/dbConnect";
import Item from "@/model/item";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import mongoose from "mongoose";

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
    const userId = user.id;
    console.log(userId);

    const totalCostForUser = async (userId: string) => {
      const result = await Item.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, totalCost: { $sum: "$price" } } },
      ]).exec();
      console.log(result);
      console.log(result.length);
      console.log(result[0].totalCost);

      return result.length > 0 ? result[0].totalCost : 0;
    };
    const totalCost = await totalCostForUser(userId);

    console.log(totalCost);

    return NextResponse.json({ totalCost }, { status: 200 });
  } catch (error) {
    console.error("Error fetching total cost:", error);
    return NextResponse.json(
      { message: "Error fetching total cost" },
      { status: 500 }
    );
  }
}

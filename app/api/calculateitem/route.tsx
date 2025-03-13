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

    const userCategory = await Item.distinct("category", {
      user: new mongoose.Types.ObjectId(userId),
    });

    console.log(userCategory);

    const categoryCosts = await Item.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$category", totalCost: { $sum: "$price" } } },
    ]).exec();

    console.log(categoryCosts);

    const costPerCategory = categoryCosts.reduce((acc, curr) => {
      acc[curr._id] = curr.totalCost;
      console.log(acc);
      return acc;
    }, {});

    console.log(costPerCategory);

    const totalCostResult = await Item.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalCost: { $sum: "$price" } } },
    ]).exec();

    const totalCost =
      totalCostResult.length > 0 ? totalCostResult[0].totalCost : 0;

    console.log(totalCost);

    return NextResponse.json({ totalCost, costPerCategory }, { status: 200 });
  } catch (error) {
    console.error("Error fetching total cost:", error);
    return NextResponse.json(
      { message: "Error fetching total cost" },
      { status: 500 }
    );
  }
}

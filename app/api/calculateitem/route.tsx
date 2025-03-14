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

    const userCategory = await Item.distinct("category", {
      user: new mongoose.Types.ObjectId(userId),
    });

    const categoryCosts = await Item.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$category", totalCost: { $sum: "$price" } } },
      { $sort: { totalCost: -1 } },
    ]).exec();

    const costPerCategory = categoryCosts.reduce((acc, curr) => {
      acc[curr._id] = curr.totalCost;
      return acc;
    }, {});

    const totalCostResult = await Item.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalCost: { $sum: "$price" } } },
    ]).exec();

    const totalCost =
      totalCostResult.length > 0 ? totalCostResult[0].totalCost : 0;

    const costlyItem = await Item.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$itemname", maxAmount: { $max: "$price" } } },
      { $sort: { maxAmount: -1 } },
      { $limit: 1 },
    ]);

    const expensiveItem = costlyItem[0];

    return NextResponse.json(
      { totalCost, costPerCategory, expensiveItem },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching total cost:", error);
    return NextResponse.json(
      { message: "Error fetching total cost" },
      { status: 500 }
    );
  }
}

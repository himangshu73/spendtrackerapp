import dbconnect from "@/lib/dbConnect";
import Item from "@/model/item";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    await dbconnect();

    // Authenticate user
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = session.user;
    if (!user) {
      return NextResponse.json(
        { status: "error", message: "User not found in session" },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const { itemname, quantity, unit, price, category } = await req.json();
    if (!itemname?.trim() || !category?.trim()) {
      return NextResponse.json(
        { status: "error", message: "Item name and category are required" },
        { status: 400 }
      );
    }
    if (!quantity || !unit || !price) {
      return NextResponse.json(
        { status: "error", message: "Quantity, unit, and price are required" },
        { status: 400 }
      );
    }

    // Create and save new item
    const newItem = new Item({
      itemname: itemname.trim(),
      category: category.trim(),
      quantity,
      unit,
      price,
      user: user.id,
    });

    await newItem.save();
    console.info("Item added successfully:", newItem);

    return NextResponse.json(
      { status: "success", item: newItem },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding item:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to add item" },
      { status: 500 }
    );
  }
}

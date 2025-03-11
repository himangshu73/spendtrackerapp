import dbconnect from "@/lib/dbConnect";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import Item from "@/model/item";

export async function PUT(req: NextRequest) {
  try {
    await dbconnect();

    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = session.user;
    if (!user) {
      return NextResponse.json(
        { status: "error", message: "User not found in session" },
        { status: 400 }
      );
    }

    const { _id, itemname, quantity, unit, price, category } = await req.json();

    if (!_id) {
      return NextResponse.json(
        { status: "error", message: "Item ID is required." },
        { status: 400 }
      );
    }

    if (!itemname.trim() || !category.trim()) {
      return NextResponse.json(
        { status: "error", message: "Item name and category are required." },
        { status: 500 }
      );
    }

    if (!quantity || !unit || !price) {
      return NextResponse.json(
        { status: "error", message: "Quantity, unit and price are required." },
        { status: 400 }
      );
    }

    const updatedItem = await Item.findOneAndUpdate(
      {
        _id,
        user: user.id,
      },
      {
        itemname: itemname.trim(),
        category: category.trim(),
        quantity,
        unit,
        price,
      }
    );

    if (!updatedItem) {
      return NextResponse.json(
        { status: "error", message: "Item not found or unauthorized." },
        { status: 404 }
      );
    }

    console.info("Item updated successfully:", updatedItem);

    return NextResponse.json(
      { status: "success", item: updatedItem },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating item:", error);
    NextResponse.json({ message: "Failed to update" }, { status: 500 });
  }
}

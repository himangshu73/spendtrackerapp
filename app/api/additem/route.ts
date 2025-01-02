import dbconnect from "@/lib/dbConnect";
import Item from "@/model/item";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    await dbconnect();

    const session = await auth();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = session?.user;

    if (!user) {
      return NextResponse.json(
        { message: "User not found in sessison" },
        { status: 400 }
      );
    }

    const { itemname, quantity, unit, price } = await req.json();

    if (!itemname || !quantity || !unit || !price || itemname.trim() === "") {
      return NextResponse.json(
        { message: "Item is required" },
        { status: 400 }
      );
    }

    const newItem = new Item({
      itemname: itemname.trim(),
      quantity: quantity,
      unit: unit,
      price: price,
      user: user.id,
    });

    await newItem.save();
    console.log("Item added successfully.");

    return NextResponse.json({ item: newItem }, { status: 201 });
  } catch (error) {
    console.error("Error adding item.", error);
    return NextResponse.json({ message: "Item add failed" }, { status: 500 });
  }
}

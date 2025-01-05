import dbconnect from "@/lib/dbConnect";
import Item from "@/model/item";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    await dbconnect();

    const { id } = await req.json();
    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) {
      return NextResponse.json({ message: "Item not found" });
    }

    return NextResponse.json(
      { message: "Item deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting item", error);
    return NextResponse.json(
      { message: "Error Deleting Item" },
      { status: 500 }
    );
  }
}

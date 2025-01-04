import dbconnect from "@/lib/dbConnect";
import Item from "@/model/item";
import { NextResponse } from "next/server";

const ALLOWED_FIELDS = ["itemname", "category"];

export async function GET(req: Request) {
  try {
    await dbconnect();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    console.log("Query Received:", query);
    const field = searchParams.get("field") || "";
    console.log("Field Receied:", field);

    if (!ALLOWED_FIELDS.includes(field)) {
      return NextResponse.json(
        { message: "Incorrect Field", suggestions: [] },
        { status: 400 }
      );
    }

    if (!query) {
      return NextResponse.json(
        { messsage: "Query is required", suggestions: [] },
        { status: 400 }
      );
    }
    const exactMatch = await Item.findOne({ itemname: query.trim() });

    const categorySuggestions = exactMatch
      ? []
      : await Item.find({
          category: { $regex: query, $options: "i" },
        }).distinct("category");

    const suggestions = await Item.find({
      [field]: { $regex: query, $options: "i" },
    }).distinct(field);

    return NextResponse.json(
      { status: "success", exactMatch, suggestions, categorySuggestions },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching autocomplete suggestions.", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch suggestions" },
      { status: 500 }
    );
  }
}

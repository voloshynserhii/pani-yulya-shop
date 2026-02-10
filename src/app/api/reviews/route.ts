import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Review from "@/models/Review";

export async function GET() {
  try {
    await dbConnect();
    const reviews = await Review.find({ validated: true }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

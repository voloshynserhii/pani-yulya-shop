import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Review from "@/models/Review";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, text } = await req.json();

    if (!name || !text) {
      return NextResponse.json(
        { success: false, error: "Name and text are required" },
        { status: 400 }
      );
    }

    const newReview = await Review.create({ name, text, validated: false });
    revalidatePath("/");
    
    return NextResponse.json({ success: true, review: newReview });
  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add review" },
      { status: 500 }
    );
  }
}
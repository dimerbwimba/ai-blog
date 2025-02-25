import { PostService } from "@/services/post.service";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;

    const result = await PostService.getPublicTravelGuides(page, limit);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[TRAVEL_GUIDES_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
import { CategoryService } from "@/services/category.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await CategoryService.getAllPublicCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("[CATEGORIES_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
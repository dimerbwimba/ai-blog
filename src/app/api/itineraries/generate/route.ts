import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GeminiService } from "@/services/gemini.service";
import { z } from "zod";

const generateItinerarySchema = z.object({
  city: z.string().min(1, "City is required"),
  travelType: z.enum(["BUDGET", "STANDARD", "LUXURY"], {
    required_error: "Travel type is required",
  }),
  duration: z.enum(["1_DAY", "3_DAYS", "1_WEEK", "2_WEEKS"], {
    required_error: "Duration is required",
  }),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = generateItinerarySchema.parse(body);

    const result = await GeminiService.generateItinerary(validatedData);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("[GENERATE_ITINERARY_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to generate itinerary" },
      { status: 500 }
    );
  }
} 
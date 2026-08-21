import { NextRequest, NextResponse } from "next/server";
import { tripRepo, ensureSeeded } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import type { TravelStyle } from "@/types/index";

// GET /api/trips?search=bali
export async function GET(request: NextRequest) {
  ensureSeeded();

  const search = request.nextUrl.searchParams.get("search") ?? undefined;
  const trips = tripRepo.findAll(search || undefined);

  return NextResponse.json({ success: true, count: trips.length, trips });
}

// POST /api/trips  (protected)
export async function POST(request: NextRequest) {
  ensureSeeded();

  const authUser = getAuthUser(request);
  if (!authUser) {
    return NextResponse.json(
      { success: false, message: "Access denied. Please log in." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { title, destination, dates, budget, spots, style, description } =
      body as {
        title?: string;
        destination?: string;
        dates?: string;
        budget?: string;
        spots?: number | string;
        style?: TravelStyle;
        description?: string;
      };

    if (!title || !destination) {
      return NextResponse.json(
        { success: false, message: "title and destination are required." },
        { status: 400 }
      );
    }

    const spotsNumber = Number(spots);
    const trip = tripRepo.create({
      title,
      destination,
      dates,
      budget,
      style,
      description,
      spots: Number.isFinite(spotsNumber) && spotsNumber > 0 ? spotsNumber : 1,
      hostId: authUser.id,
      host: authUser.name || authUser.email,
    });

    return NextResponse.json(
      { success: true, message: "Trip created.", trip },
      { status: 201 }
    );
  } catch (err) {
    console.error("Create trip error:", err);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
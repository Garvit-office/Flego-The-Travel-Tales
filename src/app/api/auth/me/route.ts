import { NextRequest, NextResponse } from "next/server";
import { userRepo, ensureSeeded } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  ensureSeeded();

  const authUser = getAuthUser(request);
  if (!authUser) {
    return NextResponse.json(
      { success: false, message: "Not authenticated." },
      { status: 401 }
    );
  }

  const user = userRepo.findById(authUser.id);
  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, user: userRepo.toPublic(user) });
}

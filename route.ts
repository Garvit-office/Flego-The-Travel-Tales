import { NextRequest, NextResponse } from "next/server";
import { userRepo, ensureSeeded } from "@/lib/db";
import { hashPassword, signToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  ensureSeeded();

  try {
    const body = await request.json();
    const { name, email, password } = body as {
      name?: string;
      email?: string;
      password?: string;
    };

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "name, email, and password are all required.",
        },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }
    if (userRepo.findByEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with that email already exists.",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const user = userRepo.create({ name, email, password: hashedPassword });
    const token = signToken(user);

    const response = NextResponse.json(
      {
        success: true,
        message: "Account created.",
        token,
        user: userRepo.toPublic(user),
      },
      { status: 201 }
    );

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}

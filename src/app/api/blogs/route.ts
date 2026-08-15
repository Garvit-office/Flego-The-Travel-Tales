import { NextResponse } from "next/server";
import { blogRepo, ensureSeeded } from "@/lib/db";

export async function GET() {
  ensureSeeded();

  const blogs = blogRepo.findAll();

  return NextResponse.json({ success: true, count: blogs.length, blogs });
}

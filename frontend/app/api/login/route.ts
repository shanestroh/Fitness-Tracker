import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const appPassword = process.env.APP_PASSWORD;

  if (!appPassword) {
    return new NextResponse("APP_PASSWORD is not configured", { status: 500 });
  }

  if (password !== appPassword) {
    return new NextResponse("Incorrect password", { status: 401 });
  }

  const res = NextResponse.json({ success: true });

  res.cookies.set("app_auth", "ok", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
}
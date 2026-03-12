import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const appPasswordHash = process.env.APP_PASSWORD_HASH;

  if (!appPasswordHash) {
    return new NextResponse("APP_PASSWORD_HASH is not configured", { status: 500 });
  }

  const valid = await bcrypt.compare(password, appPasswordHash);

  if (!valid) {
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
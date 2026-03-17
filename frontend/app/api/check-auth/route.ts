import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("app_auth");

  if (!authCookie) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
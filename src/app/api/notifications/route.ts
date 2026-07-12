import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserNotifications } from "@/actions/notifications";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Optionally support limit query param
  const url = new URL(request.url);
  const limitParam = url.searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam) : 10;

  const list = await getUserNotifications();
  const sliced = list.slice(0, limit);
  return NextResponse.json(sliced);
}

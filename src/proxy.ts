import { NextRequest, NextResponse } from "next/server";

const CANONICAL_HOST = "anadi.ca";

function isLocalPreviewHost(hostname: string) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".ngrok-free.app") ||
    hostname.endsWith(".ngrok-free.dev")
  );
}

export function proxy(request: NextRequest) {
  const hostname = request.nextUrl.hostname.toLowerCase();
  const protocol = (request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "")).toLowerCase();

  if (isLocalPreviewHost(hostname) || (hostname !== CANONICAL_HOST && hostname !== `www.${CANONICAL_HOST}`)) {
    return NextResponse.next();
  }

  if (hostname === CANONICAL_HOST && protocol === "https") {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.protocol = "https";
  url.hostname = CANONICAL_HOST;

  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next/).*)"],
};

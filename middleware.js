import { NextResponse } from "next/server";

export function middleware(request) {
  if (request.nextUrl.pathname === "/") {
    return NextResponse.rewrite(new URL("/convite.html", request.url));
  }
}

export const config = { matcher: "/" };

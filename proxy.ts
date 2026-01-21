import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserCountry } from "./lib/config/ip-info-country";

export default clerkMiddleware(async (auth, req, next) => {
  const protectedRoutes = createRouteMatcher(["/dashboard", "/dashboard(.*)"]);
  if (protectedRoutes(req)) await auth.protect();

  // Creating a basic response
  let response = NextResponse.next();

  // -------- Handle country detection -------------
  // 1 check if country is already set in cookie
  const countryCookie = req.cookies.get("userCountry");

  if (countryCookie) {
    //  if the user has already selected a country, use that for subsequent requests
    response = NextResponse.next();
  } else {
    response = NextResponse.redirect(new URL(req.url));

    // 2 get the user country using the helper funciton
    const userCountry = await getUserCountry();

    // 3 set a cookie with the detected or default country for future requests
    response.cookies.set("userCountry", JSON.stringify(userCountry), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

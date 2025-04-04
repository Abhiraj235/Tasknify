import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  "/onboarding(.*)",
  "/organisation(.*)",
  "/project(.*)",
  "/issue(.*)",
  "/sprint(.*)",
]);

export default clerkMiddleware((auth, req) => {
  const pathname = req.nextUrl.pathname;

  // Case 1: User not logged in and accessing a protected route
  if (!auth().userId && isProtectedRoute(pathname)) {
    return auth().redirectToSignIn();
  }

  // Case 2: User logged in but not in any organization
  if (
    auth().userId &&
    !auth().orgId &&
    pathname !== "/onboarding" &&
    pathname !== "/"
  ) {
    const onboardingUrl = new URL("/onboarding", req.url);
    return NextResponse.redirect(onboardingUrl);
  }

  // Default: continue as normal
  return NextResponse.next();
});

// Apply middleware to these routes
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

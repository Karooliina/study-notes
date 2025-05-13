import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { checkAuth } from "./actions";

const publicRoutes = ["/", "/sign-in", "/sign-up"];

const protectedRoutes = ["/dashboard", "/notes", "/notes/create", "/notes/:id"];

type CustomRequest = NextRequest & {
  user?: string;
};

export async function middleware(request: CustomRequest) {
  const { user } = await checkAuth();

  if (protectedRoutes.includes(request.nextUrl.pathname) && !user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

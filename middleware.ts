import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Allow all requests to pass through
  // Authentication is handled by NextAuth on the API routes
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
};

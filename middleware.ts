import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const access = request.cookies.get('access')?.value;
  const { pathname } = request.nextUrl;

  // Publicly accessible routes
  const publicRoutes = ['/login', '/api/debug-telegram'];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow access to static assets & PWA files
  const isStaticAsset = pathname.startsWith('/_next') ||
                        pathname.startsWith('/icons') ||
                        pathname.endsWith('.ico') ||
                        pathname.endsWith('.png') ||
                        pathname.endsWith('.json') ||
                        pathname.endsWith('.js');

  if (isStaticAsset) return NextResponse.next();

  // Redirect to login if no access cookie
  if (!access) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/((?!_next|favicon.ico|manifest.json|icons|sw.js).*)'],
};

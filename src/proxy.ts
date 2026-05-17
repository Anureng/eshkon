import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const role = request.cookies.get('role')?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/studio')) {
    if (role === 'editor' || role === 'publisher') {
      return NextResponse.next();
    }
    // redirect to preview if not editor/publisher
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace('/studio/', '/preview/');
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith('/api/publish')) {
    if (role !== 'publisher') {
      return new NextResponse('Forbidden', { status: 403 });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/studio/:path*', '/api/publish'],
};

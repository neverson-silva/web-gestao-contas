import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
	if (request.nextUrl.pathname.trim() === '/') {
		return NextResponse.rewrite(new URL('/dashboard', request.url))
	}
}

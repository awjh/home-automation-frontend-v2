import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'
import RedirectSearchParam from '@constants/RedirectSearchParam'

export function proxy(req: NextRequest) {
    const jwt = req.cookies.get('stytch_session_jwt')?.value

    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set(RedirectSearchParam, req.nextUrl.pathname)

    // No token → redirect immediately
    if (!jwt) {
        return NextResponse.redirect(loginUrl)
    }

    const { exp } = jwtDecode(jwt)

    if (!exp) {
        return NextResponse.redirect(loginUrl)
    }

    if (exp * 1000 < Date.now()) {
        return NextResponse.redirect(loginUrl)
    }

    // Let request continue (verification happens later)
    return NextResponse.next()
}

// Protect specific routes
export const config = {
    matcher: ['/meal-plans'],
}

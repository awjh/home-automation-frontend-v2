import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'
import RedirectSearchParam from '@constants/RedirectSearchParam'
import { stytchClient } from '@utils/requireAuth'

const SessionJwtCookie = 'stytch_session_jwt'

// Session JWTs only live for 5 minutes. The browser SDK refreshes them on a timer, but that timer
// is throttled in background tabs and paused while devices sleep, so an expired JWT here usually
// still belongs to a live session. Exchange it for a fresh one rather than logging the user out
async function refreshSessionJwt(jwt: string) {
    try {
        const { session_jwt, session } = await stytchClient.sessions.authenticate({
            session_jwt: jwt,
        })

        return {
            jwt: session_jwt,
            expires: session.expires_at ? new Date(session.expires_at) : undefined,
        }
    } catch {
        return undefined
    }
}

export async function proxy(req: NextRequest) {
    const jwt = req.cookies.get(SessionJwtCookie)?.value

    const loginUrl = new URL('/login', req.url)
    // Keep the query string, as the OAuth authorize page carries its whole request in it
    loginUrl.searchParams.set(RedirectSearchParam, `${req.nextUrl.pathname}${req.nextUrl.search}`)

    // No token → redirect immediately
    if (!jwt) {
        return NextResponse.redirect(loginUrl)
    }

    const { exp } = jwtDecode(jwt)

    if (!exp) {
        return NextResponse.redirect(loginUrl)
    }

    if (exp * 1000 >= Date.now()) {
        // Let request continue (verification happens later)
        return NextResponse.next()
    }

    const refreshed = await refreshSessionJwt(jwt)

    if (!refreshed) {
        return NextResponse.redirect(loginUrl)
    }

    // Update the request cookie so server components and actions forward the fresh JWT to the API
    req.cookies.set(SessionJwtCookie, refreshed.jwt)

    const res = NextResponse.next({ request: { headers: req.headers } })

    // Matches the cookie the browser SDK writes, which it must stay able to read and replace
    res.cookies.set(SessionJwtCookie, refreshed.jwt, {
        path: '/',
        expires: refreshed.expires,
        sameSite: 'lax',
        secure: req.nextUrl.protocol === 'https:',
    })

    return res
}

// Protect specific routes
export const config = {
    matcher: ['/', '/meal-plans/:path*', '/recipes/:path*', '/records/:path*', '/oauth/authorize'],
}

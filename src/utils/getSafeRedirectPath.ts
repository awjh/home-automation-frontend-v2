// Only allows redirects back into this site, so a crafted ?redirect= can't send someone off to
// another site after they log in. Parsing against our origin also catches tricks a "starts with /"
// check misses, such as //evil.com and /\evil.com, which browsers treat as other hosts
export default function getSafeRedirectPath(redirect: string | null, fallback = '/'): string {
    if (!redirect) {
        return fallback
    }

    try {
        const url = new URL(redirect, window.location.origin)

        if (url.origin !== window.location.origin) {
            return fallback
        }

        return `${url.pathname}${url.search}${url.hash}`
    } catch {
        return fallback
    }
}

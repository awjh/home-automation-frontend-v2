// Stytch's authorization server metadata advertises authorization_response_iss_parameter_supported,
// but its authorize redirect leaves the iss out. RFC 9207 tells clients such as Claude to reject a
// redirect without one in that case, so add it ourselves. Left alone if Stytch ever starts sending it
export default function addIssuerToRedirect(redirectUri: string, issuer: string): string {
    const url = new URL(redirectUri)

    if (!url.searchParams.has('iss')) {
        url.searchParams.set('iss', issuer)
    }

    return url.toString()
}

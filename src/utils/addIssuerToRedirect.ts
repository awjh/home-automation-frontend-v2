// Stytch's authorization server metadata advertises authorization_response_iss_parameter_supported,
// but the iss on its authorize redirect doesn't match the issuer in that metadata. RFC 9207 tells
// clients such as Claude to reject the redirect in that case, so set it to the advertised issuer
export default function addIssuerToRedirect(redirectUri: string, issuer: string): string {
    const url = new URL(redirectUri)

    url.searchParams.set('iss', issuer)

    return url.toString()
}

'use client'

import { ChakraProvider } from '@chakra-ui/react'
import system from '../theme/system'
import { ThemeProvider } from 'next-themes'
import { createStytchClient, StytchProvider } from '@stytch/nextjs'
import Toaster from '@atoms/Toaster/Toaster'
import addIssuerToRedirect from '@utils/addIssuerToRedirect'

const stytch = createStytchClient(process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN!, {
    keepSessionAlive: true,
})

// The OAuth authorize page's IdentityProvider redirects straight to whatever this returns, so this
// is the only place to correct the iss Stytch sends. The issuer is the project domain, matching
// the issuer in its authorization server metadata
const stytchIssuer = process.env.NEXT_PUBLIC_STYTCH_DOMAIN

if (stytchIssuer) {
    const oauthAuthorizeSubmit = stytch.idp.oauthAuthorizeSubmit

    stytch.idp.oauthAuthorizeSubmit = async (data) => {
        const response = await oauthAuthorizeSubmit(data)

        return {
            ...response,
            redirect_uri: addIssuerToRedirect(response.redirect_uri, stytchIssuer),
        }
    }
}

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ChakraProvider value={system}>
            <StytchProvider stytch={stytch} assumeHydrated={false}>
                <ThemeProvider attribute="class" disableTransitionOnChange>
                    {children}
                    <Toaster />
                </ThemeProvider>
            </StytchProvider>
        </ChakraProvider>
    )
}

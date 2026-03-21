'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'
import { createStytchClient, StytchProvider } from '@stytch/react'
import Toaster from '@atoms/Toaster/Toaster'

const stytch = createStytchClient(process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN!)

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ChakraProvider value={defaultSystem}>
            <StytchProvider stytch={stytch} assumeHydrated={false}>
                <ThemeProvider attribute="class" disableTransitionOnChange>
                    {children}
                    <Toaster />
                </ThemeProvider>
            </StytchProvider>
        </ChakraProvider>
    )
}

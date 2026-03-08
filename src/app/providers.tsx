'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'
import { createStytchClient, StytchProvider } from '@stytch/react'

const stytch = createStytchClient(process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN!)

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ChakraProvider value={defaultSystem}>
            <StytchProvider stytch={stytch}>
                <ThemeProvider attribute="class" disableTransitionOnChange>
                    {children}
                </ThemeProvider>
            </StytchProvider>
        </ChakraProvider>
    )
}

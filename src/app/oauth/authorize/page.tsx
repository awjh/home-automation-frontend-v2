'use client'

import { VStack } from '@chakra-ui/react'
import NavBar from '@features/NavBar/NavBar'
import { IdentityProvider } from '@stytch/nextjs'

// The Authorization URL set in Stytch Connected Apps. Apps such as Claude send the user here to
// approve access, and IdentityProvider reads the OAuth request from the query string. The proxy
// sends logged out users to /login first and back here with the query string intact
export default function Authorize() {
    return (
        <VStack width={'100vw'} minHeight={'100vh'}>
            <NavBar showLinks={false} />
            <VStack p={4} justifyContent={'center'}>
                <IdentityProvider />
            </VStack>
        </VStack>
    )
}

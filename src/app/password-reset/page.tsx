'use client'

import { VStack } from '@chakra-ui/react'
import { useStytch } from '@stytch/react'
import { useRouter } from 'next/navigation'
import PasswordResetForm from '@organisms/PasswordResetForm/PasswordResetForm'

export default function PasswordReset() {
    const stytch = useStytch()
    const router = useRouter()
    const parsed = stytch.parseAuthenticateUrl()

    if (!parsed?.token) {
        return <div>Invalid password reset link</div>
    }

    const handlePasswordReset = async (password: string) => {
        await stytch.passwords.resetByEmail({
            token: parsed.token,
            password,
            session_duration_minutes: 60,
        })
        router.push('/login')
    }

    return (
        <VStack
            alignItems={'center'}
            justifyContent={'center'}
            width={'100vw'}
            minHeight={'100vh'}
            padding={4}
        >
            <PasswordResetForm onSubmit={handlePasswordReset} />
        </VStack>
    )
}

'use client'

import { useEffect, useState } from 'react'
import { VStack } from '@chakra-ui/react'
import { useStytch } from '@stytch/react'
import { useRouter } from 'next/navigation'
import PasswordResetForm from '@organisms/PasswordResetForm/PasswordResetForm'
import useToaster from '@hooks/useToaster'
import NavBar from '@organisms/NavBar/NavBar'

export default function PasswordReset() {
    const stytch = useStytch()
    const router = useRouter()
    const toaster = useToaster()
    const [parsed, setParsed] = useState<ReturnType<typeof stytch.parseAuthenticateUrl>>(null)

    useEffect(() => {
        setParsed(stytch.parseAuthenticateUrl())
    }, [stytch])

    if (!parsed?.token) {
        return <div>Invalid password reset link</div>
    }

    const handlePasswordReset = async (password: string) => {
        await stytch.passwords.resetByEmail({
            token: parsed.token,
            password,
            session_duration_minutes: 60,
        })

        const toastId = toaster.create({
            title: 'Password reset successful',
            description: 'Redirecting to login in 5 seconds...',
            type: 'loading',
            duration: Infinity,
        })

        let remaining = 5
        const interval = setInterval(() => {
            remaining -= 1
            if (remaining <= 0) {
                clearInterval(interval)
                toaster.update(toastId, {
                    title: 'Password reset successful',
                    description: 'Redirecting now...',
                    type: 'success',
                    duration: 1000,
                })
                router.push('/login')
            } else {
                toaster.update(toastId, {
                    title: 'Password reset successful',
                    description: `Redirecting to login in ${remaining} second${remaining !== 1 ? 's' : ''}...`,
                    type: 'loading',
                    duration: Infinity,
                })
            }
        }, 1000)
    }

    return (
        <VStack width={'100vw'} minHeight={'100vh'}>
            <NavBar />
            <VStack p={4} justifyContent={'center'}>
                <PasswordResetForm onSubmit={handlePasswordReset} />
            </VStack>
        </VStack>
    )
}

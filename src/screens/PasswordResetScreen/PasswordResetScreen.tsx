'use client'

import { Box, Heading, Text, VStack } from '@chakra-ui/react'
import NavBar from '@features/NavBar/NavBar'
import PasswordReset from '@features/PasswordReset/PasswordReset'
import useToaster from '@hooks/useToaster'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export type PasswordResetScreenProps = {
    isValidLink: boolean
    onSubmit: (password: string) => Promise<void>
    redirectOnSuccess: string
}

function getRedirectDescription(secondsRemaining: number) {
    if (secondsRemaining <= 0) {
        return 'Redirecting now...'
    }

    return `Redirecting to login in ${secondsRemaining} second${secondsRemaining !== 1 ? 's' : ''}...`
}

export default function PasswordResetScreen({
    isValidLink,
    onSubmit,
    redirectOnSuccess,
}: PasswordResetScreenProps) {
    const toaster = useToaster()
    const router = useRouter()
    const [redirectSecondsRemaining, setRedirectSecondsRemaining] = useState<number | null>(null)
    const redirectToastId = useRef<ReturnType<typeof toaster.create> | null>(null)

    useEffect(() => {
        return () => {
            if (redirectToastId.current) {
                toaster.dismiss(redirectToastId.current)
            }
        }
    }, [toaster])

    useEffect(() => {
        if (redirectSecondsRemaining === null) {
            return
        }

        if (!redirectToastId.current) {
            redirectToastId.current = toaster.create({
                title: 'Password reset successful',
                description: getRedirectDescription(redirectSecondsRemaining),
                type: 'loading',
                duration: Infinity,
            })
        } else {
            toaster.update(redirectToastId.current, {
                title: 'Password reset successful',
                description: getRedirectDescription(redirectSecondsRemaining),
                type: redirectSecondsRemaining === 0 ? 'success' : 'loading',
                duration: redirectSecondsRemaining === 0 ? 1000 : Infinity,
            })
        }

        if (redirectSecondsRemaining === 0) {
            router.push(redirectOnSuccess)
            return
        }

        const timeoutId = window.setTimeout(() => {
            setRedirectSecondsRemaining((current) => {
                if (current === null) {
                    return null
                }

                return current - 1
            })
        }, 1000)

        return () => {
            window.clearTimeout(timeoutId)
        }
    }, [redirectOnSuccess, redirectSecondsRemaining, router, toaster])

    const handleSubmit = async (password: string) => {
        try {
            await onSubmit(password)
            setRedirectSecondsRemaining(5)
        } catch {
            setRedirectSecondsRemaining(null)

            if (redirectToastId.current) {
                toaster.dismiss(redirectToastId.current)
                redirectToastId.current = null
            }

            toaster.create({
                title: 'Password reset failed',
                description: 'Please request a new password reset link and try again.',
                type: 'error',
            })
        }
    }

    return (
        <VStack width={'full'} minHeight={'100vh'}>
            <NavBar showLinks={false} />
            <VStack flex={1} width={'full'} justifyContent={'center'} px={4} pb={6}>
                <Box width={'full'} maxWidth={'md'}>
                    {isValidLink ? (
                        <PasswordReset onSubmit={handleSubmit} />
                    ) : (
                        <VStack alignItems={'start'} gap={3}>
                            <Heading size={'lg'}>Invalid password reset link</Heading>
                            <Text>
                                This password reset link is invalid or has expired. Request a new
                                link and try again.
                            </Text>
                        </VStack>
                    )}
                </Box>
            </VStack>
        </VStack>
    )
}

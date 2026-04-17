// Feature: Password Reset
// Migrated from templates/PasswordReset/PasswordReset.tsx

'use client'

import { Text, VStack } from '@chakra-ui/react'
import useToaster from '@hooks/useToaster'
import NavBar from '@organisms/NavBar/NavBar'
import PasswordResetForm from '@organisms/PasswordResetForm/PasswordResetForm'
import { useRouter } from 'next/router'

type PasswordResetFeatureProps = {
    isValidLink: boolean
    onSubmit: (password: string) => Promise<void>
    redirectOnSuccess: string
}

export default function PasswordResetFeature({
    isValidLink,
    onSubmit,
    redirectOnSuccess,
}: PasswordResetFeatureProps) {
    const toaster = useToaster()
    const router = useRouter()

    const handleSubmit = async (password: string) => {
        try {
            await onSubmit(password)

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
                    router.push(redirectOnSuccess)
                } else {
                    toaster.update(toastId, {
                        title: 'Password reset successful',
                        description: `Redirecting to login in ${remaining} second${remaining !== 1 ? 's' : ''}...`,
                        type: 'loading',
                        duration: Infinity,
                    })
                }
            }, 1000)
        } catch {
            toaster.create({
                title: 'Password reset failed',
                description: 'Please request a new password reset link and try again.',
                type: 'error',
            })
        }
    }

    return (
        <VStack width={'100vw'} minHeight={'100vh'}>
            <NavBar showLinks={false} />
            <VStack p={4} justifyContent={'center'}>
                {isValidLink ? (
                    <PasswordResetForm onSubmit={handleSubmit} />
                ) : (
                    <Text>Invalid password reset link</Text>
                )}
            </VStack>
        </VStack>
    )
}

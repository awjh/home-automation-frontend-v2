'use client'

import { useStytch } from '@stytch/nextjs'
import PasswordResetScreen from '@screens/PasswordResetScreen/PasswordResetScreen'
import { useEffect, useState } from 'react'

export default function PasswordReset() {
    const stytch = useStytch()
    const [parsed, setParsed] = useState<ReturnType<typeof stytch.parseAuthenticateUrl>>(null)

    useEffect(() => {
        setParsed(stytch.parseAuthenticateUrl())
    }, [stytch])

    const isValidLink = Boolean(parsed?.token)

    const handlePasswordReset = async (password: string) => {
        await stytch.passwords.resetByEmail({
            token: parsed!.token,
            password,
            session_duration_minutes: 60,
        })
    }

    return (
        <PasswordResetScreen
            isValidLink={isValidLink}
            onSubmit={handlePasswordReset}
            redirectOnSuccess="/login"
        />
    )
}

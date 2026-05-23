'use client'

import { Suspense } from 'react'
import LoginScreen from '@screens/LoginScreen/LoginScreen'
import { useStytch } from '@stytch/nextjs'

export default function Login() {
    const stytch = useStytch()

    const authenticate = async (email: string, password: string) => {
        await stytch.passwords.authenticate({
            email,
            password,
            session_duration_minutes: 30,
        })
    }

    return (
        <Suspense fallback={null}>
            <LoginScreen onSubmit={authenticate} />
        </Suspense>
    )
}

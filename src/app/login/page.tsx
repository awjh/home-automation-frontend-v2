'use client'

import LoginFeature from '@features/Login/Login'
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

    return <LoginFeature onSubmit={authenticate} />
}

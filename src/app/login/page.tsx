'use client'

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

    return <LoginScreen onSubmit={authenticate} />
}

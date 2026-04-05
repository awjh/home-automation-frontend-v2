'use client'

import LoginTemplate from '@templates/Login/Login'
import { useStytch } from '@stytch/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'

export default function Login() {
    const stytch = useStytch()

    const authenticate = async (email: string, password: string) => {
        await stytch.passwords.authenticate({
            email,
            password,
            session_duration_minutes: 30,
        })
    }

    return <LoginTemplate onSubmit={authenticate} />
}

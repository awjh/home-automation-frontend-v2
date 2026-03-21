'use client'

import { VStack } from '@chakra-ui/react'
import useToaster from '@hooks/useToaster'
import LoginForm from '@molecules/LoginForm/LoginForm'
import NavBar from '@organisms/NavBar/NavBar'
import { useStytch } from '@stytch/react'
import { useRouter } from 'next/navigation'

export default function Login() {
    const stytch = useStytch()
    const toaster = useToaster()
    const router = useRouter()

    const handleLogin = async (email: string, password: string) => {
        try {
            await stytch.passwords.authenticate({
                email,
                password,
                session_duration_minutes: 120,
            })
        } catch (error) {
            toaster.create({
                title: 'Login Failed',
                description: 'Please check your email and password and try again.',
                type: 'error',
            })
        }

        router.push('/')
    }

    return (
        <VStack width={'100vw'} minHeight={'100vh'}>
            <NavBar />
            <VStack p={4} justifyContent={'center'}>
                <LoginForm onSubmit={handleLogin} />
            </VStack>
        </VStack>
    )
}

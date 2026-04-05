'use client'

import { VStack } from '@chakra-ui/react'
import RedirectSearchParam from '@constants/RedirectSearchParam'
import useToaster from '@hooks/useToaster'
import LoginForm from '@molecules/LoginForm/LoginForm'
import NavBar from '@organisms/NavBar/NavBar'
import { useRouter, useSearchParams } from 'next/navigation'

type LoginProps = {
    onSubmit: (email: string, password: string) => Promise<void>
}

export default function Login({ onSubmit }: LoginProps) {
    const toaster = useToaster()
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleSubmit = async (email: string, password: string) => {
        try {
            await onSubmit(email, password)

            const next = searchParams.get(RedirectSearchParam) ?? '/'
            router.push(next)
        } catch {
            toaster.create({
                title: 'Login Failed',
                description: 'Please check your email and password and try again.',
                type: 'error',
            })
        }
    }

    return (
        <VStack width={'100vw'} minHeight={'100vh'}>
            <NavBar showLinks={false} />
            <VStack p={4} justifyContent={'center'}>
                <LoginForm onSubmit={handleSubmit} />
            </VStack>
        </VStack>
    )
}

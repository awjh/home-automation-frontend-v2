import { VStack } from '@chakra-ui/react'
import LoginForm from '@molecules/LoginForm/LoginForm'

export default function Login() {
    return (
        <VStack
            alignItems={'center'}
            justifyContent={'center'}
            width={'100vw'}
            minHeight={'100vh'}
            padding={4}
        >
            <LoginForm />
        </VStack>
    )
}

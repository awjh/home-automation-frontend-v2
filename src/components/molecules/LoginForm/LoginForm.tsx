import Button from '@atoms/Button/Button'
import TextInput from '@atoms/TextInput/TextInput'
import { Fieldset, Link, Stack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'

export default function Login() {
    const { keyColors } = useColorMode()

    return (
        <Fieldset.Root size={'lg'} maxW={'md'}>
            <Stack>
                <Fieldset.Legend color={keyColors.primary} fontSize={'2xl'} fontWeight={'bold'}>
                    Log in to your account
                </Fieldset.Legend>
                <Fieldset.HelperText color={keyColors.primary}>
                    Please enter your username and password to log in. Contact Andrew Hurt for
                    access if you don't have any yet.
                </Fieldset.HelperText>
            </Stack>
            <Fieldset.Content>
                <TextInput label="Username" type="email" required />
                <TextInput label="Password" type="password" required />
            </Fieldset.Content>
            <Button>Log In</Button>
            <Link
                href="/forgot-password"
                color={keyColors.primary}
                _hover={{ textDecoration: 'underline' }}
                fontSize={'md'}
                textAlign={'right'}
            >
                Forgot password?
            </Link>
        </Fieldset.Root>
    )
}

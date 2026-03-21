import Button from '@atoms/Button/Button'
import PasswordInput from '@atoms/PasswordInput/PasswordInput'
import TextInput from '@atoms/TextInput/TextInput'
import { Fieldset, Link, Stack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import { Controller, useForm } from 'react-hook-form'

type LoginFormValues = {
    email: string
    password: string
}

type LoginFormProps = {
    onSubmit: (email: string, password: string) => void
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
    const { keyColors } = useColorMode()
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        defaultValues: { email: '', password: '' },
        mode: 'onTouched',
    })

    return (
        <form onSubmit={handleSubmit((input) => onSubmit(input.email, input.password))}>
            <Fieldset.Root size={'lg'} maxW={'md'}>
                <Stack gap={6}>
                    <Fieldset.Legend color={keyColors.primary} fontSize={'2xl'} fontWeight={'bold'}>
                        Log in to your account
                    </Fieldset.Legend>
                    <Fieldset.HelperText color={keyColors.primary}>
                        Please enter your username and password to log in. Contact Andrew Hurt for
                        access if you don&apos;t have any yet.
                    </Fieldset.HelperText>
                    <Fieldset.Content>
                        <Controller
                            name="email"
                            control={control}
                            rules={{
                                required: 'Email is required',
                                pattern: {
                                    value: /^\S+@\S+\.\S+$/,
                                    message: 'Please enter a valid email address',
                                },
                            }}
                            render={({ field }) => (
                                <TextInput label="Email" type="email" required {...field} />
                            )}
                        />
                        <Controller
                            name="password"
                            control={control}
                            rules={{ required: 'Password is required' }}
                            render={({ field }) => <PasswordInput label="Password" {...field} />}
                        />
                    </Fieldset.Content>
                    <Button type={'submit'}>Log In</Button>
                    <Link
                        href="/forgot-password"
                        color={keyColors.primary}
                        _hover={{ textDecoration: 'underline' }}
                        fontSize={'md'}
                        textAlign={'right'}
                    >
                        Forgot password?
                    </Link>
                </Stack>
            </Fieldset.Root>
        </form>
    )
}

'use client'

import Button from '@atoms/Button/Button'
import PasswordInput from '@atoms/PasswordInput/PasswordInput'
import TextInput from '@atoms/TextInput/TextInput'
import { Fieldset, Link, Stack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

type LoginFormValues = {
    email: string
    password: string
}

type LoginProps = {
    onSubmit: (email: string, password: string) => void | Promise<void>
}

export default function Login({ onSubmit }: LoginProps) {
    const { keyColors } = useColorMode()
    const [isLoading, setIsLoading] = useState(false)
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        defaultValues: { email: '', password: '' },
        mode: 'onTouched',
    })

    const submitHandler = async (input: LoginFormValues) => {
        setIsLoading(true)
        try {
            await onSubmit(input.email, input.password)
        } catch {
            // parent should handle error
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form noValidate onSubmit={handleSubmit(submitHandler)}>
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
                                <TextInput
                                    label="Email"
                                    type="email"
                                    required
                                    errorMessage={errors.email?.message}
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="password"
                            control={control}
                            rules={{ required: 'Password is required' }}
                            render={({ field }) => (
                                <PasswordInput
                                    label="Password"
                                    errorMessage={errors.password?.message}
                                    {...field}
                                />
                            )}
                        />
                    </Fieldset.Content>
                    <Button type={'submit'} loading={isLoading} loadingText="Logging in">
                        Log In
                    </Button>
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

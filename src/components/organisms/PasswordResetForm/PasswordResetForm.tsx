import Button from '@atoms/Button/Button'
import PasswordInput from '@atoms/PasswordInput/PasswordInput'
import PasswordStrengthMeter from '@atoms/PasswordStrengthMeter/PasswordStrengthMeter'
import { Fieldset, Stack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import { Controller, useForm } from 'react-hook-form'
import zxcvbn from 'zxcvbn'

type PasswordResetFormValues = {
    newPassword: string
    confirmPassword: string
}

interface PasswordResetFormProps {
    onSubmit: (password: string) => void
}

export default function PasswordResetForm({ onSubmit }: PasswordResetFormProps) {
    const { keyColors } = useColorMode()
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<PasswordResetFormValues>({
        defaultValues: { newPassword: '', confirmPassword: '' },
        mode: 'onTouched',
    })

    const newPassword = watch('newPassword')

    const handleFormSubmit = (data: PasswordResetFormValues) => {
        onSubmit(data.newPassword)
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Fieldset.Root size={'lg'} maxW={'md'}>
                <Stack>
                    <Fieldset.Legend color={keyColors.primary} fontSize={'2xl'} fontWeight={'bold'}>
                        Reset your password
                    </Fieldset.Legend>
                    <Fieldset.HelperText color={keyColors.primary}>
                        Please enter your new password below. Make sure it meets all the security
                        requirements.
                    </Fieldset.HelperText>
                </Stack>
                <Fieldset.Content>
                    <Controller
                        name="newPassword"
                        control={control}
                        rules={{
                            required: 'New password is required',
                            validate: (value) =>
                                zxcvbn(value).score === 4 || 'Password is too weak',
                        }}
                        render={({ field }) => (
                            <PasswordInput
                                label="New Password"
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                errorMessage={errors.newPassword?.message}
                            />
                        )}
                    />
                    <PasswordStrengthMeter passwordValue={newPassword} />
                    <Controller
                        name="confirmPassword"
                        control={control}
                        rules={{
                            required: 'Please confirm your password',
                            validate: (value) => value === newPassword || 'Passwords do not match',
                        }}
                        render={({ field }) => (
                            <PasswordInput
                                label="Confirm Password"
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                errorMessage={errors.confirmPassword?.message}
                            />
                        )}
                    />
                </Fieldset.Content>
                <Button type="submit">Reset Password</Button>
            </Fieldset.Root>
        </form>
    )
}

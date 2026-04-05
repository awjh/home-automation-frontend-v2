import { Field, Input } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import { HTMLInputTypeAttribute } from 'react'

interface TextInputProps {
    required: boolean
    type: Omit<HTMLInputTypeAttribute, 'password'>
    label: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onBlur?: () => void
    errorMessage?: string
}

export default function TextInput({
    type,
    label,
    required,
    value,
    onChange,
    onBlur,
    errorMessage,
}: TextInputProps) {
    const { keyColors } = useColorMode()

    return (
        <Field.Root required={required} invalid={!!errorMessage}>
            <Field.Label color={keyColors.primary}>
                {label}
                {required ? <Field.RequiredIndicator /> : null}
            </Field.Label>
            <Input
                type={type as string}
                borderColor={keyColors.primary}
                borderWidth={2}
                borderRadius={0}
                color={keyColors.primary}
                pl={4}
                value={value ?? ''}
                onChange={onChange}
                onBlur={onBlur}
            />
            {errorMessage && <Field.ErrorText>{errorMessage}</Field.ErrorText>}
        </Field.Root>
    )
}

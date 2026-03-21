import { Field, Input } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import { HTMLInputTypeAttribute } from 'react'

interface TextInputProps {
    required: boolean
    type: Omit<HTMLInputTypeAttribute, 'password'>
    label: string
}

export default function TextInput({ type, label, required }: TextInputProps) {
    const { keyColors } = useColorMode()

    return (
        <Field.Root required={required}>
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
            />
            <Field.ErrorText />
        </Field.Root>
    )
}
